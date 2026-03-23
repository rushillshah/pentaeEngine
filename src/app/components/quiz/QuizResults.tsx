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
}

const ELEMENT_COLORS: Record<string, string> = {
  fire: "#E25822",
  water: "#4A90D9",
  air: "#87CEEB",
  earth: "#8B7355",
  spirit: "#9B59B6",
};

export default function QuizResults({
  elementVector,
  dominantElement,
}: QuizResultsProps) {
  const entries = Object.entries(elementVector)
    .map(([element, score]) => ({ element, score: score as number }))
    .sort((a, b) => b.score - a.score);

  const maxScore = entries[0]?.score || 1;

  return (
    <div>
      <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-3 text-center">
        Your Elemental Profile
      </h2>
      <p className="text-center mb-10">
        <span className="text-warm-gray text-lg">Dominant element: </span>
        <span
          className="font-serif text-2xl font-semibold capitalize"
          style={{ color: ELEMENT_COLORS[dominantElement] || "#333" }}
        >
          {dominantElement}
        </span>
      </p>

      <div className="space-y-4 max-w-lg mx-auto">
        {entries.map(({ element, score }) => {
          const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
          const color = ELEMENT_COLORS[element] || "#999";

          return (
            <div key={element}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-charcoal capitalize font-medium">
                  {element}
                </span>
                <span className="text-sm text-warm-gray">
                  {score.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-4 bg-tan rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

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
