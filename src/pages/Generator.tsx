import { useState } from "react";
import { Sparkles, FileCode, List, CheckSquare, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { TEMPLATES, FORMAT_OPTIONS, CONTEXT_OPTIONS } from "../lib/constants";
import TestCaseOutput from "../components/TestCaseOutput";
import { useGenerations } from "../hooks/useGenerations";
import type { Generation, OutputFormat, AppContext } from "../lib/types";

const FORMAT_ICONS: Record<OutputFormat, React.ElementType> = {
  gherkin: FileCode,
  steps: List,
  checklist: CheckSquare,
};

function SkeletonLoader() {
  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div className="flex gap-2">
          <div className="shimmer h-5 w-16 rounded-full" />
          <div className="shimmer h-5 w-24 rounded-full" />
        </div>
        <div className="flex gap-2">
          <div className="shimmer h-8 w-20 rounded-lg" />
          <div className="shimmer h-8 w-20 rounded-lg" />
        </div>
      </div>
      <div className="p-4 space-y-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`shimmer h-4 rounded ${i % 3 === 0 ? "w-3/4" : i % 3 === 1 ? "w-full" : "w-5/6"}`} />
        ))}
      </div>
    </div>
  );
}

export default function Generator() {
  const { user, profile, refreshProfile } = useAuth();
  const { toggleFavorite } = useGenerations(user?.id);

  const [userStory, setUserStory] = useState("");
  const [format, setFormat] = useState<OutputFormat>("gherkin");
  const [context, setContext] = useState<AppContext>("web_app");
  const [includeEdgeCases, setIncludeEdgeCases] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Generation | null>(null);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);

  const creditsLeft = creditsRemaining ?? Math.max(0, (profile?.credits_limit ?? 10) - (profile?.credits_used ?? 0));
  const hasCredits = creditsLeft > 0;

  async function handleGenerate() {
    if (!userStory.trim() || userStory.trim().length < 10) {
      setError("La user story debe tener al menos 10 caracteres.");
      return;
    }
    if (!hasCredits) {
      setError("No te quedan créditos. Hacé upgrade para obtener más.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) throw new Error("No autenticado");

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-test-cases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userStory: userStory.trim(), format, context, includeEdgeCases }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Error al generar");
      }

      setResult(data.generation as Generation);
      setCreditsRemaining(data.credits_remaining);
      await refreshProfile();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function handleToggleFavorite(id: string, current: boolean) {
    toggleFavorite(id, current);
    if (result?.id === id) {
      setResult((prev) => prev ? { ...prev, is_favorite: !current } : null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-100">Generador de Test Cases</h1>
          <p className="text-sm text-slate-400 mt-1">Pegá una user story y obtené test cases profesionales en segundos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input column */}
          <div className="space-y-4">
            {/* Templates */}
            <div>
              <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Templates rápidos</p>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setUserStory(t.story)}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:border-sky-500/50 hover:text-sky-300 transition-all"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                User Story
              </label>
              <textarea
                value={userStory}
                onChange={(e) => setUserStory(e.target.value)}
                placeholder="Pegá tu user story acá...

Ejemplo: As a user, I want to login with email and password so that I can access my dashboard"
                className="w-full min-h-[200px] px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 resize-y transition-all leading-relaxed"
              />
              <p className="text-xs text-slate-600 mt-1 text-right">{userStory.length} caracteres</p>
            </div>

            {/* Options */}
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-4 space-y-4">
              {/* Format */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Formato de salida</label>
                <div className="flex gap-2">
                  {FORMAT_OPTIONS.map((opt) => {
                    const Icon = FORMAT_ICONS[opt.value];
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setFormat(opt.value)}
                        className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                          format === opt.value
                            ? "bg-sky-500/20 border-sky-500/60 text-sky-300"
                            : "bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Context */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Contexto de la aplicación</label>
                <select
                  value={context}
                  onChange={(e) => setContext(e.target.value as AppContext)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-slate-200 text-sm focus:outline-none focus:border-sky-500 transition-all"
                >
                  {CONTEXT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Edge cases toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-300">Incluir edge cases</p>
                  <p className="text-xs text-slate-500">Boundary values, casos límite y escenarios negativos</p>
                </div>
                <button
                  onClick={() => setIncludeEdgeCases((v) => !v)}
                  className={`relative h-6 w-11 rounded-full overflow-hidden transition-all duration-200 ${
                    includeEdgeCases ? "bg-sky-500" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      includeEdgeCases ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !hasCredits || !userStory.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold transition-all shadow-md shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generando con IA...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generar Test Cases
                </>
              )}
            </button>

            {/* Credits indicator */}
            <p className="text-center text-xs text-slate-500">
              {hasCredits ? (
                <>
                  <span className="text-slate-300 font-medium">{creditsLeft}</span> crédito
                  {creditsLeft !== 1 ? "s" : ""} restante{creditsLeft !== 1 ? "s" : ""} este mes
                </>
              ) : (
                <span className="text-red-400">Sin créditos disponibles — <a href="/pricing" className="underline">upgrade</a></span>
              )}
            </p>
          </div>

          {/* Output column */}
          <div>
            {loading && <SkeletonLoader />}

            {!loading && result && (
              <TestCaseOutput
                generation={result}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {!loading && !result && (
              <div className="rounded-xl border-2 border-dashed border-slate-700 h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <div className="h-16 w-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-slate-600" />
                </div>
                <p className="text-slate-400 font-medium mb-1">Tus test cases aparecerán acá</p>
                <p className="text-sm text-slate-600">
                  Escribí una user story y hacé click en "Generar"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
