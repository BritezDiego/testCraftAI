import { AlertTriangle, XCircle, ExternalLink } from "lucide-react";
import type { Profile } from "../lib/types";
import { openCustomerPortal } from "../lib/paddle";

interface Props {
  profile: Profile;
}

export default function SubscriptionBanner({ profile }: Props) {
  const { paddle_subscription_status, current_period_end, paddle_subscription_id } = profile;

  function handleManage() {
    if (paddle_subscription_id) openCustomerPortal(paddle_subscription_id);
  }

  const endDate = current_period_end
    ? new Date(current_period_end).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  if (paddle_subscription_status === "canceled" && endDate) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-amber-200 font-medium">Suscripción cancelada</p>
          <p className="text-xs text-amber-400/80 mt-0.5">
            Tenés acceso hasta el {endDate}.
          </p>
        </div>
        {paddle_subscription_id && (
          <button
            onClick={handleManage}
            className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-100 transition-colors shrink-0"
          >
            Renovar
            <ExternalLink className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }

  if (paddle_subscription_status === "past_due") {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 flex items-start gap-3">
        <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-red-200 font-medium">Problema con el pago</p>
          <p className="text-xs text-red-400/80 mt-0.5">
            No pudimos cobrar tu suscripción. Actualizá tu medio de pago.
          </p>
        </div>
        {paddle_subscription_id && (
          <button
            onClick={handleManage}
            className="flex items-center gap-1 text-xs text-red-300 hover:text-red-100 transition-colors shrink-0"
          >
            Actualizar
            <ExternalLink className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }

  return null;
}
