"use client";

import { ELEMENT_META } from "@/app/components/quiz/elementData";
import type { Product } from "@/types/product";
import RecommendedProducts from "./RecommendedProducts";
import ShareButton from "./ShareButton";

interface ScoredProduct extends Product {
  matchScore: number;
}

interface ResultsDashboardProps {
  session: {
    dominant_element: string;
    air_score: number;
    water_score: number;
    fire_score: number;
    earth_score: number;
    spirit_score: number;
    narrative_text: string | null;
    narrative_source: string | null;
  };
  recommendations: {
    elementMatch: Product[];
    scoredMatch: ScoredProduct[];
    curated: Product[];
  };
}

const ELEMENT_KEYS = ["air", "water", "fire", "earth", "spirit"] as const;

function buildElementEntries(session: ResultsDashboardProps["session"]) {
  const scoreMap: Record<string, number> = {
    air: Number(session.air_score) || 0,
    water: Number(session.water_score) || 0,
    fire: Number(session.fire_score) || 0,
    earth: Number(session.earth_score) || 0,
    spirit: Number(session.spirit_score) || 0,
  };

  return ELEMENT_KEYS
    .map((key) => ({ element: key, score: scoreMap[key] }))
    .sort((a, b) => b.score - a.score);
}

function hasScoredUniqueProducts(
  elementMatch: Product[],
  scoredMatch: ScoredProduct[],
): boolean {
  if (scoredMatch.length === 0) return false;

  const elementIds = new Set(elementMatch.map((p) => p.id));
  return scoredMatch.some((p) => !elementIds.has(p.id));
}

export default function ResultsDashboard({
  session,
  recommendations,
}: ResultsDashboardProps) {
  const dominantKey = session.dominant_element.toUpperCase();
  const meta = ELEMENT_META[dominantKey];
  const entries = buildElementEntries(session);
  const maxScore = entries[0]?.score || 1;

  const showScoredSection = hasScoredUniqueProducts(
    recommendations.elementMatch,
    recommendations.scoredMatch,
  );

  return (
    <div className="space-y-16">
      {/* Hero: Dominant Element */}
      <section className="animate-fade-in-up">
        {meta && (
          <div
            className="border-l-4 rounded-lg bg-white/50 p-8 max-w-xl mx-auto"
            style={{ borderColor: meta.color }}
          >
            <div className="mb-4" style={{ color: meta.color }}>
              <meta.Icon size={56} />
            </div>
            <h1
              className="font-serif text-3xl md:text-4xl font-semibold mb-3"
              style={{ color: meta.color }}
            >
              {meta.label}
            </h1>
            <p className="text-warm-gray leading-relaxed">
              {meta.description}
            </p>
          </div>
        )}

        {!meta && (
          <div className="border-l-4 border-gold rounded-lg bg-white/50 p-8 max-w-xl mx-auto">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal mb-3">
              Your Elemental Profile
            </h1>
            <p className="text-warm-gray leading-relaxed">
              Your dominant element: {session.dominant_element}
            </p>
          </div>
        )}
      </section>

      {/* Element Breakdown Bars */}
      <section className="animate-fade-in-up max-w-xl mx-auto">
        <h2 className="font-serif text-2xl text-charcoal mb-6">
          Element Breakdown
        </h2>
        <div className="space-y-4">
          {entries.map(({ element, score }, index) => {
            const key = element.toUpperCase();
            const elMeta = ELEMENT_META[key];
            const color = elMeta?.color || "#999";
            const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

            return (
              <div key={element}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-charcoal capitalize font-medium inline-flex items-center gap-1.5">
                    {elMeta && <elMeta.Icon size={14} style={{ color: elMeta.color }} />} {element}
                  </span>
                  <span className="text-sm text-warm-gray">
                    {score.toFixed(2)}
                  </span>
                </div>
                <div className="w-full h-4 bg-tan rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full animate-bar-grow"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: color,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Narrative */}
      {session.narrative_text && (
        <section className="animate-fade-in-up max-w-xl mx-auto">
          <blockquote className="border-l-4 border-gold pl-5 py-2">
            <p className="font-serif text-warm-gray italic leading-relaxed">
              {session.narrative_text}
            </p>
          </blockquote>
        </section>
      )}

      {/* Tier 1: Element Match */}
      <RecommendedProducts
        title="Jewelry for Your Element"
        products={recommendations.elementMatch}
      />

      {/* Tier 2: Scored Match (only if it adds new products) */}
      {showScoredSection && (
        <RecommendedProducts
          title="Your Full Element Match"
          products={recommendations.scoredMatch}
          showMatchScore
        />
      )}

      {/* Share */}
      <section className="animate-fade-in-up text-center">
        <ShareButton />
      </section>
    </div>
  );
}
