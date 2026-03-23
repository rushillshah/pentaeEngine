"use client";

import { useState } from "react";
import { ELEMENT_META } from "./elementData";

interface QuizWelcomeProps {
  onStart: () => void;
}

export default function QuizWelcome({ onStart }: QuizWelcomeProps) {
  const [consent, setConsent] = useState(false);

  const elements = Object.values(ELEMENT_META);

  return (
    <div className="text-center animate-fade-in-up">
      <p className="text-xs tracking-[0.3em] uppercase text-gold font-medium mb-4">
        PENTAE ELEMENT QUIZ
      </p>
      <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-6">
        Discover Your Elemental Profile
      </h1>
      <p className="text-warm-gray text-lg max-w-lg mx-auto mb-8 leading-relaxed">
        Answer a few questions about yourself and your personality to uncover
        your unique elemental signature. We will use your birth details and
        responses to calculate which elements guide your energy and style.
      </p>

      <div className="flex justify-center gap-4 mb-10">
        {elements.map((el, i) => (
          <div
            key={el.label}
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 text-xl opacity-0 animate-fade-in-up"
            style={{
              borderColor: el.color,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <el.Icon size={20} style={{ color: el.color }} />
          </div>
        ))}
      </div>

      <div className="bg-white/50 rounded-lg p-5 border border-tan max-w-md mx-auto mb-8">
        <label className="flex items-start gap-3 text-left cursor-pointer">
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
      </div>

      <button
        onClick={onStart}
        disabled={!consent}
        className={`px-8 py-2.5 bg-gold text-white text-sm tracking-wide rounded hover:bg-gold-light transition-colors disabled:opacity-50 ${
          consent ? "animate-glow-pulse" : ""
        }`}
      >
        Start Quiz
      </button>
    </div>
  );
}
