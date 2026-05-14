import { useState } from "react";
import { Link2, Check, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Generation, Plan } from "../lib/types";

interface Props {
  generation: Generation;
  plan: Plan | undefined;
  onUpdate?: (patch: Partial<Generation>) => void;
}

export default function ShareButton({ generation, plan, onUpdate }: Props) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const canShare = plan === "team";

  async function handleShare() {
    if (loading) return;
    setLoading(true);

    let slug = generation.public_slug;
    if (!slug) {
      slug = crypto.randomUUID().slice(0, 8);
      await supabase
        .from("generations")
        .update({ is_public: true, public_slug: slug })
        .eq("id", generation.id);
      onUpdate?.({ is_public: true, public_slug: slug });
    }

    const url = `${window.location.origin}/share/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setLoading(false);
    setTimeout(() => setCopied(false), 3000);
  }

  if (!canShare) {
    return (
      <button
        disabled
        title="Disponible en plan Team — Upgrade →"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/40 text-sm text-slate-600 cursor-not-allowed"
      >
        <Lock className="h-4 w-4" />
        Share
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 transition-colors disabled:opacity-50"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-400" />
      ) : (
        <Link2 className="h-4 w-4" />
      )}
      {copied ? "¡Link copiado!" : "Share"}
    </button>
  );
}
