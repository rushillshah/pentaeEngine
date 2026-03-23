"use client";

import { useState } from "react";

export interface PersonalDetails {
  fullName: string;
  dob: string;
  birthHour: number;
  birthMinute: number;
  birthLat: number;
  birthLng: number;
}

interface QuizPersonalDetailsProps {
  details: PersonalDetails;
  onChange: (d: PersonalDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

const INPUT_CLASS =
  "mt-1 w-full px-3 py-2 border border-tan rounded bg-white text-charcoal text-sm focus:outline-none focus:border-gold transition-colors";

const SELECT_CLASS =
  "mt-1 w-full px-3 py-2 border border-tan rounded bg-white text-charcoal text-sm focus:outline-none focus:border-gold transition-colors appearance-none";

function formatHourLabel(h: number): string {
  if (h === 0) return "0 (12 AM)";
  if (h < 12) return `${h} (${h} AM)`;
  if (h === 12) return "12 (12 PM)";
  return `${h} (${h - 12} PM)`;
}

export default function QuizPersonalDetails({
  details,
  onChange,
  onNext,
  onBack,
}: QuizPersonalDetailsProps) {
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  function update(field: keyof PersonalDetails, value: string | number) {
    return { ...details, [field]: value };
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setGeoError(null);
    setGeoLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(4));
        const lng = parseFloat(position.coords.longitude.toFixed(4));
        onChange({ ...details, birthLat: lat, birthLng: lng });
        setGeoLoading(false);
      },
      (err) => {
        const messages: Record<number, string> = {
          1: "Location access was denied. Please enter coordinates manually.",
          2: "Unable to determine your location. Please enter coordinates manually.",
          3: "Location request timed out. Please try again or enter manually.",
        };
        setGeoError(messages[err.code] || "Failed to get location.");
        setGeoLoading(false);
      },
      { timeout: 10000 }
    );
  }

  const isValid =
    details.fullName.trim() !== "" &&
    details.dob !== "" &&
    details.birthHour >= 0 &&
    details.birthHour <= 23 &&
    details.birthMinute >= 0 &&
    details.birthMinute <= 59 &&
    details.birthLat >= -90 &&
    details.birthLat <= 90 &&
    details.birthLng >= -180 &&
    details.birthLng <= 180;

  return (
    <div className="space-y-5 animate-fade-in-up">
      <h2 className="font-serif text-2xl text-charcoal mb-2">
        Personal Details
      </h2>
      <p className="text-sm text-warm-gray mb-6">
        We use your birth information to calculate your elemental profile.
      </p>

      <label className="block">
        <span className="text-sm text-warm-gray">Full Name</span>
        <input
          type="text"
          required
          value={details.fullName}
          onChange={(e) => onChange(update("fullName", e.target.value))}
          className={INPUT_CLASS}
          placeholder="Your full name"
        />
      </label>

      <label className="block">
        <span className="text-sm text-warm-gray">Date of Birth</span>
        <input
          type="date"
          required
          value={details.dob}
          onChange={(e) => onChange(update("dob", e.target.value))}
          className={INPUT_CLASS}
        />
      </label>

      <div>
        <span className="text-sm text-warm-gray">Birth Time</span>
        <div className="grid grid-cols-2 gap-3 mt-1">
          <label className="block">
            <span className="text-xs text-warm-gray">Hour</span>
            <select
              value={details.birthHour}
              onChange={(e) =>
                onChange(update("birthHour", parseInt(e.target.value, 10)))
              }
              className={SELECT_CLASS}
            >
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={h}>
                  {formatHourLabel(h)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-warm-gray">Minute</span>
            <select
              value={details.birthMinute}
              onChange={(e) =>
                onChange(update("birthMinute", parseInt(e.target.value, 10)))
              }
              className={SELECT_CLASS}
            >
              {Array.from({ length: 60 }, (_, m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, "0")}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-warm-gray">Birth Location</span>
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={geoLoading}
            className="text-xs text-gold hover:text-gold-light transition-colors disabled:opacity-50"
          >
            {geoLoading ? "Locating..." : "Use my location"}
          </button>
        </div>
        {geoError && (
          <p className="text-xs text-red-500 mt-1">{geoError}</p>
        )}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <label className="block">
            <span className="text-xs text-warm-gray">Latitude (-90 to 90)</span>
            <input
              type="number"
              required
              step="any"
              min={-90}
              max={90}
              value={details.birthLat}
              onChange={(e) =>
                onChange(
                  update("birthLat", parseFloat(e.target.value) || 0)
                )
              }
              className={INPUT_CLASS}
            />
          </label>
          <label className="block">
            <span className="text-xs text-warm-gray">
              Longitude (-180 to 180)
            </span>
            <input
              type="number"
              required
              step="any"
              min={-180}
              max={180}
              value={details.birthLng}
              onChange={(e) =>
                onChange(
                  update("birthLng", parseFloat(e.target.value) || 0)
                )
              }
              className={INPUT_CLASS}
            />
          </label>
        </div>
        <p className="text-xs text-warm-gray mt-1.5">
          Used for your astrological birth chart calculation
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-2.5 border border-tan text-charcoal text-sm tracking-wide rounded hover:border-gold transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="px-6 py-2.5 bg-gold text-white text-sm tracking-wide rounded hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
