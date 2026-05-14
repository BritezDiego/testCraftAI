import { useState } from "react";
import { X, Sparkles, FileCode, List, CheckSquare, Download, ArrowRight, ArrowLeft } from "lucide-react";

const STEPS = [
  {
    icon: Sparkles,
    iconColor: "text-sky-400",
    iconBg: "bg-sky-500/20 border-sky-500/30",
    title: "Bienvenido a TestCraft AI",
    description: "Transformá tus user stories en test cases profesionales en segundos usando inteligencia artificial.",
    content: (
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-700/50 border border-slate-600 p-4">
          <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">¿Qué podés hacer?</p>
          <ul className="space-y-2">
            {[
              "Generar test cases desde cualquier user story",
              "Exportar en formato Gherkin, Steps o Checklist",
              "Incluir edge cases y escenarios negativos automáticamente",
              "Guardar y revisar tu historial de generaciones",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-sky-400 mt-0.5 shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    icon: FileCode,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/20 border-violet-500/30",
    title: "Escribí tu User Story",
    description: "Pegá cualquier user story en el campo de texto. Podés escribirla en español o inglés.",
    content: (
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-700/50 border border-slate-600 p-4">
          <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Ejemplo de user story</p>
          <p className="text-sm text-slate-300 italic leading-relaxed">
            "As a registered user, I want to log in with my email and password so that I can access my dashboard."
          </p>
        </div>
        <div className="rounded-xl bg-slate-700/50 border border-slate-600 p-4">
          <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Templates rápidos</p>
          <p className="text-sm text-slate-300">
            Usá los <span className="text-sky-300 font-medium">templates de ejemplo</span> (Login, Checkout, Search...) para probar la herramienta en segundos sin tener que escribir nada.
          </p>
        </div>
      </div>
    ),
  },
  {
    icon: List,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/20 border-emerald-500/30",
    title: "Elegí el formato y contexto",
    description: "Personalizá la salida según tu stack y metodología de trabajo.",
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: FileCode, label: "Gherkin", desc: "BDD / Cucumber", color: "text-sky-400" },
            { icon: List, label: "Steps", desc: "Pasos numerados", color: "text-violet-400" },
            { icon: CheckSquare, label: "Checklist", desc: "Exploración manual", color: "text-emerald-400" },
          ].map((f) => (
            <div key={f.label} className="rounded-xl bg-slate-700/50 border border-slate-600 p-3 text-center">
              <f.icon className={`h-5 w-5 mx-auto mb-1.5 ${f.color}`} />
              <p className="text-xs font-semibold text-slate-200">{f.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-slate-700/50 border border-slate-600 p-4">
          <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">Contextos disponibles</p>
          <p className="text-sm text-slate-300">
            Web App, Mobile, API, Banking, Ecommerce, Healthcare y más. El contexto mejora la precisión de los test cases generados.
          </p>
        </div>
      </div>
    ),
  },
  {
    icon: Download,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/20 border-amber-500/30",
    title: "Generá, copiá y exportá",
    description: "Con un click tenés tus test cases listos para pegar en Jira, Confluence o tu herramienta favorita.",
    content: (
      <div className="space-y-3">
        {[
          { label: "Copiar al portapapeles", desc: "Pegalo directo en tu herramienta de gestión de QA." },
          { label: "Descargar como archivo", desc: "Exportá como .feature (Gherkin) o .md (Steps / Checklist)." },
          { label: "Marcar como favorito", desc: "Guardá las generaciones que más uses para acceder rápido." },
          { label: "Ver historial completo", desc: "Todas tus generaciones quedan guardadas en /historial." },
        ].map((item) => (
          <div key={item.label} className="flex items-start gap-3 rounded-xl bg-slate-700/50 border border-slate-600 p-3">
            <span className="text-amber-400 mt-0.5 shrink-0 text-sm">→</span>
            <div>
              <p className="text-sm font-medium text-slate-200">{item.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

const STORAGE_KEY = "testcraft_onboarding_done";

export function useOnboarding() {
  const [show, setShow] = useState(() => localStorage.getItem(STORAGE_KEY) !== "true");

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  }

  return { show, dismiss };
}

interface Props {
  onClose: () => void;
}

export default function OnboardingModal({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];
  const Icon = current.icon;

  function next() {
    if (isLast) {
      onClose();
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-0">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-sky-400" : i < step ? "w-3 bg-sky-600" : "w-3 bg-slate-600"
                }`}
              />
            ))}
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pt-5 pb-6">
          {/* Icon + title */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`h-11 w-11 rounded-xl border flex items-center justify-center shrink-0 ${current.iconBg}`}>
              <Icon className={`h-5 w-5 ${current.iconColor}`} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">{current.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">{current.description}</p>
            </div>
          </div>

          {/* Step content */}
          <div className="mb-6">{current.content}</div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-600 transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Anterior
              </button>
            )}
            <button
              onClick={next}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition-all shadow-md shadow-sky-500/25"
            >
              {isLast ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  ¡Empezar a generar!
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* Skip */}
          {!isLast && (
            <button
              onClick={onClose}
              className="w-full text-center text-xs text-slate-600 hover:text-slate-400 mt-3 transition-colors"
            >
              Saltar introducción
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
