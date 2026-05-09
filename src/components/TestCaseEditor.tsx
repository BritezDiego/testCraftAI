import { useState } from "react";
import { Save, X, Edit2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Generation } from "../lib/types";

interface Props {
  generation: Generation;
  onSave: (updated: Generation) => void;
}

export default function TestCaseEditor({ generation, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(generation.output_text);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase
      .from("generations")
      .update({ output_text: value })
      .eq("id", generation.id);
    setSaving(false);
    if (!error) {
      onSave({ ...generation, output_text: value });
      setEditing(false);
    }
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 transition-colors"
      >
        <Edit2 className="h-4 w-4" />
        Editar
      </button>
    );
  }

  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-800/80">
        <span className="text-sm font-medium text-slate-300">Editando test cases</span>
        <div className="flex gap-2">
          <button
            onClick={() => { setValue(generation.output_text); setEditing(false); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-96 p-4 bg-slate-900 text-slate-300 text-sm font-mono resize-none outline-none"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
        spellCheck={false}
      />
    </div>
  );
}
