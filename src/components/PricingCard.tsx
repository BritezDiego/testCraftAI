import { useState } from "react";
import { Check, Clock, Zap, ExternalLink, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PricingPlan } from "../lib/types";
import { useAuth } from "../hooks/useAuth";
import { openCheckout, openCustomerPortal } from "../lib/paddle";

interface Props {
  plan: PricingPlan;
}

export default function PricingCard({ plan }: Props) {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const currentPlan = profile?.plan ?? "free";
  const isCurrent = currentPlan === plan.id;
  const isPaid = plan.id === "pro" || plan.id === "team";

  async function handleClick() {
    if (isCurrent) return;
    if (!user) {
      navigate(`/register?plan=${plan.id}`);
      return;
    }
    if (plan.id === "free") return;
    setCheckoutLoading(true);
    openCheckout(plan.id as "pro" | "team", { id: user.id, email: user.email! });
    setCheckoutLoading(false);
  }

  function handleManage() {
    if (profile?.paddle_subscription_id) {
      openCustomerPortal(profile.paddle_subscription_id);
    }
  }

  const buttonLabel = () => {
    if (isCurrent) return "Plan actual";
    if (checkoutLoading) return "Abriendo...";
    return plan.cta;
  };

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
          <li
            key={f.text}
            className={`flex items-start gap-2.5 text-sm ${f.comingSoon ? "text-slate-500" : "text-slate-300"}`}
          >
            {f.comingSoon ? (
              <Clock className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
            ) : (
              <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <span className="flex-1">{f.text}</span>
            {f.comingSoon && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold shrink-0 leading-none self-center">
                SOON
              </span>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        disabled={isCurrent || checkoutLoading}
        className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
          isCurrent
            ? "bg-slate-700 text-slate-500 cursor-default"
            : plan.highlighted
            ? "bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/25"
            : "bg-slate-700 hover:bg-slate-600 text-slate-200"
        } disabled:opacity-60`}
      >
        {checkoutLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {buttonLabel()}
      </button>

      {isCurrent && isPaid && profile?.paddle_subscription_id && (
        <button
          onClick={handleManage}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Gestionar suscripción
        </button>
      )}
    </div>
  );
}
