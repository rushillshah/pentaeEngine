"use client";

import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function SignInForm() {
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign in failed.");
        return;
      }

      await refresh();
      window.location.href = "/";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      <label className="block">
        <span className="text-sm text-warm-gray">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-tan rounded bg-white text-charcoal text-sm focus:outline-none focus:border-gold transition-colors"
          placeholder="you@example.com"
        />
      </label>

      <label className="block">
        <span className="text-sm text-warm-gray">Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-tan rounded bg-white text-charcoal text-sm focus:outline-none focus:border-gold transition-colors"
          placeholder="••••••••"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-gold text-white text-sm tracking-wide rounded hover:bg-gold-light transition-colors disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
