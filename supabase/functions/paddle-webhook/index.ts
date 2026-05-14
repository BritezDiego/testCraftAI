import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PADDLE_WEBHOOK_SECRET = Deno.env.get("PADDLE_WEBHOOK_SECRET")!;

const PLAN_CREDITS: Record<string, number> = { pro: 200, team: 1000, free: 10 };

async function verifyPaddleWebhook(body: string, signatureHeader: string): Promise<boolean> {
  try {
    const parts = signatureHeader.split(";");
    const tsValue = parts.find((p) => p.startsWith("ts="))?.replace("ts=", "");
    const h1Value = parts.find((p) => p.startsWith("h1="))?.replace("h1=", "");
    if (!tsValue || !h1Value) return false;

    const signedPayload = `${tsValue}:${body}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(PADDLE_WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
    const computedHex = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return computedHex === h1Value;
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const body = await req.text();
    const signatureHeader = req.headers.get("paddle-signature") || "";

    const isValid = await verifyPaddleWebhook(body, signatureHeader);
    if (!isValid) {
      console.error("Invalid Paddle webhook signature");
      return new Response("Invalid signature", { status: 401 });
    }

    const payload = JSON.parse(body);
    const eventType = payload.event_type;
    const data = payload.data;
    const customData = data.custom_data || {};
    const userId = customData.user_id;
    const plan = customData.plan || "pro";

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    async function findUserByPaddleCustomer(paddleCustomerId: string) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("paddle_customer_id", paddleCustomerId)
        .single();
      return profile?.id;
    }

    switch (eventType) {
      case "subscription.created":
      case "subscription.activated": {
        const paddleCustomerId = data.customer_id;
        const paddleSubscriptionId = data.id;
        const nextBilledAt = data.next_billed_at;
        const targetUserId = userId || (await findUserByPaddleCustomer(paddleCustomerId));
        if (targetUserId) {
          await supabase.from("profiles").update({
            plan,
            paddle_customer_id: paddleCustomerId,
            paddle_subscription_id: paddleSubscriptionId,
            paddle_subscription_status: "active",
            credits_used: 0,
            credits_limit: PLAN_CREDITS[plan] || 200,
            current_period_end: nextBilledAt,
          }).eq("id", targetUserId);
        }
        break;
      }

      case "subscription.updated": {
        const paddleCustomerId = data.customer_id;
        const status = data.status;
        const nextBilledAt = data.next_billed_at;
        const targetUserId = userId || (await findUserByPaddleCustomer(paddleCustomerId));
        if (targetUserId) {
          const updateData: Record<string, any> = {
            paddle_subscription_status: status,
            current_period_end: nextBilledAt,
          };
          if (status === "active") updateData.credits_used = 0;
          await supabase.from("profiles").update(updateData).eq("id", targetUserId);
        }
        break;
      }

      case "subscription.canceled": {
        const paddleCustomerId = data.customer_id;
        const scheduledChangeAt = data.scheduled_change?.effective_at;
        const targetUserId = userId || (await findUserByPaddleCustomer(paddleCustomerId));
        if (targetUserId) {
          await supabase.from("profiles").update({
            paddle_subscription_status: "canceled",
            current_period_end: scheduledChangeAt,
          }).eq("id", targetUserId);
        }
        break;
      }

      case "subscription.past_due": {
        const paddleCustomerId = data.customer_id;
        const targetUserId = userId || (await findUserByPaddleCustomer(paddleCustomerId));
        if (targetUserId) {
          await supabase.from("profiles").update({
            paddle_subscription_status: "past_due",
          }).eq("id", targetUserId);
        }
        break;
      }

      case "transaction.completed": {
        const paddleCustomerId = data.customer_id;
        const targetUserId = userId || (await findUserByPaddleCustomer(paddleCustomerId));
        if (targetUserId) {
          await supabase.from("profiles").update({
            credits_used: 0,
            paddle_subscription_status: "active",
          }).eq("id", targetUserId);
        }
        break;
      }

      default:
        console.log(`Unhandled Paddle event: ${eventType}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
