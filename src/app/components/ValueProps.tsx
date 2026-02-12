import { SparkleIcon, ShieldIcon, LeafIcon } from "./icons";

const props = [
  {
    icon: SparkleIcon,
    title: "Demi-fine, not disposable",
    description:
      "Real gold & precious materials that outlast trends. Built for years, not months.",
  },
  {
    icon: ShieldIcon,
    title: "Skin-friendly",
    description:
      "Hypoallergenic, nickel-free, and tarnish-resistant. Safe for sensitive skin.",
  },
  {
    icon: LeafIcon,
    title: "Made responsibly",
    description:
      "Ethically sourced stones, recycled metals, and carbon-neutral shipping.",
  },
];

export default function ValueProps() {
  return (
    <section className="bg-cream">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {props.map((p) => (
            <div key={p.title} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-tan text-gold mb-4">
                <p.icon size={22} />
              </div>
              <h3 className="font-serif text-lg text-charcoal mb-2">
                {p.title}
              </h3>
              <p className="text-warm-gray text-sm leading-relaxed max-w-xs mx-auto">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
