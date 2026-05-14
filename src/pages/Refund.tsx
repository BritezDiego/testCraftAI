import { Link } from "react-router-dom";
import { FlaskConical, ArrowLeft } from "lucide-react";

export default function Refund() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center">
            <FlaskConical className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-400">TestCraft AI</span>
        </div>

        <h1 className="text-3xl font-bold text-slate-100 mb-2">Refund Policy</h1>
        <p className="text-sm text-slate-500 mb-10">Effective date: May 13, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <Section title="1. Payment Processing">
            <p>
              All payments for TestCraft AI subscriptions are processed by{" "}
              <strong className="text-slate-200">Paddle</strong>, which acts as the Merchant of Record
              for all transactions. This means Paddle handles billing, tax collection, and payment
              disputes on our behalf. When you purchase a subscription, your contract for payment is
              with Paddle, governed by their{" "}
              <a
                href="https://www.paddle.com/legal/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 transition-colors"
              >
                Terms of Service
              </a>.
            </p>
          </Section>

          <Section title="2. 14-Day Money-Back Guarantee">
            <p>
              We offer a full refund within <strong className="text-slate-200">14 days</strong> of
              your initial subscription purchase if you are not satisfied with the Service, no questions asked.
            </p>
            <p>
              To request a refund within this period, contact us at{" "}
              <a href="mailto:soporte@testcraftai.com" className="text-sky-400 hover:text-sky-300 transition-colors">
                soporte@testcraftai.com
              </a>{" "}
              with your account email and the reason for your request (optional). We will process the
              refund within 5 to 10 business days, depending on your payment method.
            </p>
            <div className="mt-4 rounded-xl bg-sky-500/10 border border-sky-500/20 p-4">
              <p className="text-sky-300 font-medium mb-1">Eligible for refund</p>
              <ul className="space-y-1 text-slate-400">
                <li className="flex gap-2"><span className="text-sky-400 shrink-0">-</span>First-time purchase of a Pro or Team plan.</li>
                <li className="flex gap-2"><span className="text-sky-400 shrink-0">-</span>Request submitted within 14 days of the charge date.</li>
              </ul>
            </div>
          </Section>

          <Section title="3. After the 14-Day Period">
            <p>
              We do not offer refunds for subscription charges after the 14-day window has passed.
              This includes partial-month refunds for unused time.
            </p>
            <p>
              However, you can <strong className="text-slate-200">cancel your subscription at any time</strong>{" "}
              from your account dashboard. Upon cancellation:
            </p>
            <ul className="mt-3 space-y-1.5">
              <li className="flex gap-2"><span className="text-slate-500 shrink-0">-</span>Your subscription remains active until the end of the current billing period.</li>
              <li className="flex gap-2"><span className="text-slate-500 shrink-0">-</span>You will not be charged again after cancellation.</li>
              <li className="flex gap-2"><span className="text-slate-500 shrink-0">-</span>Access to paid features continues until the period ends.</li>
            </ul>
          </Section>

          <Section title="4. Renewals">
            <p>
              Subscriptions renew automatically on a monthly basis. You will receive a receipt from Paddle
              for each renewal charge. To avoid being charged for the next period, cancel at least
              24 hours before your renewal date. Renewal charges are not eligible for refund unless
              you contact us within 48 hours of the charge and have not used the Service during
              that billing cycle.
            </p>
          </Section>

          <Section title="5. Free Plan">
            <p>
              The Free plan is provided at no cost. No refund is applicable as no payment is required.
            </p>
          </Section>

          <Section title="6. Exceptional Circumstances">
            <p>
              We evaluate refund requests outside the standard policy on a case-by-case basis in
              exceptional circumstances (e.g., technical failures that prevented use of the Service
              for an extended period). Contact us to discuss your situation.
            </p>
          </Section>

          <Section title="7. How to Request a Refund">
            <ol className="mt-3 space-y-2 list-none">
              {[
                'Send an email to soporte@testcraftai.com with subject: "Refund Request -- [your email]".',
                "Include your account email address and the date of the charge.",
                "We will respond within 2 business days and process approved refunds within 5 to 10 business days.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-sky-400 font-semibold shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="8. Contact">
            <p>
              Questions about this policy? Reach us at{" "}
              <a href="mailto:soporte@testcraftai.com" className="text-sky-400 hover:text-sky-300 transition-colors">
                soporte@testcraftai.com
              </a>
              {" "}- QualityBridge - Buenos Aires, Argentina.
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-600">
          <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
          <Link to="/" className="hover:text-slate-400 transition-colors">TestCraft AI</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-slate-100 mb-3">{title}</h2>
      <div className="space-y-3 text-slate-400">{children}</div>
    </section>
  );
}
