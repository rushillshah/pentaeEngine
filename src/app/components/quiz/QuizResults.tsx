import { ELEMENT_META } from "./elementData";
import type { NumerologyDetails } from "@/types/personalization";

interface ElementVector {
  air: number;
  water: number;
  fire: number;
  earth: number;
  spirit: number;
}

interface QuizResultsProps {
  elementVector: ElementVector;
  dominantElement: string;
  narrativeText: string;
  narrativeSource: string;
  fullName: string;
  numerologyDetails: NumerologyDetails;
}

export default function QuizResults({
  elementVector,
  dominantElement,
  narrativeText,
  fullName,
  numerologyDetails,
}: QuizResultsProps) {
  const firstName = fullName.split(" ")[0] || fullName;

  const dominantKey = dominantElement.toUpperCase();
  const dominantMeta = ELEMENT_META[dominantKey];

  const entries = Object.entries(elementVector)
    .map(([element, score]) => ({ element, score: score as number }))
    .sort((a, b) => b.score - a.score);

  const maxScore = entries[0]?.score || 1;

  const numberCards = [
    {
      number: numerologyDetails.lifePath,
      title: "Life Path",
      meaning: numerologyDetails.lifePathMeaning,
    },
    {
      number: numerologyDetails.expression,
      title: "Expression",
      meaning: numerologyDetails.expressionMeaning,
    },
    ...(numerologyDetails.soulUrge !== null
      ? [
          {
            number: numerologyDetails.soulUrge,
            title: "Soul Urge",
            meaning: numerologyDetails.soulUrgeMeaning || "",
          },
        ]
      : []),
  ];

  return (
    <div className="animate-fade-in-up">
      <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-8 text-center">
        {firstName}, Your Elemental Profile
      </h2>

      {dominantMeta && (
        <div
          className="border-l-4 rounded-lg bg-white/50 p-6 mb-10 max-w-lg mx-auto"
          style={{ borderColor: dominantMeta.color }}
        >
          <div className="mb-3" style={{ color: dominantMeta.color }}>
            <dominantMeta.Icon size={48} />
          </div>
          <h3
            className="font-serif text-2xl font-semibold mb-2"
            style={{ color: dominantMeta.color }}
          >
            {dominantMeta.label}
          </h3>
          <p className="text-warm-gray leading-relaxed">
            {dominantMeta.description}
          </p>
        </div>
      )}

      <div className="space-y-4 max-w-lg mx-auto mb-10">
        {entries.map(({ element, score }, i) => {
          const percent =
            maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
          const key = element.toUpperCase();
          const meta = ELEMENT_META[key];
          const color = meta?.color || "#999";

          return (
            <div key={element}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-charcoal capitalize font-medium inline-flex items-center gap-1.5">
                  {meta && <meta.Icon size={14} style={{ color: meta.color }} />} {element}
                </span>
                <span className="text-sm text-warm-gray">
                  {score.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-4 bg-tan rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full animate-bar-grow"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: color,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {narrativeText && (
        <blockquote className="border-l-4 border-gold pl-5 py-2 mb-10 max-w-lg mx-auto">
          <p className="font-serif text-warm-gray italic leading-relaxed">
            {narrativeText}
          </p>
        </blockquote>
      )}

      {numberCards.length > 0 && (
        <div className="max-w-lg mx-auto mb-10">
          <h3 className="font-serif text-xl text-charcoal mb-4">
            Your Numbers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {numberCards.map((card) => (
              <div
                key={card.title}
                className="bg-white/50 rounded-lg p-5 border border-tan text-center"
              >
                <div className="font-serif text-3xl text-charcoal mb-1">
                  {card.number}
                </div>
                <div className="text-sm font-medium text-gold mb-2">
                  {card.title}
                </div>
                <p className="text-xs text-warm-gray leading-relaxed">
                  {card.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center mt-12">
        <a
          href="/shop"
          className="inline-block px-8 py-2.5 bg-gold text-white text-sm tracking-wide rounded hover:bg-gold-light transition-colors"
        >
          Shop Your Element
        </a>
      </div>
    </div>
  );
}
