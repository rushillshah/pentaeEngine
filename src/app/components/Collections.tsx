import PlaceholderImage from "./PlaceholderImage";
import { ArrowRightIcon } from "./icons";

const collections = [
  { name: "Essentials", label: "Essentials Collection" },
  { name: "Stones", label: "Stones Collection" },
  { name: "Stacking", label: "Stacking Collection" },
];

export default function Collections() {
  return (
    <section className="bg-cream-dark">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {/* Heading with decorative lines */}
        <div className="flex items-center gap-6 mb-12">
          <div className="flex-1 h-px bg-tan" />
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
            Collections
          </h2>
          <div className="flex-1 h-px bg-tan" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((c) => (
            <a key={c.name} href="#" className="group block">
              <PlaceholderImage
                variant="gold"
                label={c.label}
                aspectRatio="aspect-[4/5]"
                className="group-hover:opacity-90 transition-opacity"
              />
              <div className="mt-4 flex items-center gap-2">
                <span className="font-serif text-lg text-charcoal">
                  {c.name}
                </span>
                <ArrowRightIcon className="text-gold group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
