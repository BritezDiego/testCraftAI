import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Zap } from "lucide-react";

const PLAN_CREDITS: Record<string, number> = { pro: 200, team: 1000 };
const PLAN_LABELS: Record<string, string> = { pro: "Pro", team: "Team" };

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const plan = params.get("plan") ?? "pro";
  const credits = PLAN_CREDITS[plan] ?? 200;
  const label = PLAN_LABELS[plan] ?? "Pro";

  useEffect(() => {
    // Confetti-like animated dots — pure CSS, no library
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pop-up {
        0% { transform: translateY(0) scale(0); opacity: 1; }
        100% { transform: translateY(-120px) scale(1); opacity: 0; }
      }
      .confetti-dot { animation: pop-up 1.2s ease-out forwards; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Animated dots */}
        <div className="relative flex justify-center mb-8 h-24">
          {["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#0ea5e9", "#8b5cf6"].map((color, i) => (
            <span
              key={i}
              className="confetti-dot absolute h-3 w-3 rounded-full"
              style={{
                backgroundColor: color,
                left: `${15 + i * 13}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1 + i * 0.15}s`,
              }}
            />
          ))}
          <div className="absolute bottom-0 flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-100 mb-3">
          ¡Pago exitoso!
        </h1>
        <p className="text-slate-400 mb-6">
          Bienvenido al plan{" "}
          <span className="text-sky-300 font-semibold">{label}</span>.
        </p>

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5 mb-8 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0">
            <Zap className="h-6 w-6 text-sky-400" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-slate-100">Tus créditos fueron actualizados</p>
            <p className="text-sm text-slate-400">
              Tenés <span className="text-sky-300 font-bold">{credits}</span> generaciones disponibles este mes.
            </p>
          </div>
        </div>

        <Link
          to="/generate"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold transition-all shadow-lg shadow-sky-500/25"
        >
          <Zap className="h-4 w-4" />
          Ir al generador
        </Link>
      </div>
    </div>
  );
}
