interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
}

interface PricingPlansProps {
  plans: Plan[];
}

export function PricingPlans({ plans }: PricingPlansProps) {
  return (
    <section id="pricing" className="bg-[#05060f]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-16">
        <div className="space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-300/80">Plans</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Ship your next release without waiting on bandwidth.
          </h2>
          <p className="mx-auto max-w-2xl text-slate-300">
            Start for free, scale when your team needs more workspaces, collaboration, and governance.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex h-full flex-col rounded-3xl border p-6 text-left transition ${
                plan.highlight
                  ? "border-blue-400/60 bg-blue-500/10 shadow-[0_30px_90px_-45px_rgba(37,99,235,0.75)]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                {plan.highlight && (
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-slate-300">{plan.description}</p>
              <p className="mt-6 text-3xl font-semibold text-white">{plan.price}</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-200">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`mt-10 inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${plan.highlight ? "bg-white text-slate-900 hover:bg-blue-50" : "border border-white/20 text-white hover:bg-white/10"}`}>
                {plan.highlight ? "Start free trial" : "Talk to sales"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
