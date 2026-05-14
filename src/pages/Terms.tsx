import { Link } from "react-router-dom";
import { FlaskConical, ArrowLeft } from "lucide-react";

export default function Terms() {
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

        <h1 className="text-3xl font-bold text-slate-100 mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-10">Effective date: May 13, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <Section title="1. Agreement to Terms">
            <p>
              By accessing or using TestCraft AI ("the Service"), operated by QualityBridge, you agree
              to be bound by these Terms of Service. If you do not agree, do not use the Service.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              TestCraft AI is a SaaS platform that generates professional test cases from user stories
              using artificial intelligence. The Service is available at{" "}
              <a href="https://test-craft-ai-mu.vercel.app" className="text-sky-400 hover:text-sky-300 transition-colors">
                test-craft-ai-mu.vercel.app
              </a>.
            </p>
          </Section>

          <Section title="3. Account Registration">
            <p>
              You must create an account to access most features. You are responsible for maintaining
              the confidentiality of your credentials and for all activity under your account. You must
              provide accurate and complete information at registration and keep it updated.
            </p>
          </Section>

          <Section title="4. Subscriptions and Billing">
            <p>TestCraft AI offers the following plans:</p>
            <ul className="mt-3 space-y-1.5 list-none">
              <li className="flex gap-2">
                <span className="text-sky-400 shrink-0">-</span>
                <span><strong className="text-slate-200">Free</strong> -- $0/month, 10 generations per month.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sky-400 shrink-0">-</span>
                <span><strong className="text-slate-200">Pro</strong> -- $19/month, 200 generations per month.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sky-400 shrink-0">-</span>
                <span><strong className="text-slate-200">Team</strong> -- $79/month, 1000 generations per month.</span>
              </li>
            </ul>
            <p className="mt-3">
              Paid subscriptions are billed monthly. Payments are processed by Paddle, which acts as the
              Merchant of Record. Credits reset on the first day of each billing cycle and do not accumulate
              across periods.
            </p>
          </Section>

          <Section title="5. Acceptable Use">
            <p>You agree not to:</p>
            <ul className="mt-3 space-y-1.5">
              <li className="flex gap-2"><span className="text-slate-500 shrink-0">-</span>Use the Service for any unlawful purpose.</li>
              <li className="flex gap-2"><span className="text-slate-500 shrink-0">-</span>Attempt to reverse-engineer or access the Service's underlying AI models.</li>
              <li className="flex gap-2"><span className="text-slate-500 shrink-0">-</span>Resell or sublicense access to the Service without written authorization.</li>
              <li className="flex gap-2"><span className="text-slate-500 shrink-0">-</span>Use automated tools to abuse credit limits or circumvent rate limits.</li>
              <li className="flex gap-2"><span className="text-slate-500 shrink-0">-</span>Transmit content that is harmful, offensive, or violates third-party rights.</li>
            </ul>
          </Section>

          <Section title="6. Intellectual Property">
            <p>
              The Service, including its branding, interface, and underlying technology, is owned by
              QualityBridge. Content you generate using the Service (test cases, outputs) is yours.
              You grant QualityBridge a limited license to process your inputs solely to provide the Service.
            </p>
          </Section>

          <Section title="7. Disclaimer of Warranties">
            <p>
              The Service is provided "as is" without warranties of any kind, express or implied.
              TestCraft AI does not guarantee that generated test cases will be error-free, complete,
              or suitable for any specific purpose. Use of AI-generated content is at your own discretion.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, QualityBridge shall not be liable for
              any indirect, incidental, special, or consequential damages arising from your use of the
              Service, even if advised of the possibility of such damages. Our total liability shall not
              exceed the amount you paid us in the 30 days prior to the claim.
            </p>
          </Section>

          <Section title="9. Termination">
            <p>
              We reserve the right to suspend or terminate your account at any time for violation of
              these Terms. You may terminate your account at any time by cancelling your subscription
              and deleting your account from your settings.
            </p>
          </Section>

          <Section title="10. Governing Law">
            <p>
              These Terms are governed by the laws of the Republic of Argentina. Any disputes shall be
              subject to the exclusive jurisdiction of the courts located in Buenos Aires, Argentina.
            </p>
          </Section>

          <Section title="11. Changes to Terms">
            <p>
              We may update these Terms from time to time. We will notify you of significant changes via
              email or a notice within the Service. Continued use after changes constitutes acceptance.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              For questions about these Terms, contact us at{" "}
              <a href="mailto:soporte@testcraftai.com" className="text-sky-400 hover:text-sky-300 transition-colors">
                soporte@testcraftai.com
              </a>.
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-600">
          <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
          <Link to="/refund" className="hover:text-slate-400 transition-colors">Refund Policy</Link>
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
