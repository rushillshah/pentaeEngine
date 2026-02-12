"use client";

import { useState } from "react";

const chips = ["Under $100", "Gold Tone", "Silver Tone", "Minimal", "Statement"];

export default function QuizCTA() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [forMe, setForMe] = useState(true);

  function toggleChip(chip: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(chip)) next.delete(chip);
      else next.add(chip);
      return next;
    });
  }

  return (
    <section className="bg-cream">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-20 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-3">
          Find your perfect piece
        </h2>
        <p className="text-warm-gray mb-8">in 60 seconds.</p>

        {/* Filter chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => toggleChip(chip)}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                selected.has(chip)
                  ? "bg-gold text-white border-gold"
                  : "border-tan text-warm-gray hover:border-gold hover:text-gold"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Checkboxes */}
        <div className="flex justify-center gap-6 mb-8">
          <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
            <input
              type="checkbox"
              checked={forMe}
              onChange={() => setForMe(true)}
              className="accent-gold w-4 h-4"
            />
            For Me
          </label>
          <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
            <input
              type="checkbox"
              checked={!forMe}
              onChange={() => setForMe(false)}
              className="accent-gold w-4 h-4"
            />
            For Them
          </label>
        </div>

        <a
          href="#"
          className="inline-block px-10 py-3 bg-gold text-white text-sm tracking-wide rounded hover:bg-gold-light transition-colors"
        >
          Start Quiz
        </a>
      </div>
    </section>
  );
}
