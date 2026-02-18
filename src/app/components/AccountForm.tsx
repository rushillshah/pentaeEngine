"use client";

import { useEffect, useState } from "react";

interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  shipping_address_line1: string | null;
  shipping_address_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
}

const FIELD_LABELS: Record<string, string> = {
  first_name: "First Name",
  last_name: "Last Name",
  email: "Email",
  phone: "Phone",
  shipping_address_line1: "Address Line 1",
  shipping_address_line2: "Address Line 2",
  shipping_city: "City",
  shipping_state: "State",
  shipping_postal_code: "Postal Code",
  shipping_country: "Country",
};

export default function AccountForm() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load current user from session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const body: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      body[key] = value as string;
    }

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error();

      const updated = await res.json();
      setUser(updated);
      setMessage({ type: "success", text: "Settings saved." });
    } catch {
      setMessage({ type: "error", text: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-3 bg-tan/50 rounded w-24 mb-2" />
            <div className="h-10 bg-tan/30 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!user) {
    return <p className="text-warm-gray">Could not load account details.</p>;
  }

  const personalFields = ["first_name", "last_name", "email", "phone"] as const;
  const shippingFields = [
    "shipping_address_line1",
    "shipping_address_line2",
    "shipping_city",
    "shipping_state",
    "shipping_postal_code",
    "shipping_country",
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Personal Details */}
      <fieldset>
        <legend className="font-serif text-xl text-charcoal mb-4">
          Personal Details
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {personalFields.map((field) => (
            <label key={field} className="block">
              <span className="text-sm text-warm-gray">{FIELD_LABELS[field]}</span>
              <input
                name={field}
                type={field === "email" ? "email" : "text"}
                defaultValue={user[field] ?? ""}
                className="mt-1 w-full px-3 py-2 border border-tan rounded bg-white text-charcoal text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </label>
          ))}
        </div>
      </fieldset>

      {/* Shipping Address */}
      <fieldset>
        <legend className="font-serif text-xl text-charcoal mb-4">
          Shipping Address
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shippingFields.map((field) => (
            <label
              key={field}
              className={
                field === "shipping_address_line1" || field === "shipping_address_line2"
                  ? "block sm:col-span-2"
                  : "block"
              }
            >
              <span className="text-sm text-warm-gray">{FIELD_LABELS[field]}</span>
              <input
                name={field}
                type="text"
                defaultValue={user[field] ?? ""}
                className="mt-1 w-full px-3 py-2 border border-tan rounded bg-white text-charcoal text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </label>
          ))}
        </div>
      </fieldset>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-gold text-white text-sm tracking-wide rounded hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {message && (
          <span
            className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-500"}`}
          >
            {message.text}
          </span>
        )}
      </div>
    </form>
  );
}
