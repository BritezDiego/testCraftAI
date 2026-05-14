ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS paddle_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS paddle_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS paddle_subscription_status TEXT DEFAULT 'inactive'
    CHECK (paddle_subscription_status IN ('active', 'canceled', 'past_due', 'paused', 'trialing', 'inactive')),
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_profiles_paddle_customer ON public.profiles(paddle_customer_id);
