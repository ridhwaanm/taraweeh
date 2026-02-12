interface ReviewData {
  venueName: string;
  subVenueName: string;
  addressFull: string;
  city: string;
  province: string;
  latitude: string;
  longitude: string;
  juzPerNight: string;
  readerNames: string;
  whatsappNumber: string;
}

interface Step5ReviewProps {
  data: ReviewData;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  error: string | null;
}

function ReviewSection({
  title,
  step,
  onEdit,
  children,
}: {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-contrast-low rounded-[var(--radius-md)] p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[length:var(--font-size-small)] font-semibold text-primary">
          {title}
        </h3>
        <button
          onClick={() => onEdit(step)}
          className="text-[length:var(--font-size-xx-small)] text-teal-600 font-semibold hover:underline"
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-1">
      <span className="text-[length:var(--font-size-x-small)] text-contrast-medium shrink-0">
        {label}
      </span>
      <span className="text-[length:var(--font-size-x-small)] text-primary text-right">
        {value}
      </span>
    </div>
  );
}

const JUZ_LABELS: Record<string, string> = {
  "0.25": "¼ Juz",
  "0.5": "½ Juz",
  "1": "1 Juz",
  "1.5": "1½ Juz",
  "2": "2 Juz",
  "3": "3 Juz",
};

export function Step5Review({
  data,
  onEdit,
  onSubmit,
  onBack,
  submitting,
  error,
}: Step5ReviewProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[length:var(--font-size-large)] font-bold text-primary">
          Review & Submit
        </h2>
        <p className="text-[length:var(--font-size-x-small)] text-contrast-medium mt-1">
          Please confirm your details before submitting
        </p>
      </div>

      <div className="space-y-3">
        <ReviewSection title="Venue" step={1} onEdit={onEdit}>
          <ReviewRow label="Name" value={data.venueName} />
          <ReviewRow label="Sub-venue" value={data.subVenueName} />
        </ReviewSection>

        <ReviewSection title="Location" step={2} onEdit={onEdit}>
          <ReviewRow label="Address" value={data.addressFull} />
          <ReviewRow label="City" value={data.city} />
          <ReviewRow label="Province" value={data.province} />
          <ReviewRow
            label="Coordinates"
            value={`${data.latitude}, ${data.longitude}`}
          />
        </ReviewSection>

        <ReviewSection title="Programme" step={3} onEdit={onEdit}>
          <ReviewRow
            label="Juz/night"
            value={
              data.juzPerNight
                ? JUZ_LABELS[data.juzPerNight] || `${data.juzPerNight} Juz`
                : ""
            }
          />
          <ReviewRow label="Readers" value={data.readerNames} />
          {!data.juzPerNight && !data.readerNames && (
            <p className="text-[length:var(--font-size-x-small)] text-contrast-medium italic">
              No programme details provided
            </p>
          )}
        </ReviewSection>

        <ReviewSection title="Contact" step={4} onEdit={onEdit}>
          <ReviewRow label="WhatsApp" value={data.whatsappNumber} />
        </ReviewSection>
      </div>

      {error && (
        <div className="p-3 rounded-[var(--radius-md)] bg-notification-error-soft text-notification-error text-[length:var(--font-size-x-small)] font-semibold">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={submitting}
          className="px-6 py-3 rounded-[var(--radius-md)] border border-contrast-low text-primary text-[length:var(--font-size-small)] font-semibold hover:bg-background-surface transition-colors disabled:opacity-40"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 py-3 rounded-[var(--radius-md)] bg-teal-600 text-white text-[length:var(--font-size-small)] font-semibold hover:bg-teal-700 disabled:opacity-70 transition-colors"
        >
          {submitting ? "Submitting..." : "Submit Venue"}
        </button>
      </div>
    </div>
  );
}
