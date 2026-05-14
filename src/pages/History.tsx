import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, Heart, Trash2, ArrowRight, History as HistoryIcon,
  Plus, FileCode, List, CheckSquare, ChevronDown,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useGenerations, type SortOrder, type DateRange } from "../hooks/useGenerations";
import LoadingSpinner from "../components/LoadingSpinner";
import { CONTEXT_OPTIONS } from "../lib/constants";
import type { OutputFormat, AppContext } from "../lib/types";

const FORMAT_COLORS: Record<string, string> = {
  gherkin: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  steps: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  checklist: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

const FORMAT_OPTS: { value: OutputFormat | ""; label: string; icon?: React.ElementType }[] = [
  { value: "", label: "Todos" },
  { value: "gherkin", label: "Gherkin", icon: FileCode },
  { value: "steps", label: "Steps", icon: List },
  { value: "checklist", label: "Checklist", icon: CheckSquare },
];

const DATE_OPTS: { value: DateRange | ""; label: string }[] = [
  { value: "", label: "Todo el tiempo" },
  { value: "month", label: "Último mes" },
  { value: "3months", label: "Últimos 3 meses" },
];

const SORT_OPTS: { value: SortOrder; label: string }[] = [
  { value: "desc", label: "Más recientes primero" },
  { value: "asc", label: "Más antiguos primero" },
  { value: "alpha", label: "Alfabético" },
];

export default function History() {
  const { profile } = useAuth();
  const { generations, loading, fetchGenerations, toggleFavorite, deleteGeneration } = useGenerations(profile?.id);

  const [search, setSearch] = useState("");
  const [formatFilter, setFormatFilter] = useState<OutputFormat | "">("");
  const [contextFilter, setContextFilter] = useState<AppContext | "">("");
  const [favOnly, setFavOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [dateRange, setDateRange] = useState<DateRange | "">("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.id) {
      fetchGenerations({
        search: search || undefined,
        format: formatFilter || undefined,
        context: contextFilter || undefined,
        favoritesOnly: favOnly || undefined,
        sortOrder,
        dateRange: dateRange || undefined,
      });
    }
  }, [profile?.id, search, formatFilter, contextFilter, favOnly, sortOrder, dateRange, fetchGenerations]);

  async function handleDelete(id: string) {
    setDeleting(id);
    await deleteGeneration(id);
    setDeleting(null);
  }

  // Stats from current list
  const stats = useMemo(() => {
    const total = generations.length;
    const estimatedTests = total * 10;
    const formatCounts = generations.reduce<Record<string, number>>((acc, g) => {
      acc[g.output_format] = (acc[g.output_format] ?? 0) + 1;
      return acc;
    }, {});
    const contextCounts = generations.reduce<Record<string, number>>((acc, g) => {
      acc[g.context] = (acc[g.context] ?? 0) + 1;
      return acc;
    }, {});
    const topFormat = Object.entries(formatCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const topContext = Object.entries(contextCounts).sort((a, b) => b[1] - a[1])[0]?.[0]?.replace("_", " ") ?? "—";
    return { total, estimatedTests, topFormat, topContext };
  }, [generations]);

  const hasFilters = !!(search || formatFilter || contextFilter || favOnly || dateRange);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Historial</h1>
            <p className="text-sm text-slate-400 mt-1">
              {generations.length} generacion{generations.length !== 1 ? "es" : ""}
              {hasFilters && " · filtrado"}
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

        {/* Stats bar */}
        {generations.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Generaciones", value: stats.total },
              { label: "Test cases est.", value: stats.estimatedTests.toLocaleString() },
              { label: "Formato más usado", value: stats.topFormat },
              { label: "Contexto más usado", value: stats.topContext },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                <p className="text-lg font-bold text-slate-100 capitalize">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar en user stories y test cases..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
            />
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Format toggle buttons */}
          <div className="flex gap-1 p-1 rounded-xl bg-slate-800 border border-slate-700">
            {FORMAT_OPTS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFormatFilter(opt.value as OutputFormat | "")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  formatFilter === opt.value
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {opt.icon && <opt.icon className="h-3.5 w-3.5" />}
                {opt.label}
              </button>
            ))}
          </div>

          {/* Context select */}
          <div className="relative">
            <select
              value={contextFilter}
              onChange={(e) => setContextFilter(e.target.value as AppContext | "")}
              className="pl-3 pr-7 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-sky-500 transition-all appearance-none"
            >
              <option value="">Todos los contextos</option>
              {CONTEXT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Date range */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange | "")}
              className="pl-3 pr-7 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-sky-500 transition-all appearance-none"
            >
              {DATE_OPTS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Favorites toggle */}
          <button
            onClick={() => setFavOnly((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
              favOnly
                ? "bg-red-500/10 border-red-500/40 text-red-400"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${favOnly ? "fill-current" : ""}`} />
            Favoritos
          </button>

          {/* Sort */}
          <div className="relative ml-auto">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="pl-3 pr-7 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-sky-500 transition-all appearance-none"
            >
              {SORT_OPTS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <LoadingSpinner className="py-16" />
        ) : generations.length === 0 ? (
          <div className="rounded-xl bg-slate-800 border border-slate-700 p-12 text-center">
            <HistoryIcon className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium mb-1">
              {hasFilters ? "Sin resultados para tu búsqueda" : "No hay generaciones todavía"}
            </p>
            {!hasFilters && (
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
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${FORMAT_COLORS[gen.output_format] ?? "bg-slate-700 text-slate-400 border-slate-600"}`}>
                          {gen.output_format}
                        </span>
                        <span className="text-xs text-slate-500 capitalize">
                          {gen.context.replace("_", " ")}
                        </span>
                        <span className="text-xs text-slate-600">
                          {new Date(gen.created_at).toLocaleDateString("es-AR", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </span>
                        {gen.is_favorite && <span className="text-xs text-red-400">♥</span>}
                        {gen.is_public && <span className="text-xs text-sky-600">· público</span>}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-sky-400 shrink-0 mt-1 transition-colors" />
                  </div>
                </Link>
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
