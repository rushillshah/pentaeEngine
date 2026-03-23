import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuizWizard from "../components/quiz/QuizWizard";

export const metadata = {
  title: "Element Quiz | Pentae",
  description:
    "Discover your elemental signature and find jewelry that resonates with you.",
};

export default function QuizPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        <section className="max-w-2xl mx-auto px-6 py-16 md:py-24">
          <QuizWizard />
        </section>
      </main>
      <Footer />
    </>
  );
}
