interface Step4ContactProps {
  whatsappNumber: string;
  onWhatsappNumberChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step4Contact({
  whatsappNumber,
  onWhatsappNumberChange,
  onNext,
  onBack,
}: Step4ContactProps) {
  const cleanNumber = whatsappNumber.replace(/[\s\-()]/g, "");
  const isValid = !cleanNumber || /^\+?\d{10,15}$/.test(cleanNumber);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[length:var(--font-size-large)] font-bold text-primary">
          Contact Details
        </h2>
        <p className="text-[length:var(--font-size-x-small)] text-contrast-medium mt-1">
          Optionally provide a WhatsApp number so we can verify your submission
        </p>
      </div>

      <div>
        <label className="block text-[length:var(--font-size-small)] font-semibold text-primary mb-1.5">
          WhatsApp Number
        </label>
        <input
          type="tel"
          value={whatsappNumber}
          onChange={(e) => onWhatsappNumberChange(e.target.value)}
          placeholder="+27 82 123 4567"
          className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-background-surface border border-contrast-low text-primary text-[length:var(--font-size-small)] placeholder:text-contrast-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-colors"
        />
        <p className="text-[length:var(--font-size-xx-small)] text-contrast-medium mt-1.5">
          For admin verification only — this will not be published
        </p>
      </div>

      {/* Honeypot */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
      >
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-[var(--radius-md)] border border-contrast-low text-primary text-[length:var(--font-size-small)] font-semibold hover:bg-background-surface transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 py-3 rounded-[var(--radius-md)] bg-teal-600 text-white text-[length:var(--font-size-small)] font-semibold hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Review
        </button>
      </div>
    </div>
  );
}
