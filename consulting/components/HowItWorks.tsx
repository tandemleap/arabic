const steps = [
  {
    number: '01',
    title: 'Free Zoom Consult',
    subtitle: 'No charge. No pitch.',
    description:
      "60 minutes. You tell me what's working and what hurts. I listen and ask questions. At the end, we decide together whether deeper work makes sense — and if so, what that looks like.",
    items: [],
  },
  {
    number: '02',
    title: 'Diagnostic Intensive',
    subtitle: 'Paid · Zoom · 1–2 days',
    description:
      "A structured deep dive into your program's reporting, data, and design. You get a clear picture of what's actually driving your outcomes — and a prioritized list of what to do about it.",
    items: [
      'Review of current reporting systems, data collection, and program design',
      'Root cause analysis — tracing gaps back to their actual source',
      'Written findings and prioritized recommendations you can act on',
      '30-day follow-up call included',
    ],
  },
  {
    number: '03',
    title: 'On-Site Intensive',
    subtitle: 'Paid · In person · 1–3 days',
    description:
      "Everything in the Diagnostic, plus in-person working sessions with your team. We don't just plan — we build during the visit.",
    items: [
      'Hands-on work building or rebuilding key systems with your staff',
      'Working sessions with program and data team members',
      'Staff walkthrough so changes actually stick after I leave',
      'Follow-up implementation support available',
    ],
  },
]

export default function HowItWorks() {
  return (
    <section id="process" className="bg-forest py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-cream mb-4">How it works</h2>
        <p className="text-cream/60 text-lg mb-16 max-w-2xl">
          Three ways to engage, starting with a free conversation.
        </p>
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`flex flex-col md:flex-row gap-8 py-12 ${
                i < steps.length - 1 ? 'border-b border-cream/10' : ''
              }`}
            >
              <div className="md:w-24 shrink-0">
                <span className="font-serif text-5xl text-rust/50 font-bold leading-none">
                  {step.number}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-2xl text-cream mb-1">{step.title}</h3>
                <p className="text-rust text-sm font-medium uppercase tracking-wide mb-4">
                  {step.subtitle}
                </p>
                <p className="text-cream/75 leading-relaxed mb-4">{step.description}</p>
                {step.items.length > 0 && (
                  <ul className="space-y-2.5">
                    {step.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-cream/65">
                        <span className="text-rust mt-0.5 shrink-0">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border border-cream/15 rounded-lg p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-24 shrink-0">
              <span className="font-serif text-3xl text-cream/25 italic">+</span>
            </div>
            <div>
              <h3 className="font-serif text-xl text-cream mb-1">
                Implementation & Stabilization
              </h3>
              <p className="text-rust text-sm font-medium uppercase tracking-wide mb-3">
                Optional ongoing support
              </p>
              <p className="text-cream/65 leading-relaxed">
                Ongoing support to implement recommendations, train staff, and keep things
                moving. Scoped case-by-case based on what your organization actually needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
