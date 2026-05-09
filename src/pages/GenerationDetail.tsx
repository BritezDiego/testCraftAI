import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useGenerations } from "../hooks/useGenerations";
import TestCaseOutput from "../components/TestCaseOutput";
import TestCaseEditor from "../components/TestCaseEditor";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Generation } from "../lib/types";

const CONTEXT_LABELS: Record<string, string> = {
  web_app: "Web App",
  mobile_app: "Mobile App",
  api: "API",
  banking: "Banking",
  ecommerce: "Ecommerce",
  healthcare: "Healthcare",
  general: "General",
};

export default function GenerationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { getById, toggleFavorite, deleteGeneration } = useGenerations(profile?.id);

  const [generation, setGeneration] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const data = await getById(id);
      if (!data) setError("Generación no encontrada.");
      else setGeneration(data);
      setLoading(false);
    }
    load();
  }, [id, getById]);

  async function handleDelete() {
    if (!generation) return;
    if (!confirm("¿Eliminar esta generación? Esta acción no se puede deshacer.")) return;
    setDeleting(true);
    await deleteGeneration(generation.id);
    navigate("/history");
  }

  function handleToggleFavorite(genId: string, current: boolean) {
    toggleFavorite(genId, current);
    setGeneration((prev) => prev ? { ...prev, is_favorite: !current } : null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !generation) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
          <p className="text-slate-300 font-medium mb-4">{error ?? "Generación no encontrada"}</p>
          <Link to="/history" className="text-sky-400 hover:text-sky-300 text-sm">
            ← Volver al historial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {/* Back */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/history"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al historial
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>

        {/* Meta */}
        <div className="rounded-xl bg-slate-800 border border-slate-700 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">User story</p>
              <p className="text-slate-300 text-sm leading-relaxed">{generation.user_story}</p>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0 text-right">
              <div className="flex flex-wrap gap-2 justify-end">
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-medium capitalize">
                  {generation.output_format}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">
                  {CONTEXT_LABELS[generation.context] ?? generation.context}
                </span>
                {generation.include_edge_cases && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Edge cases
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {new Date(generation.created_at).toLocaleDateString("es-AR", {
                  day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <TestCaseOutput generation={generation} onToggleFavorite={handleToggleFavorite} />
          <TestCaseEditor
            generation={generation}
            onSave={(updated) => setGeneration(updated)}
          />
        </div>
      </div>
    </div>
  );
}
