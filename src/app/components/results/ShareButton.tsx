"use client";

import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may be blocked; silently degrade
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="px-6 py-2.5 border border-gold text-gold text-sm tracking-wide rounded hover:bg-gold hover:text-white transition-colors"
    >
      {copied ? "Copied!" : "Share Your Results"}
    </button>
  );
}
