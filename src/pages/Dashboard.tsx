import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Zap, Plus, TrendingUp, Clock, FileText, ArrowRight, ExternalLink, CheckCircle, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useGenerations } from "../hooks/useGenerations";
import CreditsBadge from "../components/CreditsBadge";
import SubscriptionBanner from "../components/SubscriptionBanner";
import LoadingSpinner from "../components/LoadingSpinner";
import { redirectToCheckout, redirectToCustomerPortal } from "../lib/lemonsqueezy";
import type { Generation } from "../lib/types";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 18) return "Buenas tardes";
  return "Buenas noches";
}

const FORMAT_COLORS: Record<string, string> = {
  gherkin: "bg-sky-500/20 text-sky-300",
  steps: "bg-violet-500/20 text-violet-300",
  checklist: "bg-emerald-500/20 text-emerald-300",
};

export default function Dashboard() {
  const { profile, refreshProfile } = useAuth();
  const { fetchRecent } = useGenerations(profile?.id);
  const [recent, setRecent] = useState<Generation[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paymentStatus = searchParams.get("payment");
  const paymentPlan = searchParams.get("plan");
  const [toast, setToast] = useState<{ type: "success" | "cancel"; message: string } | null>(null);

  const displayName = profile?.full_name?.split(" ")[0] || "QA";
  const totalGenerations = profile?.credits_used ?? 0;
  const estimatedTests = totalGenerations * 10;
  const timeSaved = totalGenerations * 25;

  // Handle payment return params
  useEffect(() => {
    if (paymentStatus === "success") {
      const planLabel = paymentPlan === "team" ? "Team" : "Pro";
      setToast({ type: "success", message: `¡Bienvenido al plan ${planLabel}! Tus créditos fueron actualizados.` });
      refreshProfile();
      // Clean URL
      navigate("/dashboard", { replace: true });
    } else if (paymentStatus === "cancel") {
      setToast({ type: "cancel", message: "El pago fue cancelado. Podés intentar de nuevo cuando quieras." });
      navigate("/dashboard", { replace: true });
    }
  }, [paymentStatus, paymentPlan, navigate, refreshProfile]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 6000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    async function load() {
      const data = await fetchRecent(5);
      setRecent(data);
      setLoadingRecent(false);
    }
    if (profile?.id) load();
  }, [profile?.id, fetchRecent]);

  function handleUpgrade() {
    if (!profile) return;
    setUpgradeLoading(true);
    redirectToCheckout("pro", { id: profile.id, email: profile.email });
  }

  function handleManage() {
    if (profile?.ls_customer_id) redirectToCustomerPortal(profile.ls_customer_id);
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl max-w-sm ${
          toast.type === "success"
            ? "bg-emerald-900/90 border-emerald-500/40 text-emerald-100"
            : "bg-slate-800 border-slate-600 text-slate-300"
        }`}>
          {toast.type === "success" && <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />}
          <p className="text-sm flex-1">{toast.message}</p>
          <button onClick={() => setToast(null)} className="text-current opacity-50 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              {getGreeting()}, {displayName} 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <Link
            to="/generate"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all shadow-md shadow-sky-500/25 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Nueva generación
          </Link>
        </div>

        {/* Subscription alerts */}
        {profile && (profile.subscription_status === "cancelled" || profile.subscription_status === "past_due") && (
          <div className="mb-6">
            <SubscriptionBanner profile={profile} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: FileText, label: "Generaciones", value: totalGenerations, color: "text-sky-400" },
                { icon: TrendingUp, label: "Test cases est.", value: estimatedTests, color: "text-violet-400" },
                { icon: Clock, label: "Min. ahorrados", value: timeSaved, color: "text-emerald-400" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-slate-800 border border-slate-700 p-4">
                  <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                  <div className="text-xl font-bold text-slate-100">{stat.value.toLocaleString()}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent generations */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-slate-200">Últimas generaciones</h2>
                <Link to="/history" className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1">
                  Ver todas <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {loadingRecent ? (
                <LoadingSpinner className="py-8" />
              ) : recent.length === 0 ? (
                <div className="rounded-xl bg-slate-800 border border-slate-700 p-8 text-center">
                  <FileText className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm mb-4">Todavía no generaste ningún test case.</p>
                  <Link
                    to="/generate"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium transition-all"
                  >
                    <Zap className="h-4 w-4" />
                    Generar ahora
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recent.map((gen) => (
                    <Link
                      key={gen.id}
                      to={`/generation/${gen.id}`}
                      className="block rounded-xl bg-slate-800 border border-slate-700 p-4 hover:border-sky-500/40 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm text-slate-300 line-clamp-2 flex-1 group-hover:text-slate-100 transition-colors">
                          {gen.user_story}
                        </p>
                        <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-sky-400 shrink-0 mt-0.5 transition-colors" />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${FORMAT_COLORS[gen.output_format] ?? "bg-slate-700 text-slate-400"}`}>
                          {gen.output_format}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(gen.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
                        </span>
                        {gen.is_favorite && <span className="text-xs text-red-400">♥</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <CreditsBadge profile={profile} />

            {/* Free upgrade banner */}
            {profile?.plan === "free" && (
              <div className="rounded-xl bg-gradient-to-br from-sky-900/40 to-violet-900/40 border border-sky-500/30 p-4">
                <h3 className="font-semibold text-slate-100 text-sm mb-1.5">Upgrade a Pro</h3>
                <p className="text-xs text-slate-400 mb-3">
                  200 generaciones/mes, todos los contextos, historial ilimitado.
                </p>
                <button
                  onClick={handleUpgrade}
                  disabled={upgradeLoading}
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {upgradeLoading && <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
                  Upgrade a Pro — $19/mes
                </button>
              </div>
            )}

            {/* Paid plan — manage subscription */}
            {profile && profile.plan !== "free" && profile.ls_customer_id && (
              <div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-slate-200">Tu suscripción</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                    profile.plan === "team"
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                  }`}>
                    {profile.plan}
                  </span>
                </div>
                {profile.current_period_end && (
                  <p className="text-xs text-slate-500 mb-3">
                    Próxima renovación:{" "}
                    {new Date(profile.current_period_end).toLocaleDateString("es-AR", { day: "numeric", month: "long" })}
                  </p>
                )}
                <button
                  onClick={handleManage}
                  className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-600 rounded-lg py-2 transition-all"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Gestionar suscripción
                </button>
              </div>
            )}

            {/* Quick actions */}
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">Accesos rápidos</h3>
              <div className="space-y-1.5">
                {[
                  { to: "/generate", label: "Nuevo test case", icon: Plus },
                  { to: "/history", label: "Ver historial", icon: Clock },
                  { to: "/pricing", label: "Ver planes", icon: Zap },
                ].map((action) => (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-700 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
