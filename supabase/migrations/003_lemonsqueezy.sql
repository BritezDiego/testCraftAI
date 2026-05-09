-- Agregar campos de Lemon Squeezy a profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ls_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS ls_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS ls_variant_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive'
    CHECK (subscription_status IN ('active', 'cancelled', 'past_due', 'paused', 'inactive')),
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

-- Índice para búsqueda por customer ID
CREATE INDEX IF NOT EXISTS idx_profiles_ls_customer ON public.profiles(ls_customer_id);
