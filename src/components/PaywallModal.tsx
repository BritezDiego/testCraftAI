import { X, Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { redirectToCheckout } from "../lib/lemonsqueezy";

interface Props {
  creditsUsed: number;
  onClose: () => void;
}

export default function PaywallModal({ creditsUsed, onClose }: Props) {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState<"pro" | "team" | null>(null);

  function handleUpgrade(plan: "pro" | "team") {
    if (!user || !profile) return;
    setLoading(plan);
    redirectToCheckout(plan, { id: user.id, email: profile.email });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              Se te acabaron las generaciones gratuitas
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Generaste <span className="text-slate-200 font-medium">{creditsUsed}</span> test cases
              este mes. Upgrade para seguir creando.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 ml-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Plans */}
        <div className="p-6 space-y-3">
          {/* Pro */}
          <div className="rounded-xl border border-sky-500/40 bg-sky-500/5 p-4 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-slate-100">Pro</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Más popular
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <Zap className="h-3.5 w-3.5 text-sky-400" />
                <span>200 generaciones/mes</span>
              </div>
            </div>
            <button
              onClick={() => handleUpgrade("pro")}
              disabled={loading !== null}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all shrink-0 disabled:opacity-50"
            >
              {loading === "pro" && <Loader2 className="h-4 w-4 animate-spin" />}
              $19/mes
            </button>
          </div>

          {/* Team */}
          <div className="rounded-xl border border-slate-700 bg-slate-700/30 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-100 mb-1">Team</p>
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <Zap className="h-3.5 w-3.5 text-violet-400" />
                <span>1000 generaciones/mes · hasta 5 usuarios</span>
              </div>
            </div>
            <button
              onClick={() => handleUpgrade("team")}
              disabled={loading !== null}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-600 hover:bg-slate-500 text-slate-100 font-semibold text-sm transition-all shrink-0 disabled:opacity-50"
            >
              {loading === "team" && <Loader2 className="h-4 w-4 animate-spin" />}
              $79/mes
            </button>
          </div>

          <p className="text-center text-xs text-slate-600">
            Eso es menos de $0.10 por generación · Cancelá cuando quieras
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full text-sm text-slate-500 hover:text-slate-300 transition-colors py-2"
          >
            Quizás más tarde
          </button>
        </div>
      </div>
    </div>
  );
}
