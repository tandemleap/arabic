export default function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-forest">
      <div className="max-w-5xl mx-auto px-6 py-32 pt-40">
        <p className="text-rust font-medium text-sm uppercase tracking-widest mb-6">
          Youth Program Consulting
        </p>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream leading-snug mb-8 max-w-4xl">
          Tell me what's working. Tell me what hurts. We'll find what's actually
          driving both — and build from there.
        </h1>
        <p className="text-cream/75 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          I work with youth nonprofits to find the real root causes inside their programs —
          not just the symptoms showing up in spreadsheets and grant reports.
        </p>
        <a
          href="#contact"
          className="inline-block bg-rust hover:bg-rust-dark text-white px-8 py-4 rounded text-lg font-medium transition-colors"
        >
          Book a Free Consult
        </a>
      </div>
    </section>
  )
}
