import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const pages: Record<string, { title: string; description: string }> = {
  sizing: {
    title: "Sizing Guide",
    description: "Find your perfect fit with our ring, bracelet, and necklace sizing charts.",
  },
  shipping: {
    title: "Shipping & Returns",
    description: "Free shipping on orders over AED 500. Easy 30-day returns on all unworn pieces.",
  },
  care: {
    title: "Care Guide",
    description: "Keep your pieces looking their best with our simple care instructions.",
  },
  faq: {
    title: "FAQ",
    description: "Answers to the most common questions about our jewelry, orders, and policies.",
  },
  contact: {
    title: "Contact Us",
    description: "Have a question? Reach out to our team — we'd love to hear from you.",
  },
  privacy: {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information.",
  },
  terms: {
    title: "Terms of Service",
    description: "The terms and conditions that govern your use of Pentae.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];
  return {
    title: page ? `${page.title} | Pentae` : "Help | Pentae",
    description: page?.description ?? "",
  };
}

export default async function HelpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug] ?? { title: "Help", description: "This page is on its way." };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
            {page.title}
          </h1>
          <p className="text-warm-gray text-lg max-w-md mx-auto mb-10">
            {page.description}
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
