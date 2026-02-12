const quotes = [
  {
    text: "The only jewelry I never take off. It showers, sleeps, and lives with me.",
    author: "Sarah M.",
  },
  {
    text: "Finally, pieces that feel luxurious without the luxury markup.",
    author: "Priya K.",
  },
];

const press = ["VOGUE", "ELLE", "BAZAAR", "REFINERY29"];

export default function Testimonials() {
  return (
    <section className="bg-cream-dark">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {/* Quotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {quotes.map((q) => (
            <blockquote key={q.author} className="text-center">
              <p className="font-serif italic text-xl md:text-2xl text-charcoal leading-relaxed">
                &ldquo;{q.text}&rdquo;
              </p>
              <cite className="block mt-4 text-sm text-warm-gray not-italic tracking-wide">
                — {q.author}
              </cite>
            </blockquote>
          ))}
        </div>

        {/* Press bar */}
        <div className="border-t border-tan pt-10">
          <p className="text-center text-xs text-warm-gray tracking-widest uppercase mb-6">
            As seen in
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {press.map((name) => (
              <span
                key={name}
                className="font-serif text-xl md:text-2xl tracking-[0.2em] text-warm-gray/50"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
