"use client";

import { useState, useEffect } from "react";
import { ELEMENT_META } from "./elementData";

interface QuizLoadingProps {
  error?: string;
}

const ELEMENT_KEYS = Object.keys(ELEMENT_META);

const ELEMENT_MESSAGES: Record<string, string> = {
  FIRE: "Reading your fire...",
  WATER: "Sensing your water...",
  AIR: "Channeling your air...",
  EARTH: "Grounding your earth...",
  SPIRIT: "Connecting your spirit...",
};

export default function QuizLoading({ error }: QuizLoadingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ELEMENT_KEYS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const currentKey = ELEMENT_KEYS[currentIndex];
  const currentElement = ELEMENT_META[currentKey];

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
      {!error && (
        <>
          <div className="text-5xl mb-4 transition-opacity duration-300">
            {currentElement.icon}
          </div>
          <p className="text-warm-gray text-lg mb-6">
            {ELEMENT_MESSAGES[currentKey]}
          </p>
          <div>
            <div className="w-8 h-8 border-2 border-tan border-t-gold rounded-full animate-spin" />
          </div>
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
