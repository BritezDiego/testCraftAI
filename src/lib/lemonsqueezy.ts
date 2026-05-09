export const LEMONSQUEEZY_CHECKOUT = {
  pro: "https://testcraftai.lemonsqueezy.com/checkout/buy/f82554ec-205c-4ec6-a30e-fa0e08b37019",
  team: "https://testcraftai.lemonsqueezy.com/checkout/buy/ffd9ece9-0d62-43fa-9122-5a644a920c38",
};

export function redirectToCheckout(plan: "pro" | "team", user: { id: string; email: string }) {
  const url = new URL(LEMONSQUEEZY_CHECKOUT[plan]);

  url.searchParams.set("checkout[custom][user_id]", user.id);
  url.searchParams.set("checkout[custom][plan]", plan);
  url.searchParams.set("checkout[email]", user.email);
  url.searchParams.set(
    "checkout[redirect_url]",
    `${window.location.origin}/dashboard?payment=success&plan=${plan}`
  );

  window.location.href = url.toString();
}

export function redirectToCustomerPortal(lsCustomerId: string) {
  window.location.href = `https://testcraftai.lemonsqueezy.com/billing?customer_id=${lsCustomerId}`;
}
