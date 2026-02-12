import PlaceholderImage from "./PlaceholderImage";
import { CheckIcon } from "./icons";

const materials = [
  {
    name: "Gold Vermeil",
    description: "2.5µm gold over sterling silver — the demi-fine standard.",
  },
  {
    name: "Solid Gold",
    description: "14k & 18k pieces for those who want forever gold.",
  },
  {
    name: "Lab & Natural Stones",
    description: "Ethically sourced sapphires, opals, diamonds & more.",
  },
];

export default function Materials() {
  return (
    <section className="bg-cream">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Left — images */}
          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            <PlaceholderImage
              variant="warm"
              label="Material Detail"
              aspectRatio="aspect-[3/4]"
            />
            <PlaceholderImage
              variant="neutral"
              label="Close-up"
              aspectRatio="aspect-[3/4]"
              className="mt-8"
            />
          </div>

          {/* Right — copy */}
          <div className="flex-1">
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-8">
              The Demi-Fine
              <br />
              Difference
            </h2>
            <ul className="space-y-6">
              {materials.map((m) => (
                <li key={m.name} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full border border-tan flex items-center justify-center">
                    <CheckIcon size={14} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-charcoal">
                      {m.name}
                    </h3>
                    <p className="text-warm-gray text-sm mt-1">
                      {m.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="inline-block mt-8 px-8 py-3 border border-charcoal text-charcoal text-sm tracking-wide rounded hover:bg-charcoal hover:text-white transition-colors"
            >
              Explore Materials
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
