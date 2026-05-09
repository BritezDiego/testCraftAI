export type Plan = "free" | "pro" | "team";
export type OutputFormat = "gherkin" | "steps" | "checklist";
export type AppContext =
  | "web_app"
  | "mobile_app"
  | "api"
  | "banking"
  | "ecommerce"
  | "healthcare"
  | "general";

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
  created_at: string;
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
  features: string[];
  highlighted: boolean;
  cta: string;
}
