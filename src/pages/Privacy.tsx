import { Link } from "react-router-dom";
import { FlaskConical, ArrowLeft } from "lucide-react";

export default function Privacy() {
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

        <h1 className="text-3xl font-bold text-slate-100 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-10">Effective date: May 13, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <Section title="1. Overview">
            <p>
              TestCraft AI, operated by QualityBridge (Diego Britez), is committed to protecting your
              personal information. This Privacy Policy explains what data we collect, how we use it,
              and your rights regarding that data.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect the following categories of information:</p>
            <ul className="mt-3 space-y-3">
              <Item label="Account information">
                Name and email address provided during registration (directly or via Google OAuth).
              </Item>
              <Item label="Usage data">
                User stories you submit, generated test cases, selected formats and contexts, number
                of generations used, and feature interactions within the app.
              </Item>
              <Item label="Payment information">
                Billing is handled entirely by Paddle. We do not store credit card numbers or sensitive
                payment details. We receive from Paddle: customer ID, subscription status, and plan tier.
              </Item>
              <Item label="Technical data">
                IP address, browser type, device type, and session data collected automatically for
                security and performance monitoring.
              </Item>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use your data to:</p>
            <ul className="mt-3 space-y-1.5">
              <li className="flex gap-2"><span className="text-sky-400 shrink-0">-</span>Provide and operate the Service.</li>
              <li className="flex gap-2"><span className="text-sky-400 shrink-0">-</span>Generate test cases using AI based on your inputs.</li>
              <li className="flex gap-2"><span className="text-sky-400 shrink-0">-</span>Manage your subscription and billing.</li>
              <li className="flex gap-2"><span className="text-sky-400 shrink-0">-</span>Send transactional emails (account confirmation, billing notifications).</li>
              <li className="flex gap-2"><span className="text-sky-400 shrink-0">-</span>Improve the Service and fix bugs.</li>
              <li className="flex gap-2"><span className="text-sky-400 shrink-0">-</span>Comply with legal obligations.</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal data to third parties. We do not use your user stories to
              train AI models.
            </p>
          </Section>

          <Section title="4. Third-Party Services">
            <p>We rely on the following third parties to operate the Service:</p>
            <ul className="mt-3 space-y-3">
              <Item label="Supabase">
                Database and authentication provider. Your account data and generations are stored on
                Supabase infrastructure. See{" "}
                <a href="https://supabase.com/privacy" className="text-sky-400 hover:text-sky-300 transition-colors">
                  supabase.com/privacy
                </a>.
              </Item>
              <Item label="Anthropic (Claude API)">
                AI model used to generate test cases from your user stories. Your inputs are sent to
                Anthropic's API. See{" "}
                <a href="https://www.anthropic.com/privacy" className="text-sky-400 hover:text-sky-300 transition-colors">
                  anthropic.com/privacy
                </a>.
              </Item>
              <Item label="Paddle">
                Payment processor acting as Merchant of Record. Handles all payment transactions. See{" "}
                <a href="https://www.paddle.com/legal/privacy" className="text-sky-400 hover:text-sky-300 transition-colors">
                  paddle.com/legal/privacy
                </a>.
              </Item>
              <Item label="Vercel">
                Hosting and deployment. Your requests pass through Vercel's infrastructure. See{" "}
                <a href="https://vercel.com/legal/privacy-policy" className="text-sky-400 hover:text-sky-300 transition-colors">
                  vercel.com/legal/privacy-policy
                </a>.
              </Item>
            </ul>
          </Section>

          <Section title="5. Data Retention">
            <p>
              We retain your account data for as long as your account is active. Generated test cases
              are stored as part of your history and are deleted when you delete them or close your account.
              Free plan users' history older than 30 days may be automatically purged.
            </p>
            <p>
              You may request deletion of your account and all associated data at any time by emailing{" "}
              <a href="mailto:soporte@testcraftai.com" className="text-sky-400 hover:text-sky-300 transition-colors">
                soporte@testcraftai.com
              </a>.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="mt-3 space-y-1.5">
              <li className="flex gap-2"><span className="text-slate-500 shrink-0">-</span>Access the personal data we hold about you.</li>
              <li className="flex gap-2"><span className="text-slate-500 shrink-0">-</span>Correct inaccurate data.</li>
              <li className="flex gap-2"><span className="text-slate-500 shrink-0">-</span>Request deletion of your data.</li>
              <li className="flex gap-2"><span className="text-slate-500 shrink-0">-</span>Object to processing of your data.</li>
              <li className="flex gap-2"><span className="text-slate-500 shrink-0">-</span>Export your data in a portable format.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:soporte@testcraftai.com" className="text-sky-400 hover:text-sky-300 transition-colors">
                soporte@testcraftai.com
              </a>.
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>
              We use session cookies strictly necessary for authentication. We do not use third-party
              advertising or tracking cookies. Browser local storage is used to save your preferences
              (e.g., JIRA project URL) locally on your device.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              The Service is not directed at children under 13 years of age. We do not knowingly collect
              personal data from children. If you believe a child has provided us with their data,
              contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy periodically. We will notify you of material changes via
              email or a notice within the Service. The effective date at the top of this page indicates
              when the policy was last revised.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              For privacy-related questions or requests, contact Diego Britez at{" "}
              <a href="mailto:soporte@testcraftai.com" className="text-sky-400 hover:text-sky-300 transition-colors">
                soporte@testcraftai.com
              </a>
              {" "}- QualityBridge - Buenos Aires, Argentina.
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-600">
          <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
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

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="text-sky-400 shrink-0">-</span>
      <span>
        <strong className="text-slate-200">{label}:</strong>{" "}{children}
      </span>
    </li>
  );
}
