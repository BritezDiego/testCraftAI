import { Zap, Crown, Users, RefreshCw } from "lucide-react";
import type { Profile } from "../lib/types";

const PLAN_META = {
  free:  { label: "Free",  icon: Zap,   color: "text-slate-300",  bg: "bg-slate-700",         border: "border-slate-600" },
  pro:   { label: "Pro",   icon: Crown, color: "text-sky-300",    bg: "bg-sky-500/20",        border: "border-sky-500/40" },
  team:  { label: "Team",  icon: Users, color: "text-violet-300", bg: "bg-violet-500/20",     border: "border-violet-500/40" },
};

interface Props {
  profile: Profile | null;
  compact?: boolean;
}

export default function CreditsBadge({ profile, compact = false }: Props) {
  if (!profile) return null;

  const used      = profile.credits_used;
  const limit     = profile.credits_limit;
  const remaining = Math.max(0, limit - used);
  const percent   = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const meta      = PLAN_META[profile.plan] ?? PLAN_META.free;
  const PlanIcon  = meta.icon;

  const barColor =
    percent >= 90 ? "bg-red-500" :
    percent >= 70 ? "bg-amber-500" :
    profile.plan === "pro"  ? "bg-sky-500" :
    profile.plan === "team" ? "bg-violet-500" :
    "bg-sky-500";

  const resetDate = profile.credits_reset_at
    ? new Date(profile.credits_reset_at).toLocaleDateString("es-AR", { day: "numeric", month: "long" })
    : null;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-slate-400">
        <Zap className="h-3.5 w-3.5 text-sky-400" />
        <span>
          <span className="text-slate-200 font-medium">{remaining}</span> créditos
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-4 space-y-4">
      {/* Plan header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tu plan</p>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${meta.bg} ${meta.border} ${meta.color}`}>
          <PlanIcon className="h-3 w-3" />
          {meta.label}
        </div>
      </div>

      {/* Remaining — big number */}
      <div className="text-center py-1">
        <p className={`text-4xl font-bold tabular-nums ${remaining === 0 ? "text-red-400" : "text-slate-100"}`}>
          {remaining}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          generaciones restantes este mes
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="h-2.5 rounded-full bg-slate-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>{used} usados</span>
          <span>{limit} total</span>
        </div>
      </div>

      {/* Reset date */}
      {resetDate && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1 border-t border-slate-700">
          <RefreshCw className="h-3 w-3 shrink-0" />
          Se resetean el {resetDate}
        </div>
      )}
    </div>
  );
}
