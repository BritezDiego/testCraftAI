import { useState, useRef, useEffect } from "react";
import { SquareKanban, Lock, ExternalLink, X } from "lucide-react";
import type { Generation, Plan } from "../lib/types";

const JIRA_URL_KEY = "testcraft_jira_url";

interface Props {
  generation: Generation;
  plan: Plan | undefined;
}

export default function JiraButton({ generation, plan }: Props) {
  const [open, setOpen] = useState(false);
  const [jiraUrl, setJiraUrl] = useState(() => localStorage.getItem(JIRA_URL_KEY) ?? "");
  const [input, setInput] = useState(jiraUrl);
  const ref = useRef<HTMLDivElement>(null);
  const canUse = plan === "pro" || plan === "team";

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function buildJiraUrl(base: string): string {
    const clean = base.replace(/\/$/, "");
    const title = `Test Cases: ${generation.user_story.slice(0, 60)}`;
    const desc = generation.output_text;
    const params = new URLSearchParams({
      summary: title,
      description: desc,
    });
    return `${clean}/secure/CreateIssue.jspa?${params.toString()}`;
  }

  function handleOpen() {
    if (!canUse) return;
    if (jiraUrl) {
      window.open(buildJiraUrl(jiraUrl), "_blank");
    } else {
      setOpen(true);
    }
  }

  function handleSave() {
    const trimmed = input.trim();
    if (!trimmed) return;
    localStorage.setItem(JIRA_URL_KEY, trimmed);
    setJiraUrl(trimmed);
    setOpen(false);
    window.open(buildJiraUrl(trimmed), "_blank");
  }

  function handleReset() {
    localStorage.removeItem(JIRA_URL_KEY);
    setJiraUrl("");
    setInput("");
    setOpen(true);
  }

  if (!canUse) {
    return (
      <button
        disabled
        title="Disponible en plan Pro/Team — Upgrade →"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/40 text-sm text-slate-600 cursor-not-allowed"
      >
        <Lock className="h-4 w-4" />
        JIRA
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 transition-colors"
      >
        <SquareKanban className="h-4 w-4" />
        JIRA
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-72 rounded-xl bg-slate-800 border border-slate-700 shadow-xl shadow-black/30 z-50 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-300">URL de tu proyecto JIRA</p>
            <button onClick={() => setOpen(false)} className="text-slate-600 hover:text-slate-400">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <input
            type="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://tu-empresa.atlassian.net"
            className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
          <button
            onClick={handleSave}
            disabled={!input.trim()}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition-all disabled:opacity-40"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Guardar y abrir JIRA
          </button>
        </div>
      )}

      {jiraUrl && !open && (
        <button
          onClick={handleReset}
          className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center"
          title="Cambiar proyecto JIRA"
        >
          <X className="h-2.5 w-2.5 text-slate-300" />
        </button>
      )}
    </div>
  );
}
