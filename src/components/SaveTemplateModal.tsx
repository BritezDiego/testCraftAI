import { useState } from "react";
import { X, BookmarkPlus, Loader2 } from "lucide-react";
import type { AppContext, OutputFormat } from "../lib/types";

interface Props {
  userStory: string;
  context: AppContext;
  format: OutputFormat;
  includeEdgeCases: boolean;
  onSave: (name: string) => Promise<void>;
  onClose: () => void;
}

export default function SaveTemplateModal({ userStory, context, format, includeEdgeCases, onSave, onClose }: Props) {
  const defaultName = userStory.trim().split(/\s+/).slice(0, 5).join(" ");
  const [name, setName] = useState(defaultName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onSave(name.trim());
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <BookmarkPlus className="h-4 w-4 text-sky-400" />
            <h2 className="text-sm font-semibold text-slate-100">Guardar como template</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Nombre del template
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              autoFocus
              className="w-full px-3 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-slate-200 text-sm focus:outline-none focus:border-sky-500 transition-all"
            />
          </div>

          <div className="rounded-xl bg-slate-700/50 border border-slate-600 p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Formato</span>
              <span className="text-slate-200 capitalize">{format}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Contexto</span>
              <span className="text-slate-200 capitalize">{context.replace("_", " ")}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Edge cases</span>
              <span className="text-slate-200">{includeEdgeCases ? "Sí" : "No"}</span>
            </div>
            <div className="pt-1 border-t border-slate-600 text-slate-500 line-clamp-2 leading-relaxed">
              {userStory.slice(0, 120)}{userStory.length > 120 ? "..." : ""}
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-600 text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
