declare global {
  interface Window {
    Paddle: any;
  }
}

const PADDLE_CLIENT_TOKEN = "live_57e191d0b3f0b2c2eff038f4ea1";

const PADDLE_PRICES = {
  pro: "pri_01krkjmk76xk8cx4pw06rr19n6",
  team: "pri_01krkjnr4tdh1ny5n5f7b16pxf",
};

export function initializePaddle() {
  if (typeof window !== "undefined" && window.Paddle) {
    window.Paddle.Initialize({ token: PADDLE_CLIENT_TOKEN });
  }
}

export function openCheckout(
  plan: "pro" | "team",
  user: { id: string; email: string }
) {
  if (!window.Paddle) {
    console.error("Paddle.js not loaded");
    return;
  }
  window.Paddle.Checkout.open({
    items: [{ priceId: PADDLE_PRICES[plan], quantity: 1 }],
    customer: { email: user.email },
    customData: { user_id: user.id, plan },
    settings: {
      displayMode: "overlay",
      theme: "dark",
      locale: "en",
    },
    successCallback: () => {
      window.location.href = `/dashboard?payment=success&plan=${plan}`;
    },
  });
}

export function openCustomerPortal(paddleSubscriptionId: string) {
  window.open(
    `https://customer-portal.paddle.com/subscriptions/${paddleSubscriptionId}`,
    "_blank"
  );
}
