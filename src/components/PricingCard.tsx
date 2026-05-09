import { Check, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PricingPlan } from "../lib/types";

interface Props {
  plan: PricingPlan;
  currentPlan?: string;
}

export default function PricingCard({ plan, currentPlan }: Props) {
  const navigate = useNavigate();
  const isCurrent = currentPlan === plan.id;

  return (
    <div
      className={`relative rounded-2xl border p-6 flex flex-col gap-5 transition-all duration-200 ${
        plan.highlighted
          ? "border-sky-500 bg-gradient-to-b from-sky-950/40 to-slate-800 shadow-lg shadow-sky-500/10"
          : "border-slate-700 bg-slate-800 hover:border-slate-600"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-sky-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Más popular
          </span>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-slate-100">{plan.name}</h3>
        <p className="text-sm text-slate-400 mt-1">{plan.description}</p>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-slate-100">{plan.price}</span>
        {plan.price !== "$0" && (
          <span className="text-slate-400 text-sm">/{plan.period}</span>
        )}
      </div>

      <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-slate-700/50">
        <Zap className="h-4 w-4 text-sky-400 shrink-0" />
        <span className="text-sm text-slate-300">
          <span className="font-semibold text-slate-100">{plan.credits}</span> generaciones/mes
        </span>
      </div>

      <ul className="space-y-2.5 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
            <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => !isCurrent && navigate(currentPlan ? "/pricing" : "/register")}
        disabled={isCurrent}
        className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
          isCurrent
            ? "bg-slate-700 text-slate-500 cursor-default"
            : plan.highlighted
            ? "bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/25"
            : "bg-slate-700 hover:bg-slate-600 text-slate-200"
        }`}
      >
        {isCurrent ? "Plan actual" : plan.cta}
      </button>
    </div>
  );
}
