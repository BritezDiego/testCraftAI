export type Plan = "free" | "pro" | "team";
export type OutputFormat = "gherkin" | "steps" | "checklist";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "paused" | "trialing" | "inactive";
export type AppContext =
  | "web_app"
  | "mobile_app"
  | "api"
  | "banking"
  | "ecommerce"
  | "healthcare"
  | "general";

export interface PricingFeature {
  text: string;
  comingSoon?: boolean;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  credits_used: number;
  credits_limit: number;
  credits_reset_at: string;
  stripe_customer_id: string | null;
  paddle_customer_id: string | null;
  paddle_subscription_id: string | null;
  paddle_subscription_status: SubscriptionStatus;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  user_story: string;
  output_text: string;
  output_format: OutputFormat;
  context: AppContext;
  include_edge_cases: boolean;
  tokens_used: number;
  is_favorite: boolean;
  is_public: boolean;
  public_slug: string | null;
  created_at: string;
}

export interface CustomTemplate {
  id: string;
  user_id: string;
  name: string;
  user_story: string;
  context: AppContext;
  format: OutputFormat;
  include_edge_cases: boolean;
  created_at: string;
  updated_at: string;
}

export interface GenerateRequest {
  userStory: string;
  format: OutputFormat;
  context: AppContext;
  includeEdgeCases: boolean;
}

export interface GenerateResponse {
  generation: Generation;
  credits_remaining: number;
}

export interface PricingPlan {
  id: Plan;
  name: string;
  price: string;
  period: string;
  description: string;
  credits: number;
  features: PricingFeature[];
  highlighted: boolean;
  cta: string;
}
