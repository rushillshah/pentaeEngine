"use client";

import { useState } from "react";

interface QuizWelcomeProps {
  onStart: () => void;
}

export default function QuizWelcome({ onStart }: QuizWelcomeProps) {
  const [consent, setConsent] = useState(false);

  return (
    <div className="text-center">
      <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-6">
        Discover Your Elemental Profile
      </h1>
      <p className="text-warm-gray text-lg max-w-lg mx-auto mb-10 leading-relaxed">
        Answer a few questions about yourself and your personality to uncover
        your unique elemental signature. We will use your birth details and
        responses to calculate which elements guide your energy and style.
      </p>

      <label className="flex items-start gap-3 text-left max-w-md mx-auto mb-8 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-tan text-gold focus:ring-gold"
        />
        <span className="text-sm text-warm-gray leading-relaxed">
          I agree to share my birth details for this elemental profile quiz
        </span>
      </label>

      <button
        onClick={onStart}
        disabled={!consent}
        className="px-8 py-2.5 bg-gold text-white text-sm tracking-wide rounded hover:bg-gold-light transition-colors disabled:opacity-50"
      >
        Start Quiz
      </button>
    </div>
  );
}
