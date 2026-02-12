const variants = {
  warm: {
    gradient: "from-cream-dark via-tan to-gold-light/30",
    label: "text-warm-gray",
  },
  gold: {
    gradient: "from-gold/20 via-gold-light/30 to-tan",
    label: "text-gold",
  },
  neutral: {
    gradient: "from-cream via-cream-dark to-tan/50",
    label: "text-warm-gray/60",
  },
} as const;

type Variant = keyof typeof variants;

interface PlaceholderImageProps {
  variant?: Variant;
  label?: string;
  className?: string;
  aspectRatio?: string;
}

export default function PlaceholderImage({
  variant = "warm",
  label,
  className = "",
  aspectRatio = "aspect-[4/5]",
}: PlaceholderImageProps) {
  const v = variants[variant];

  return (
    <div
      className={`bg-gradient-to-br ${v.gradient} rounded-lg flex items-center justify-center ${aspectRatio} ${className}`}
    >
      {label && (
        <span className={`text-sm font-sans tracking-wide ${v.label}`}>
          {label}
        </span>
      )}
    </div>
  );
}
