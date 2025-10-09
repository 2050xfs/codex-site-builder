interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="bg-[#05060f]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-16">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-300/80">Customer love</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Trusted by teams that obsess over craft and velocity.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial.name}
              className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-slate-200"
            >
              <p className="text-sm leading-relaxed text-slate-200">“{testimonial.quote}”</p>
              <div className="mt-8">
                <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  {testimonial.role} · {testimonial.company}
                </p>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
