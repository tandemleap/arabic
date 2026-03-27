const painPoints = [
  {
    title: 'Grant & Contract Reporting',
    description:
      "Drowning in data pulls before every report deadline? I help you build reporting systems that don't eat your week — or require you to reconstruct them from scratch every quarter.",
  },
  {
    title: 'Outcomes Tracking',
    description:
      "If you're not sure what your data is actually telling you about your program, you're not alone. I help you design tracking that's readable, honest, and useful — not just impressive-looking to funders.",
  },
  {
    title: 'Program Design Clarity',
    description:
      "When enrollment is soft or retention is inconsistent, there's usually a reason — and it's usually findable. I help you trace what's actually happening so you can fix the right thing.",
  },
  {
    title: 'Funder-Ready Stories',
    description:
      "Numbers alone don't move grant committees. I help you translate your outcomes data into plain-language narratives that tell the real story of your program's impact.",
  },
]

export default function WhatIHelpWith() {
  return (
    <section id="services" className="bg-cream py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-forest mb-4">
          What I help with
        </h2>
        <p className="text-forest/60 text-lg mb-16 max-w-2xl">
          Most of this work shows up in the same four places. Any of them sound familiar?
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {painPoints.map((point) => (
            <div
              key={point.title}
              className="bg-white border border-cream-dark rounded-lg p-8 hover:shadow-md transition-shadow"
            >
              <div className="w-8 h-1 bg-rust mb-5 rounded" />
              <h3 className="font-serif text-xl text-forest mb-3">{point.title}</h3>
              <p className="text-forest/65 leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
