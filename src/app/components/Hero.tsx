import PlaceholderImage from "./PlaceholderImage";

export default function Hero() {
  return (
    <section className="bg-cream">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 md:gap-16">
        {/* Left — copy */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-charcoal">
            Everyday fine jewelry
            <br />
            — made to last.
          </h1>
          <p className="mt-5 text-warm-gray text-lg max-w-md mx-auto md:mx-0">
            Demi-fine pieces designed for real life. Gold vermeil, solid gold &amp;
            ethically sourced stones.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#"
              className="inline-block px-8 py-3 bg-gold text-white text-sm tracking-wide rounded hover:bg-gold-light transition-colors text-center"
            >
              Shop Best Sellers
            </a>
            <a
              href="#"
              className="inline-block px-8 py-3 border border-charcoal text-charcoal text-sm tracking-wide rounded hover:bg-charcoal hover:text-white transition-colors text-center"
            >
              Take the Fit Quiz
            </a>
          </div>
        </div>

        {/* Right — image placeholder */}
        <div className="flex-1 w-full max-w-lg">
          <PlaceholderImage
            variant="warm"
            label="Hero Image"
            aspectRatio="aspect-[3/4]"
          />
        </div>
      </div>
    </section>
  );
}
