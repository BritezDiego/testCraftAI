import { Link } from "react-router-dom";
import {
  Clipboard,
  Sparkles,
  Download,
  Shield,
  History,
  FileCode,
  Layers,
  GitBranch,
  ArrowRight,
  FlaskConical,
} from "lucide-react";
import PricingCard from "../components/PricingCard";
import { PRICING_PLANS } from "../lib/constants";

const FEATURES = [
  { icon: FileCode, title: "Gherkin/BDD Output", desc: "Feature files listos para Cucumber, Playwright, Cypress y más." },
  { icon: Shield, title: "Edge Cases Automáticos", desc: "IA detecta casos límite que un QA junior suele perder." },
  { icon: Download, title: "Export Múltiple", desc: "Descargá como .feature, .md o .txt con un click." },
  { icon: History, title: "Historial Completo", desc: "Accedé y re-exportá cualquier generación anterior." },
  { icon: Layers, title: "Multi-formato", desc: "Gherkin, Steps numerados o Checklist exploratorio." },
  { icon: GitBranch, title: "Contextos Específicos", desc: "Banking, Healthcare, Ecommerce — prompts especializados por dominio." },
];

const DEMO_INPUT = `As a registered user, I want to log in to the application using my email and password so that I can access my personalized dashboard.`;

const DEMO_OUTPUT = `Feature: User Authentication

  Background:
    Given the application is running
    And the login page is accessible

  @smoke @happy-path
  Scenario: Successful login with valid credentials
    Given a registered user with email "user@example.com"
    When the user enters valid email and password
    And clicks the "Login" button
    Then the user is redirected to the dashboard
    And a welcome message is displayed

  @negative
  Scenario: Login with incorrect password
    Given a registered user with email "user@example.com"
    When the user enters an incorrect password
    Then an error message "Invalid credentials" is shown
    And the user remains on the login page

  @edge-case
  Scenario: Login with SQL injection attempt
    When the user enters "' OR '1'='1" as email
    Then the input is sanitized
    And no unauthorized access is granted`;

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-violet-600">
              <FlaskConical className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-100 text-sm">TestCraft AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-3 py-1.5 text-sm text-slate-300 hover:text-slate-100 transition-colors">
              Iniciar sesión
            </Link>
            <Link to="/register" className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium transition-colors">
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Claude claude-sonnet-4-20250514
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Generá test cases profesionales{" "}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              en 30 segundos
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Pegá una user story, la IA hace el resto. Gherkin, Steps o Checklist — exportá
            a tu framework favorito con un click.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-base transition-all shadow-lg shadow-sky-500/25 hover:shadow-sky-400/30"
            >
              Empezar gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-slate-100 font-medium text-base transition-all"
            >
              Ya tengo cuenta
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">Sin tarjeta de crédito · 10 generaciones gratis</p>
        </div>
      </section>

      {/* Demo */}
      <section className="py-16 sm:py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm text-slate-500 mb-8 uppercase tracking-widest font-medium">
            Así funciona
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/50">
            {/* Input */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-700">
              <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
                <Clipboard className="h-3.5 w-3.5" />
                Tu user story
              </div>
              <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{DEMO_INPUT}</pre>
            </div>
            {/* Output */}
            <div className="p-6">
              <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                Test cases generados
              </div>
              <pre
                className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-mono overflow-auto"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                dangerouslySetInnerHTML={{
                  __html: DEMO_OUTPUT
                    .replace(/Feature:/g, '<span class="gherkin-feature">Feature:</span>')
                    .replace(/(Background:|Scenario:|Scenario Outline:)/g, '<span class="gherkin-scenario">$1</span>')
                    .replace(/(Given |When |Then |And )/g, '<span class="gherkin-keyword">$1</span>')
                    .replace(/(@\w[\w-]*)/g, '<span class="gherkin-tag">$1</span>')
                    .replace(/"([^"]+)"/g, '"<span class="gherkin-string">$1</span>"'),
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-100 mb-12">
            Tres pasos, test cases perfectos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Clipboard, step: "01", title: "Pegá tu user story", desc: "Copiá la user story desde Jira, Notion o donde la tengas." },
              { icon: Sparkles, step: "02", title: "La IA genera test cases", desc: "Claude analiza el contexto y genera escenarios completos con edge cases." },
              { icon: Download, step: "03", title: "Exportá a tu framework", desc: "Descargá en .feature, .md o copia directo al clipboard." },
            ].map((item) => (
              <div key={item.step} className="relative text-center group">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 border border-sky-500/30 flex items-center justify-center group-hover:from-sky-500/30 group-hover:to-violet-500/30 transition-all">
                    <item.icon className="h-6 w-6 text-sky-400" />
                  </div>
                </div>
                <div className="text-xs font-bold text-sky-500 mb-2">{item.step}</div>
                <h3 className="text-base font-semibold text-slate-100 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-100 mb-3">
            Todo lo que necesita un QA Engineer
          </h2>
          <p className="text-center text-slate-400 mb-12">
            Diseñado por QAs, para QAs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl bg-slate-800 border border-slate-700 p-5 hover:border-sky-500/40 transition-all group"
              >
                <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4 group-hover:bg-sky-500/20 transition-all">
                  <f.icon className="h-5 w-5 text-sky-400" />
                </div>
                <h3 className="font-semibold text-slate-100 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-20 px-4 bg-slate-800/30">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-100 mb-3">
            Precios simples y transparentes
          </h2>
          <p className="text-center text-slate-400 mb-12">Empezá gratis. Escalá cuando lo necesites.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-sky-500" />
              <span>TestCraft AI</span>
            </div>
            <span>Creado por QualityBridge · Buenos Aires</span>
            <div className="flex gap-4">
              <Link to="/pricing" className="hover:text-slate-300 transition-colors">Precios</Link>
              <Link to="/login" className="hover:text-slate-300 transition-colors">Login</Link>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-slate-600 border-t border-slate-800/60 pt-4">
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link to="/refund" className="hover:text-slate-400 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
