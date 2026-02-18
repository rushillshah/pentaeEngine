import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Materials | Pentae",
  description: "Gold vermeil, solid gold, and ethically sourced stones — learn about what goes into every piece.",
};

export default function MaterialsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
            Materials
          </h1>
          <p className="text-warm-gray text-lg max-w-md mx-auto mb-10">
            Gold vermeil, solid gold, and ethically sourced stones — learn about
            what goes into every piece.
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
