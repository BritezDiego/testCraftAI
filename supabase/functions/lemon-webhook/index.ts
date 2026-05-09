import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LEMON_WEBHOOK_SECRET = Deno.env.get("LEMON_WEBHOOK_SECRET")!;

const PLAN_CREDITS: Record<string, number> = {
  pro: 200,
  team: 1000,
  free: 10,
};

async function verifySignature(body: string, signature: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(LEMON_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex === signature;
}

async function findUserByCustomerId(
  supabase: ReturnType<typeof createClient>,
  customerId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("ls_customer_id", customerId)
    .single();
  return data?.id ?? null;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("x-signature") ?? "";

    const isValid = await verifySignature(body, signature);
    if (!isValid) {
      console.error("Invalid webhook signature");
      return new Response("Invalid signature", { status: 401 });
    }

    const payload = JSON.parse(body);
    const eventName: string = payload.meta.event_name;
    const customData = payload.meta.custom_data ?? {};
    const userId: string | undefined = customData.user_id;
    const plan: string = customData.plan ?? "pro";
    const attrs = payload.data.attributes;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const resolveUserId = async (): Promise<string | null> => {
      if (userId) return userId;
      const cid = attrs.customer_id?.toString();
      if (cid) return findUserByCustomerId(supabase, cid);
      return null;
    };

    switch (eventName) {
      case "subscription_created": {
        const customerId = attrs.customer_id?.toString();
        const subscriptionId = payload.data.id?.toString();
        const variantId = attrs.variant_id?.toString();
        const periodEnd = attrs.renews_at;
        const target = await resolveUserId();

        if (target) {
          await supabase.from("profiles").update({
            plan,
            ls_customer_id: customerId,
            ls_subscription_id: subscriptionId,
            ls_variant_id: variantId,
            subscription_status: "active",
            credits_used: 0,
            credits_limit: PLAN_CREDITS[plan] ?? 200,
            current_period_end: periodEnd,
          }).eq("id", target);
          console.log(`subscription_created: upgraded ${target} to ${plan}`);
        }
        break;
      }

      case "subscription_updated": {
        const status: string = attrs.status;
        const periodEnd = attrs.renews_at;
        const target = await resolveUserId();

        if (target) {
          const dbStatus =
            status === "active" ? "active"
            : status === "past_due" ? "past_due"
            : status === "paused" ? "paused"
            : "cancelled";

          await supabase.from("profiles").update({
            subscription_status: dbStatus,
            current_period_end: periodEnd,
            ...(status === "active" ? { credits_used: 0 } : {}),
          }).eq("id", target);
          console.log(`subscription_updated: ${target} → ${dbStatus}`);
        }
        break;
      }

      case "subscription_cancelled": {
        const endsAt = attrs.ends_at;
        const target = await resolveUserId();

        if (target) {
          await supabase.from("profiles").update({
            subscription_status: "cancelled",
            current_period_end: endsAt,
          }).eq("id", target);
          console.log(`subscription_cancelled: ${target}, access until ${endsAt}`);
        }
        break;
      }

      case "subscription_expired": {
        const target = await resolveUserId();

        if (target) {
          await supabase.from("profiles").update({
            plan: "free",
            subscription_status: "inactive",
            ls_subscription_id: null,
            ls_variant_id: null,
            credits_limit: PLAN_CREDITS.free,
            credits_used: 0,
          }).eq("id", target);
          console.log(`subscription_expired: ${target} downgraded to free`);
        }
        break;
      }

      case "subscription_payment_success": {
        const target = await resolveUserId();

        if (target) {
          await supabase.from("profiles").update({
            credits_used: 0,
            subscription_status: "active",
          }).eq("id", target);
          console.log(`subscription_payment_success: credits reset for ${target}`);
        }
        break;
      }

      case "subscription_payment_failed": {
        const target = await resolveUserId();

        if (target) {
          await supabase.from("profiles").update({
            subscription_status: "past_due",
          }).eq("id", target);
          console.log(`subscription_payment_failed: ${target} marked past_due`);
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${eventName}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Webhook error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
