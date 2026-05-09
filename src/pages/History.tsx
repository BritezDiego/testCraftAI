import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Heart, Trash2, ArrowRight, History as HistoryIcon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useGenerations } from "../hooks/useGenerations";
import LoadingSpinner from "../components/LoadingSpinner";
import type { OutputFormat } from "../lib/types";
import { Plus } from "lucide-react";

const FORMAT_COLORS: Record<string, string> = {
  gherkin: "bg-sky-500/20 text-sky-300",
  steps: "bg-violet-500/20 text-violet-300",
  checklist: "bg-emerald-500/20 text-emerald-300",
};

export default function History() {
  const { profile } = useAuth();
  const { generations, loading, fetchGenerations, toggleFavorite, deleteGeneration } = useGenerations(profile?.id);

  const [search, setSearch] = useState("");
  const [formatFilter, setFormatFilter] = useState<OutputFormat | "">("");
  const [favOnly, setFavOnly] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.id) {
      fetchGenerations({
        search: search || undefined,
        format: formatFilter || undefined,
        favoritesOnly: favOnly || undefined,
      });
    }
  }, [profile?.id, search, formatFilter, favOnly, fetchGenerations]);

  async function handleDelete(id: string) {
    setDeleting(id);
    await deleteGeneration(id);
    setDeleting(null);
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Historial</h1>
            <p className="text-sm text-slate-400 mt-1">
              {generations.length} generacion{generations.length !== 1 ? "es" : ""}
            </p>
          </div>
          <Link
            to="/generate"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Nueva generación
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por user story..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value as OutputFormat | "")}
                className="pl-8 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-sky-500 transition-all"
              >
                <option value="">Todos los formatos</option>
                <option value="gherkin">Gherkin</option>
                <option value="steps">Steps</option>
                <option value="checklist">Checklist</option>
              </select>
            </div>
            <button
              onClick={() => setFavOnly((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                favOnly
                  ? "bg-red-500/10 border-red-500/40 text-red-400"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
              }`}
            >
              <Heart className={`h-4 w-4 ${favOnly ? "fill-current" : ""}`} />
              Favoritos
            </button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <LoadingSpinner className="py-16" />
        ) : generations.length === 0 ? (
          <div className="rounded-xl bg-slate-800 border border-slate-700 p-12 text-center">
            <HistoryIcon className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium mb-1">
              {search || formatFilter || favOnly ? "Sin resultados para tu búsqueda" : "No hay generaciones todavía"}
            </p>
            {!search && !formatFilter && !favOnly && (
              <Link
                to="/generate"
                className="inline-block mt-4 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium transition-all"
              >
                Generar ahora
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {generations.map((gen) => (
              <div
                key={gen.id}
                className="rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all group"
              >
                <Link to={`/generation/${gen.id}`} className="block p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 line-clamp-2 group-hover:text-slate-100 transition-colors">
                        {gen.user_story}
                      </p>
                      <div className="flex items-center flex-wrap gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${FORMAT_COLORS[gen.output_format] ?? "bg-slate-700 text-slate-400"}`}>
                          {gen.output_format}
                        </span>
                        <span className="text-xs text-slate-500">
                          {gen.context.replace("_", " ")}
                        </span>
                        <span className="text-xs text-slate-600">
                          {new Date(gen.created_at).toLocaleDateString("es-AR", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </span>
                        {gen.is_favorite && <span className="text-xs text-red-400">♥</span>}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-sky-400 shrink-0 mt-1 transition-colors" />
                  </div>
                </Link>
                {/* Actions */}
                <div className="flex items-center gap-1 px-4 pb-3 border-t border-slate-700/50 pt-2">
                  <button
                    onClick={() => toggleFavorite(gen.id, gen.is_favorite)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                      gen.is_favorite
                        ? "text-red-400 hover:bg-red-500/10"
                        : "text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${gen.is_favorite ? "fill-current" : ""}`} />
                    {gen.is_favorite ? "Quitar favorito" : "Favorito"}
                  </button>
                  <button
                    onClick={() => handleDelete(gen.id)}
                    disabled={deleting === gen.id}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deleting === gen.id ? "Borrando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
