interface QuizLoadingProps {
  error?: string;
}

export default function QuizLoading({ error }: QuizLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {!error && (
        <>
          <div className="mb-6">
            <div className="w-10 h-10 border-3 border-tan border-t-gold rounded-full animate-spin" />
          </div>
          <p className="text-warm-gray text-lg">
            Calculating your elemental profile...
          </p>
        </>
      )}

      {error && (
        <div className="w-full max-w-md text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
          {error}
        </div>
      )}
    </div>
  );
}
