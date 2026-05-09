import { useState } from "react";
import { Copy, Check, Heart, Clock } from "lucide-react";
import type { Generation } from "../lib/types";
import ExportMenu from "./ExportMenu";

interface Props {
  generation: Generation;
  onToggleFavorite?: (id: string, current: boolean) => void;
}

function highlightGherkin(text: string): string {
  return text
    // Strings and tags first — on clean text, before any <span> class attrs exist
    .replace(/"([^"]+)"/g, '"<span class="gherkin-string">$1</span>"')
    .replace(/(@\w[\w-]*)(\s|$)/g, '<span class="gherkin-tag">$1</span>$2')
    // Line-level keywords after — their class attrs won't be touched by string regex
    .replace(/^(Feature:|Background:|Rule:)(.*)$/gm, '<span class="gherkin-feature">$1$2</span>')
    .replace(/^(\s*)(Scenario:|Scenario Outline:|Examples:)(.*)$/gm, '$1<span class="gherkin-scenario">$2$3</span>')
    .replace(/^(\s*)(Given |When |Then |And |But )(.*)$/gm, '$1<span class="gherkin-keyword">$2</span>$3')
    .replace(/(#.*)$/gm, '<span class="gherkin-comment">$1</span>')
    .replace(/\|([^|]+)\|/g, (match) =>
      match.replace(/\|([^|]+)/g, '|<span class="gherkin-table-header">$1</span>')
    );
}

function highlightSteps(text: string): string {
  return text
    .replace(/^(Test Case ID:|Title:|Preconditions:|Steps:|Expected Result:|Test Data:)(.*)$/gm,
      '<span class="gherkin-feature">$1$2</span>')
    .replace(/^(\d+\.\s)(.*)$/gm, '<span class="gherkin-keyword">$1</span>$2');
}

function highlightChecklist(text: string): string {
  return text
    .replace(/^(#+\s.*)$/gm, '<span class="gherkin-scenario">$1</span>')
    .replace(/^(\s*[-*]\s\[[ x]\]\s)(.*)(\[P\d\])(.*)$/gm,
      '$1$2<span class="gherkin-tag">$3</span>$4')
    .replace(/^(\s*[-*]\s)(.*)$/gm, '$1<span class="gherkin-keyword">$2</span>');
}

function applyHighlight(text: string, format: string): string {
  if (format === "gherkin") return highlightGherkin(text);
  if (format === "steps") return highlightSteps(text);
  if (format === "checklist") return highlightChecklist(text);
  return text;
}

export default function TestCaseOutput({ generation, onToggleFavorite }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(generation.output_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const formatLabel = {
    gherkin: "Gherkin",
    steps: "Steps",
    checklist: "Checklist",
  }[generation.output_format] ?? generation.output_format;

  const highlighted = applyHighlight(generation.output_text, generation.output_format);

  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-medium border border-sky-500/30">
            {formatLabel}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            {new Date(generation.created_at).toLocaleDateString("es-AR", {
              day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(generation.id, generation.is_favorite)}
              className={`p-1.5 rounded-lg transition-colors ${
                generation.is_favorite
                  ? "text-red-400 bg-red-500/10 hover:bg-red-500/20"
                  : "text-slate-500 hover:text-red-400 hover:bg-red-500/10"
              }`}
            >
              <Heart className={`h-4 w-4 ${generation.is_favorite ? "fill-current" : ""}`} />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copiado!" : "Copiar"}
          </button>
          <ExportMenu generation={generation} />
        </div>
      </div>

      {/* Code */}
      <div className="overflow-auto flex-1 max-h-[600px]">
        <pre
          className="p-4 text-sm leading-relaxed text-slate-300 font-mono whitespace-pre-wrap"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>

      {/* Footer */}
      {generation.tokens_used > 0 && (
        <div className="px-4 py-2 border-t border-slate-700/50 text-xs text-slate-600">
          {generation.tokens_used.toLocaleString()} tokens usados
        </div>
      )}
    </div>
  );
}
