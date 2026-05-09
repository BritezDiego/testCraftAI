import { useState, useRef, useEffect } from "react";
import { Download, FileText, Hash, ChevronDown } from "lucide-react";
import type { Generation } from "../lib/types";

interface Props {
  generation: Generation;
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ExportMenu({ generation }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const slug = generation.user_story.slice(0, 30).toLowerCase().replace(/\s+/g, "-");

  const options = [
    {
      label: "Download .feature",
      icon: FileText,
      action: () =>
        downloadFile(generation.output_text, `${slug}.feature`, "text/plain"),
    },
    {
      label: "Download .md",
      icon: Hash,
      action: () =>
        downloadFile(
          `# Test Cases\n\n${generation.output_text}`,
          `${slug}.md`,
          "text/markdown"
        ),
    },
    {
      label: "Download .txt",
      icon: Download,
      action: () =>
        downloadFile(generation.output_text, `${slug}.txt`, "text/plain"),
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 transition-colors"
      >
        <Download className="h-4 w-4" />
        Export
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-48 rounded-xl bg-slate-800 border border-slate-700 shadow-xl shadow-black/30 z-50 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => { opt.action(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors"
            >
              <opt.icon className="h-4 w-4 text-slate-400" />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
