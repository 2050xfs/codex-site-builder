interface QA {
  question: string;
  answer: string;
}

interface FAQProps {
  items: QA[];
}

export function FAQ({ items }: FAQProps) {
  return (
    <section className="bg-[#05060f]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-16">
        <div className="space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-300/80">FAQ</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Answers before you ask.</h2>
          <p className="mx-auto max-w-2xl text-slate-300">
            Everything you need to feel confident launching with Codex Builder from day one.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 text-left">
          {items.map((item) => (
            <details
              key={item.question}
              className="group rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-slate-200"
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white">
                {item.question}
                <span className="text-lg transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-sm text-slate-300">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
