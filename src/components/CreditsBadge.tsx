import { Zap } from "lucide-react";
import type { Profile } from "../lib/types";

interface Props {
  profile: Profile | null;
  compact?: boolean;
}

export default function CreditsBadge({ profile, compact = false }: Props) {
  if (!profile) return null;

  const used = profile.credits_used;
  const limit = profile.credits_limit;
  const remaining = Math.max(0, limit - used);
  const percent = limit > 0 ? (used / limit) * 100 : 0;

  const barColor =
    percent >= 90 ? "bg-red-500" : percent >= 70 ? "bg-amber-500" : "bg-sky-500";

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
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-sky-400" />
          <span className="text-sm font-medium text-slate-200">Créditos</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 capitalize">
          {profile.plan}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400">
          <span>{used} usados</span>
          <span>{limit} total</span>
        </div>
        <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
        <p className="text-xs text-slate-500">
          {remaining} generaciones restantes este mes
        </p>
      </div>
    </div>
  );
}
