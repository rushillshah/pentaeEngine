import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";

export const metadata = {
  title: "Shop | Pentae",
  description: "Browse our collection of element-themed fine jewelry.",
};

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-2">
            Shop All
          </h1>
          <p className="text-warm-gray mb-10">
            Demi-fine pieces designed for real life.
          </p>
          <ProductGrid />
        </section>
      </main>
      <Footer />
    </>
  );
}
