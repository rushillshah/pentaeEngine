import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Element Quiz | Pentae",
  description: "Discover your elemental signature and find jewelry that resonates with you.",
};

export default function QuizPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
            Find Your Element
          </h1>
          <p className="text-warm-gray text-lg max-w-md mx-auto mb-10">
            Answer a few questions and discover which element guides your style.
          </p>
          <div className="inline-block px-6 py-3 border border-tan rounded text-warm-gray text-sm">
            Coming soon
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
