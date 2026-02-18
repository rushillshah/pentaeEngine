import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Best Sellers | Pentae",
  description: "Our most loved pieces — the ones you keep coming back for.",
};

export default function BestSellersPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
            Best Sellers
          </h1>
          <p className="text-warm-gray text-lg max-w-md mx-auto mb-10">
            Our most loved pieces — the ones you keep coming back for.
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
