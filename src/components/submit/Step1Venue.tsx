interface Step1VenueProps {
  venueName: string;
  subVenueName: string;
  onVenueNameChange: (v: string) => void;
  onSubVenueNameChange: (v: string) => void;
  onNext: () => void;
}

export function Step1Venue({
  venueName,
  subVenueName,
  onVenueNameChange,
  onSubVenueNameChange,
  onNext,
}: Step1VenueProps) {
  const isValid = venueName.trim().length >= 2;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[length:var(--font-size-large)] font-bold text-primary">
          Venue Details
        </h2>
        <p className="text-[length:var(--font-size-x-small)] text-contrast-medium mt-1">
          Tell us about the masjid or venue hosting Taraweeh
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[length:var(--font-size-small)] font-semibold text-primary mb-1.5">
            Venue Name <span className="text-notification-error">*</span>
          </label>
          <input
            type="text"
            value={venueName}
            onChange={(e) => onVenueNameChange(e.target.value)}
            placeholder="e.g. Nurul Islam Masjid"
            maxLength={100}
            className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-background-surface border border-contrast-low text-primary text-[length:var(--font-size-small)] placeholder:text-contrast-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <label className="block text-[length:var(--font-size-small)] font-semibold text-primary mb-1.5">
            Sub-venue / Room
          </label>
          <input
            type="text"
            value={subVenueName}
            onChange={(e) => onSubVenueNameChange(e.target.value)}
            placeholder="e.g. Main Hall, Classroom B"
            className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-background-surface border border-contrast-low text-primary text-[length:var(--font-size-small)] placeholder:text-contrast-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-colors"
          />
          <p className="text-[length:var(--font-size-xx-small)] text-contrast-medium mt-1">
            Leave blank if not applicable
          </p>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className="w-full py-3 rounded-[var(--radius-md)] bg-teal-600 text-white text-[length:var(--font-size-small)] font-semibold hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
}
