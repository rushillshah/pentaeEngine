"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-cream-dark border-y border-tan">
      <div className="max-w-xl mx-auto px-6 py-16 md:py-20 text-center">
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-3">
          Get early access to drops
        </h2>
        <p className="text-warm-gray text-sm mb-8">
          + private pricing, style tips & restocks — straight to your inbox.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 bg-cream border border-tan rounded text-sm text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:border-gold transition-colors"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-gold text-white text-sm tracking-wide rounded hover:bg-gold-light transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
