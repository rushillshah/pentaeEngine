const LIKERT_LABELS = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
] as const;

interface QuizQuestionProps {
  questionNumber: number;
  questionText: string;
  value: number | null;
  onAnswer: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function QuizQuestion({
  questionNumber,
  questionText,
  value,
  onAnswer,
  onNext,
  onBack,
}: QuizQuestionProps) {
  return (
    <div>
      <p className="text-sm text-warm-gray mb-2">Question {questionNumber} of 8</p>
      <h2 className="font-serif text-xl md:text-2xl text-charcoal mb-8 leading-relaxed">
        {questionText}
      </h2>

      <div className="flex flex-wrap gap-2 mb-10">
        {LIKERT_LABELS.map((label, i) => {
          const score = i + 1;
          const isSelected = value === score;

          return (
            <button
              key={score}
              onClick={() => onAnswer(score)}
              className={`flex-1 min-w-[100px] px-3 py-2.5 text-xs sm:text-sm rounded transition-colors ${
                isSelected
                  ? "bg-gold text-white"
                  : "border border-tan text-charcoal hover:border-gold"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2.5 border border-tan text-charcoal text-sm tracking-wide rounded hover:border-gold transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={value === null}
          className="px-6 py-2.5 bg-gold text-white text-sm tracking-wide rounded hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
