import { useState } from "react";

const JUZ_OPTIONS = [
  { label: "¼ Juz", value: "0.25" },
  { label: "½ Juz", value: "0.5" },
  { label: "1 Juz", value: "1" },
  { label: "1½ Juz", value: "1.5" },
  { label: "2 Juz", value: "2" },
  { label: "3 Juz", value: "3" },
  { label: "Other", value: "other" },
];

interface Step3ProgrammeProps {
  juzPerNight: string;
  readerNames: string;
  onJuzPerNightChange: (v: string) => void;
  onReaderNamesChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function Step3Programme({
  juzPerNight,
  readerNames,
  onJuzPerNightChange,
  onReaderNamesChange,
  onNext,
  onBack,
  onSkip,
}: Step3ProgrammeProps) {
  const [showCustomJuz, setShowCustomJuz] = useState(
    juzPerNight !== "" && !JUZ_OPTIONS.some((o) => o.value === juzPerNight),
  );

  const handleJuzSelect = (value: string) => {
    if (value === "other") {
      setShowCustomJuz(true);
      onJuzPerNightChange("");
    } else {
      setShowCustomJuz(false);
      onJuzPerNightChange(value);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[length:var(--font-size-large)] font-bold text-primary">
          Programme Details
        </h2>
        <p className="text-[length:var(--font-size-x-small)] text-contrast-medium mt-1">
          Optional — you can skip this step
        </p>
      </div>

      <div className="space-y-4">
        {/* Juz per night */}
        <div>
          <label className="block text-[length:var(--font-size-small)] font-semibold text-primary mb-2">
            Juz per night
          </label>
          <div className="flex flex-wrap gap-2">
            {JUZ_OPTIONS.map((option) => {
              const isActive =
                option.value === "other"
                  ? showCustomJuz
                  : juzPerNight === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleJuzSelect(option.value)}
                  className={`px-3.5 py-2 rounded-full text-[length:var(--font-size-x-small)] font-semibold transition-colors ${
                    isActive
                      ? "bg-teal-600 text-white"
                      : "bg-background-surface text-contrast-medium hover:text-primary border border-contrast-low"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {showCustomJuz && (
            <input
              type="number"
              step="0.25"
              min="0.25"
              max="10"
              value={juzPerNight}
              onChange={(e) => onJuzPerNightChange(e.target.value)}
              placeholder="Enter juz per night"
              className="mt-2 w-full px-4 py-3 rounded-[var(--radius-md)] bg-background-surface border border-contrast-low text-primary text-[length:var(--font-size-small)] placeholder:text-contrast-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-colors"
            />
          )}
        </div>

        {/* Reader names */}
        <div>
          <label className="block text-[length:var(--font-size-small)] font-semibold text-primary mb-1.5">
            Names of Huffadh / Qaris
          </label>
          <textarea
            value={readerNames}
            onChange={(e) => onReaderNamesChange(e.target.value)}
            placeholder="e.g. Hafidh Ahmad, Qari Yusuf, Sheikh Abdullah"
            maxLength={500}
            rows={3}
            className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-background-surface border border-contrast-low text-primary text-[length:var(--font-size-small)] placeholder:text-contrast-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-colors resize-none"
          />
          <p className="text-[length:var(--font-size-xx-small)] text-contrast-medium mt-1">
            Separate names with commas
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-[var(--radius-md)] border border-contrast-low text-primary text-[length:var(--font-size-small)] font-semibold hover:bg-background-surface transition-colors"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-3 rounded-[var(--radius-md)] bg-teal-600 text-white text-[length:var(--font-size-small)] font-semibold hover:bg-teal-700 transition-colors"
          >
            Next
          </button>
        </div>
        <button
          onClick={onSkip}
          className="w-full py-2 text-[length:var(--font-size-x-small)] text-contrast-medium font-semibold hover:text-primary transition-colors"
        >
          Skip this step
        </button>
      </div>
    </div>
  );
}
