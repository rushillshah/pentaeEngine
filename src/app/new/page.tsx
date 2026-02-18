import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "New Arrivals | Pentae",
  description: "The latest additions to our element-inspired collection.",
};

export default function NewArrivalsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
            New Arrivals
          </h1>
          <p className="text-warm-gray text-lg max-w-md mx-auto mb-10">
            The latest additions to our element-inspired collection.
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
