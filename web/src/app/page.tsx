import { DeploymentJourney } from "../components/DeploymentJourney";
import { EditorShowcase } from "../components/EditorShowcase";
import { FAQ } from "../components/FAQ";
import { FeatureHighlights } from "../components/FeatureHighlights";
import { FinalCTA } from "../components/FinalCTA";
import { Hero } from "../components/Hero";
import { PricingPlans } from "../components/PricingPlans";
import { PromptLab } from "../components/PromptLab";
import { SiteFooter } from "../components/SiteFooter";
import { Testimonials } from "../components/Testimonials";

const heroStats = [
  {
    label: "Teams onboarded",
    value: "1,240",
    description: "Product and marketing orgs shipping faster."
  },
  {
    label: "Average savings",
    value: "28 hrs",
    description: "Saved every launch with automated layout ops."
  },
  {
    label: "NPS",
    value: "72",
    description: "Customers that call Codex their new creative partner."
  }
];

const promptPreviews = [
  {
    label: "Brand New Startup",
    prompt:
      "Design a launch page for FluxFlow, an AI data platform. Hero must include a single sentence value prop, social proof badges, and a call-to-action button.",
    layout: [
      "Hero with gradient background, centered headline, CTA",
      "Feature trio describing insights, automation, and security",
      "Customer logos row and testimonial",
      "Pricing cards with monthly toggle"
    ],
    copy:
      "FluxFlow translates raw data into real-time insight. Trusted by teams shipping faster, with security built in and pricing that flexes with your growth."
  },
  {
    label: "Agency Portfolio",
    prompt:
      "Create an agency site for Studio North that feels editorial. Include a full-bleed hero, rotating case study, team snapshot, and inquiry form.",
    layout: [
      "Immersive hero with layered typography",
      "Case study slider featuring latest work",
      "Team grid with biographies",
      "Minimal contact form with calendar embed"
    ],
    copy:
      "Studio North shapes high-conversion brand experiences. Every pixel is strategy-led, every launch is measurable, and every client has a direct line to the makers."
  },
  {
    label: "Product Docs",
    prompt:
      "Generate a product documentation hub for NovaDrive. Needs quickstart, API reference, changelog, and ‘Deploy to Vercel’ CTA.",
    layout: [
      "Sidebar navigation with section anchors",
      "Quickstart cards for SDKs",
      "Inline code samples with copy buttons",
      "Contextual Vercel deployment banner"
    ],
    copy:
      "NovaDrive ships updates in hours, not weeks. The documentation builder autogenerates code snippets, diagrams, and deployment guides tailored to your stack."
  }
];

const editorPanels = [
  {
    title: "Structure",
    description:
      "Drag, stack, and remix atomic sections. The editor knows responsive design and keeps everything aligned without manual tweaking.",
    action: "Add section"
  },
  {
    title: "Styling",
    description:
      "Dial your brand identity in seconds. Swap palettes, typography systems, and component tone with AI suggestions derived from your assets.",
    action: "Generate theme"
  },
  {
    title: "Copy",
    description:
      "Never start from a blank page. Context-aware copywriting adapts voice and length across your entire site with one edit.",
    action: "Rewrite page"
  }
];

const deploymentSteps = [
  {
    title: "Preview",
    detail:
      "Every edit is live in your staging environment. Share links with stakeholders and capture feedback inline before launch."
  },
  {
    title: "Optimize",
    detail:
      "Performance, accessibility, and SEO checks run automatically. Resolve suggestions with one-click fixes powered by AI."
  },
  {
    title: "Deploy",
    detail:
      "Connect your Vercel account once. Push to production or create a preview branch directly from the editor with audit logs included."
  }
];

const featureHighlights = [
  {
    tag: "Realtime",
    title: "Collaborative canvas",
    description: "Comment, co-edit, and approve sections with multiplayer cursors and version-aware AI suggestions."
  },
  {
    tag: "AI",
    title: "Intent-aware prompts",
    description: "Codex interprets your goals and transforms them into components that respect accessibility and best practices."
  },
  {
    tag: "Governance",
    title: "Brand locks",
    description: "Protect typography, color, and spacing tokens. Let AI explore, but never off-brand."
  },
  {
    tag: "Insights",
    title: "Conversion analytics",
    description: "Understand how each variation performs. Codex suggests experiments and deploys winning variants automatically."
  },
  {
    tag: "Integrations",
    title: "Vercel native",
    description: "Deploy to Vercel with optimized edge caching, ISR, and environment sync baked in."
  },
  {
    tag: "Performance",
    title: "Production-grade code",
    description: "Ship clean React, TypeScript, and Tailwind with zero refactors. No more handoffs or rebuilds."
  }
];

const testimonials = [
  {
    quote:
      "Codex Builder let us stand up a fully responsive marketing site in a weekend. Our designers stayed in flow and engineering focused on the roadmap.",
    name: "Hannah Lee",
    role: "Head of Product",
    company: "Driftspace"
  },
  {
    quote:
      "We replaced a patchwork of tools with a single conversational workflow. Deploying to Vercel is quite literally a button now.",
    name: "Marco Alvarez",
    role: "Engineering Manager",
    company: "Velocity AI"
  },
  {
    quote:
      "The AI understands our brand voice better than some agencies we’ve hired. Copy, layout, and imagery all feel bespoke.",
    name: "Priya Singh",
    role: "Creative Director",
    company: "Northbound"
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    description: "Experiment with Codex Builder and ship your first site.",
    features: [
      "1 workspace",
      "Unlimited AI prompts",
      "Deploy to Vercel preview"
    ]
  },
  {
    name: "Growth",
    price: "$89/mo",
    description: "Unlock multiplayer editing, approvals, and analytics.",
    highlight: true,
    features: [
      "Unlimited workspaces",
      "Shared component library",
      "Automated performance audits",
      "1-click production deploys"
    ]
  },
  {
    name: "Enterprise",
    price: "Talk to us",
    description: "Advanced security, SSO, and white-glove onboarding.",
    features: [
      "Custom AI guardrails",
      "Role-based permissions",
      "Dedicated success architect",
      "Uptime SLA"
    ]
  }
];

const faqs = [
  {
    question: "Can Codex Builder replace my design team?",
    answer:
      "Codex accelerates your designers and engineers by automating repetitive work. You stay in control of strategy, art direction, and approvals."
  },
  {
    question: "How does the Vercel integration work?",
    answer:
      "Authorize Codex once and we manage preview URLs, env vars, and production deploys using your existing Vercel projects and permissions."
  },
  {
    question: "Is the generated code production-ready?",
    answer:
      "Yes. We output typed React components, Tailwind styling, and accessible markup with linting and testing best practices baked in."
  },
  {
    question: "Can we bring our own components?",
    answer:
      "Import your design system tokens or React components. Codex learns how to orchestrate them across new pages instantly."
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05060f] text-slate-100">
      <Hero statBlocks={heroStats} />
      <PromptLab prompts={promptPreviews} />
      <EditorShowcase panels={editorPanels} />
      <DeploymentJourney steps={deploymentSteps} />
      <FeatureHighlights features={featureHighlights} />
      <Testimonials testimonials={testimonials} />
      <PricingPlans plans={pricingPlans} />
      <FAQ items={faqs} />
      <div className="bg-[#05060f] px-6 pb-24 sm:px-10 lg:px-16">
        <FinalCTA />
      </div>
      <SiteFooter />
    </main>
  );
}
