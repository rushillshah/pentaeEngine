export default function TrustBar() {
  return (
    <div className="bg-cream-dark border-y border-tan">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-warm-gray tracking-wide">
        <span>Free shipping over $150</span>
        <span className="hidden sm:inline">·</span>
        <span>30-day returns</span>
        <span className="hidden sm:inline">·</span>
        <span>1-year warranty</span>
      </div>
    </div>
  );
}
