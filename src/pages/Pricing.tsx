import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import PricingCard from "../components/PricingCard";
import { PRICING_PLANS } from "../lib/constants";
import { useAuth } from "../hooks/useAuth";

const FAQ = [
  {
    q: "¿Qué pasa cuando se me acaban los créditos?",
    a: "Podés seguir viendo tu historial, pero no podés generar nuevos test cases hasta que se renueven el próximo mes (o que hagas upgrade).",
  },
  {
    q: "¿Los créditos se acumulan entre meses?",
    a: "No, los créditos se resetean el primer día de cada mes. Úsalos o los perdés.",
  },
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Sí, podés cancelar cuando quieras. Seguís teniendo acceso hasta el final del período pagado.",
  },
  {
    q: "¿Qué formato acepta el generador?",
    a: "Aceptamos user stories en cualquier idioma. El output se genera en inglés (estándar para test cases) o en el idioma que especifiques en la historia.",
  },
];

export default function Pricing() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">
            Precios simples y transparentes
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Empezá gratis. Escalá cuando lo necesites. Sin sorpresas.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} currentPlan={profile?.plan} />
          ))}
        </div>

        {/* Comparison table */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-slate-100 mb-6 text-center">Comparación de planes</h2>
          <div className="rounded-xl bg-slate-800 border border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Feature</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium">Free</th>
                  <th className="text-center px-4 py-3 text-sky-400 font-medium">Pro</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium">Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {[
                  { feature: "Generaciones/mes", free: "10", pro: "200", team: "1000" },
                  { feature: "Formato Gherkin", free: true, pro: true, team: true },
                  { feature: "Formato Steps", free: true, pro: true, team: true },
                  { feature: "Formato Checklist", free: false, pro: true, team: true },
                  { feature: "Contextos especializados (Banking, etc.)", free: false, pro: true, team: true },
                  { feature: "Edge cases avanzados", free: false, pro: true, team: true },
                  { feature: "Historial ilimitado", free: false, pro: true, team: true },
                  { feature: "Múltiples usuarios", free: false, pro: false, team: true },
                  { feature: "Integración Jira/Confluence", free: false, pro: false, team: true },
                ].map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-700/20">
                    <td className="px-4 py-3 text-slate-300">{row.feature}</td>
                    {(["free", "pro", "team"] as const).map((plan) => {
                      const val = row[plan];
                      return (
                        <td key={plan} className="px-4 py-3 text-center">
                          {typeof val === "boolean" ? (
                            val ? (
                              <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                            ) : (
                              <span className="text-slate-600">—</span>
                            )
                          ) : (
                            <span className={`font-medium ${plan === "pro" ? "text-sky-300" : "text-slate-300"}`}>
                              {val}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-100 mb-6 text-center">Preguntas frecuentes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FAQ.map((item) => (
              <div key={item.q} className="rounded-xl bg-slate-800 border border-slate-700 p-5">
                <h3 className="font-semibold text-slate-100 text-sm mb-2">{item.q}</h3>
                <p className="text-sm text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {!profile && (
          <div className="text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold transition-all shadow-lg shadow-sky-500/25"
            >
              Empezar gratis →
            </Link>
            <p className="text-xs text-slate-500 mt-3">Sin tarjeta de crédito</p>
          </div>
        )}
      </div>
    </div>
  );
}
