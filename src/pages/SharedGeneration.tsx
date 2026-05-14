import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FlaskConical, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";
import TestCaseOutput from "../components/TestCaseOutput";
import type { Generation } from "../lib/types";

export default function SharedGeneration() {
  const { slug } = useParams<{ slug: string }>();
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [storyExpanded, setStoryExpanded] = useState(false);

  useEffect(() => {
    async function load() {
      if (!slug) { setNotFound(true); setLoading(false); return; }
      const { data } = await supabase
        .from("generations")
        .select("*")
        .eq("public_slug", slug)
        .eq("is_public", true)
        .single();
      if (data) setGeneration(data as Generation);
      else setNotFound(true);
      setLoading(false);
    }
    load();
  }, [slug]);

  // Social meta tags
  useEffect(() => {
    if (!generation) return;
    const title = `Test Cases: ${generation.user_story.slice(0, 60)} — TestCraft AI`;
    const desc = `Test cases generados en formato ${generation.output_format} con TestCraft AI.`;
    document.title = title;
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", desc);
    return () => { document.title = "TestCraft AI"; };
  }, [generation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-sky-500" />
      </div>
    );
  }

  if (notFound || !generation) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 text-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-2">
          <FlaskConical className="h-8 w-8 text-slate-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-100">Generación no encontrada</h1>
        <p className="text-slate-400 text-sm max-w-xs">
          Esta generación no existe o ya no es pública.
        </p>
        <Link
          to="/register"
          className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all"
        >
          <Sparkles className="h-4 w-4" />
          Empezar gratis
        </Link>
      </div>
    );
  }

  const storyLong = generation.user_story.length > 200;
  const storyPreview = storyLong && !storyExpanded
    ? generation.user_story.slice(0, 200) + "…"
    : generation.user_story;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-violet-600">
              <FlaskConical className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-100 text-sm">TestCraft AI</span>
          </Link>
          <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-medium">
            Shared Test Cases
          </span>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 py-8 flex-1 space-y-6">
        {/* User story */}
        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">User Story</p>
          <p className="text-sm text-slate-300 leading-relaxed">{storyPreview}</p>
          {storyLong && (
            <button
              onClick={() => setStoryExpanded((v) => !v)}
              className="flex items-center gap-1 mt-2 text-xs text-sky-400 hover:text-sky-300 transition-colors"
            >
              {storyExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {storyExpanded ? "Mostrar menos" : "Ver completa"}
            </button>
          )}
        </div>

        {/* Output */}
        <TestCaseOutput generation={generation} readOnly />

        {/* CTA banner */}
        <div className="rounded-xl bg-gradient-to-br from-sky-900/40 to-violet-900/40 border border-sky-500/30 p-6 text-center space-y-3">
          <p className="text-slate-200 font-semibold">
            ¿Querés generar tus propios test cases?
          </p>
          <p className="text-sm text-slate-400">
            Pegá cualquier user story y obtenés test cases profesionales en Gherkin, Steps o Checklist en segundos.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-500/25"
          >
            <Sparkles className="h-4 w-4" />
            Empezar gratis →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-5 text-center text-xs text-slate-600">
        Generated with{" "}
        <Link to="/" className="text-sky-600 hover:text-sky-400 transition-colors">
          TestCraft AI
        </Link>{" "}
        — AI-powered test case generation
      </footer>
    </div>
  );
}
