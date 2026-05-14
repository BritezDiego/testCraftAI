import type { AppContext, OutputFormat, PricingPlan } from "./types";

export const TEMPLATES = [
  {
    name: "Login",
    story:
      "As a registered user, I want to log in to the application using my email and password so that I can access my personalized dashboard and account settings.",
  },
  {
    name: "Checkout",
    story:
      "As a customer, I want to complete the checkout process by entering my shipping address, selecting a payment method, and confirming my order so that I can purchase the items in my shopping cart.",
  },
  {
    name: "Search",
    story:
      "As a user, I want to search for products by keyword, category, and price range so that I can quickly find items that match my needs.",
  },
  {
    name: "Registration",
    story:
      "As a new user, I want to create an account by providing my name, email, and password so that I can start using the platform's features.",
  },
  {
    name: "Payment",
    story:
      "As a customer, I want to add a new credit card to my account, including card number, expiration date, and CVV, so that I can use it for future purchases.",
  },
];

export const FORMAT_OPTIONS: { value: OutputFormat; label: string; desc: string }[] = [
  { value: "gherkin", label: "Gherkin", desc: "BDD feature files" },
  { value: "steps", label: "Steps", desc: "Numbered test steps" },
  { value: "checklist", label: "Checklist", desc: "Exploratory testing" },
];

export const CONTEXT_OPTIONS: { value: AppContext; label: string }[] = [
  { value: "web_app", label: "Web App" },
  { value: "mobile_app", label: "Mobile" },
  { value: "api", label: "API" },
  { value: "banking", label: "Banking" },
  { value: "ecommerce", label: "Ecommerce" },
  { value: "healthcare", label: "Healthcare" },
  { value: "general", label: "General" },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Para QAs que quieren probar la herramienta",
    credits: 10,
    features: [
      { text: "10 generaciones por mes" },
      { text: "Formato Gherkin y Steps" },
      { text: "Export a .feature y .md" },
      { text: "Historial de 30 días" },
      { text: "Soporte por email" },
    ],
    highlighted: false,
    cta: "Empezar gratis",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "mes",
    description: "Para QA Engineers profesionales",
    credits: 200,
    features: [
      { text: "200 generaciones por mes" },
      { text: "Todos los formatos" },
      { text: "Todos los contextos (Banking, Healthcare...)" },
      { text: "Edge cases avanzados" },
      { text: "Historial ilimitado" },
      { text: "Export a múltiples formatos" },
      { text: "Export directo a JIRA (deep link)" },
      { text: "Soporte prioritario" },
    ],
    highlighted: true,
    cta: "Empezar Pro",
  },
  {
    id: "team",
    name: "Team",
    price: "$79",
    period: "mes",
    description: "Para equipos de QA",
    credits: 1000,
    features: [
      { text: "1000 generaciones por mes" },
      { text: "Todo lo de Pro" },
      { text: "Generaciones compartibles por link público" },
      { text: "Templates personalizables" },
      { text: "Export directo a JIRA (deep link)" },
      { text: "Historial ilimitado con búsqueda avanzada" },
      { text: "Soporte prioritario (respuesta en 24hrs)" },
      { text: "API access", comingSoon: true },
      { text: "Multi-usuario hasta 5 personas", comingSoon: true },
      { text: "Dashboard de equipo", comingSoon: true },
    ],
    highlighted: false,
    cta: "Empezar Team",
  },
];

export const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  pro: 200,
  team: 1000,
};

export const TEMPLATE_LIMITS: Record<string, number> = {
  free: 3,
  pro: 20,
  team: Infinity,
};
