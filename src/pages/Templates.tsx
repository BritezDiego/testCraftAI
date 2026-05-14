import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookmarkPlus, FileCode, List, CheckSquare, Trash2, Play, Plus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useCustomTemplates } from "../hooks/useCustomTemplates";
import LoadingSpinner from "../components/LoadingSpinner";
import type { CustomTemplate } from "../lib/types";

const FORMAT_ICONS: Record<string, React.ElementType> = {
  gherkin: FileCode,
  steps: List,
  checklist: CheckSquare,
};

const FORMAT_COLORS: Record<string, string> = {
  gherkin: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  steps: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  checklist: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

export default function Templates() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { templates, loading, fetchTemplates, deleteTemplate, templateLimit } = useCustomTemplates(
    profile?.id,
    profile?.plan ?? "free"
  );

  useEffect(() => {
    if (profile?.id) fetchTemplates();
  }, [profile?.id, fetchTemplates]);

  async function handleDelete(id: string) {
    if (!window.confirm("¿Eliminar este template?")) return;
    await deleteTemplate(id);
  }

  function handleUse(t: CustomTemplate) {
    navigate("/generate", { state: { template: t } });
  }

  const plan = profile?.plan ?? "free";
  const limitLabel = templateLimit === Infinity ? "ilimitados" : `hasta ${templateLimit}`;

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Mis Templates</h1>
            <p className="text-sm text-slate-400 mt-1">
              {templates.length} de {limitLabel} templates
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full capitalize font-medium ${
                plan === "team" ? "bg-violet-500/20 text-violet-300" :
                plan === "pro"  ? "bg-sky-500/20 text-sky-300" :
                "bg-slate-700 text-slate-400"
              }`}>
                {plan}
              </span>
            </p>
          </div>
          <button
            onClick={() => navigate("/generate")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Crear nuevo
          </button>
        </div>

        {loading ? (
          <LoadingSpinner className="py-16" />
        ) : templates.length === 0 ? (
          <div className="rounded-xl bg-slate-800 border border-slate-700 p-12 text-center">
            <BookmarkPlus className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium mb-1">No tenés templates guardados</p>
            <p className="text-sm text-slate-500 mb-4">
              Generá test cases y guardalos como templates para reutilizar después.
            </p>
            <button
              onClick={() => navigate("/generate")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium transition-all"
            >
              <Plus className="h-4 w-4" />
              Ir al generador
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((t) => {
              const FormatIcon = FORMAT_ICONS[t.format] ?? FileCode;
              return (
                <div
                  key={t.id}
                  className="rounded-xl bg-slate-800 border border-slate-700 p-5 flex flex-col gap-3 hover:border-slate-600 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-100 text-sm leading-snug flex-1">{t.name}</h3>
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${FORMAT_COLORS[t.format] ?? ""}`}>
                      <FormatIcon className="h-3 w-3" />
                      {t.format}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{t.user_story}</p>

                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="capitalize">{t.context.replace("_", " ")}</span>
                    <span>·</span>
                    <span>{t.include_edge_cases ? "Con edge cases" : "Sin edge cases"}</span>
                    <span>·</span>
                    <span>{new Date(t.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-700">
                    <button
                      onClick={() => handleUse(t)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-medium transition-all"
                    >
                      <Play className="h-3.5 w-3.5" />
                      Usar
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 text-xs transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
