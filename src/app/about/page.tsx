import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PlaceholderImage from "../components/PlaceholderImage";

export const metadata = {
  title: "About | Pentae",
  description: "Our story — elemental jewelry designed for real life.",
};

const values = [
  {
    title: "Five Elements",
    description:
      "Each piece draws from Fire, Water, Earth, Air, and Aether — the five elements that shape who we are. Your jewelry, aligned to your energy.",
  },
  {
    title: "Ethically Sourced",
    description:
      "We work only with certified suppliers. Recycled gold vermeil, conflict-free stones, and transparent sourcing from mine to hand.",
  },
  {
    title: "Made to Last",
    description:
      "Demi-fine means no compromises. Thick gold plating, solid construction, and materials that hold up to everyday wear — not just special occasions.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-cream-dark">
          <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-serif text-4xl md:text-5xl leading-tight text-charcoal">
                Jewelry rooted
                <br />
                in the elements.
              </h1>
              <p className="mt-5 text-warm-gray text-lg max-w-md mx-auto md:mx-0">
                Pentae was born from a simple idea: what if your jewelry reflected
                who you truly are? We use numerology and the five classical
                elements to create pieces that feel like they were made for you —
                because they were.
              </p>
            </div>
            <div className="flex-1 w-full max-w-lg">
              <PlaceholderImage
                variant="gold"
                label="Our Workshop"
                aspectRatio="aspect-[4/3]"
              />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="flex items-center gap-6 mb-12">
            <div className="flex-1 h-px bg-tan" />
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
              What We Stand For
            </h2>
            <div className="flex-1 h-px bg-tan" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((v) => (
              <div key={v.title}>
                <h3 className="font-serif text-xl text-charcoal mb-3">
                  {v.title}
                </h3>
                <p className="text-warm-gray leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-cream-dark">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
              Find your element.
            </h2>
            <p className="text-warm-gray mb-8 max-w-lg mx-auto">
              Every piece in our collection is tied to one of the five elements.
              Discover which one resonates with you.
            </p>
            <a
              href="/shop"
              className="inline-block px-8 py-3 bg-gold text-white text-sm tracking-wide rounded hover:bg-gold-light transition-colors"
            >
              Shop the Collection
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
