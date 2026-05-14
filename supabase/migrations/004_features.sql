-- ============================================================
-- 004_features.sql — Sharing + Custom Templates
-- ============================================================

-- Mejora 2: Shareable generations
ALTER TABLE public.generations
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS public_slug TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_generations_public_slug
  ON public.generations(public_slug) WHERE is_public = true;

-- Allow anyone to read public generations (no auth required)
CREATE POLICY "Anyone can view public generations"
  ON public.generations
  FOR SELECT
  USING (is_public = true);

-- Mejora 3: Custom templates
CREATE TABLE IF NOT EXISTS public.custom_templates (
  id              UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID         NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name            TEXT         NOT NULL,
  user_story      TEXT         NOT NULL,
  context         TEXT         NOT NULL DEFAULT 'general',
  format          TEXT         NOT NULL DEFAULT 'gherkin',
  include_edge_cases BOOLEAN   NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own templates"
  ON public.custom_templates
  FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_custom_templates_user
  ON public.custom_templates(user_id);
