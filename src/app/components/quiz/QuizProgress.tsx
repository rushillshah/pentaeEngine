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
      <div className="w-full h-2 bg-tan rounded-full overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
