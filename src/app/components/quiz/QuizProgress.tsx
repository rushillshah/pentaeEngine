interface QuizProgressProps {
  current: number;
  total: number;
}

export default function QuizProgress({ current, total }: QuizProgressProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-warm-gray">
          Step {current} of {total}
        </span>
        <span className="text-sm text-warm-gray">{percent}%</span>
      </div>
      <div className="relative w-full h-2 bg-tan rounded-full overflow-visible">
        <div
          className="h-full bg-gold rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-0">
          {Array.from({ length: total }, (_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < current;
            const isCurrent = stepNum === current;

            return (
              <div
                key={stepNum}
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-gold border-gold"
                    : isCurrent
                    ? "bg-gold border-gold ring-2 ring-gold/30"
                    : "bg-tan border-tan"
                }`}
                style={{
                  position: "absolute",
                  left: `${(stepNum / total) * 100}%`,
                  transform: "translate(-50%, 0)",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
