import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ResultsDashboard from "@/app/components/results/ResultsDashboard";
import { PersonalizationService } from "@/server/services/PersonalizationService";
import { RecommendationService } from "@/server/services/RecommendationService";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Results | Pentae",
  description: "Your elemental profile and recommended jewelry.",
};

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function ResultsPage({ params }: PageProps) {
  const { sessionId } = await params;
  const id = parseInt(sessionId, 10);

  if (isNaN(id)) {
    return <ResultsNotFound message="Invalid session ID." />;
  }

  const session = await PersonalizationService.getSession(id);

  if (!session) {
    return <ResultsNotFound message="We couldn't find results for this session." />;
  }

  if (session.status !== "COMPLETED" || session.dominant_element === null) {
    return <ResultsNotFound message="This session hasn't been completed yet. Please finish the quiz first." />;
  }

  const elementVector = {
    air: session.air_score ?? 0,
    water: session.water_score ?? 0,
    fire: session.fire_score ?? 0,
    earth: session.earth_score ?? 0,
    spirit: session.spirit_score ?? 0,
  };

  const recommendations = await RecommendationService.getRecommendations({
    dominantElement: session.dominant_element,
    elementVector,
  });

  const dashboardSession = {
    dominant_element: session.dominant_element,
    air_score: elementVector.air,
    water_score: elementVector.water,
    fire_score: elementVector.fire,
    earth_score: elementVector.earth,
    spirit_score: elementVector.spirit,
    narrative_text: session.narrative_text,
    narrative_source: session.narrative_source,
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <ResultsDashboard
            session={dashboardSession}
            recommendations={recommendations}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}

function ResultsNotFound({ message }: { message: string }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-serif text-3xl text-charcoal mb-4">
            Results Not Found
          </h1>
          <p className="text-warm-gray mb-8 max-w-md mx-auto">{message}</p>
          <a
            href="/quiz"
            className="inline-block px-8 py-2.5 bg-gold text-white text-sm tracking-wide rounded hover:bg-gold-light transition-colors"
          >
            Take the Quiz
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
