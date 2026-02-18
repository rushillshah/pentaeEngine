"use client";

import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function SignUpForm() {
  const { refresh } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign up failed.");
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

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm text-warm-gray">First Name</span>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-tan rounded bg-white text-charcoal text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </label>
        <label className="block">
          <span className="text-sm text-warm-gray">Last Name</span>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-tan rounded bg-white text-charcoal text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </label>
      </div>

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
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-tan rounded bg-white text-charcoal text-sm focus:outline-none focus:border-gold transition-colors"
          placeholder="At least 6 characters"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-gold text-white text-sm tracking-wide rounded hover:bg-gold-light transition-colors disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
