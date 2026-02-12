export function SubmissionSuccess() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-notification-success-soft flex items-center justify-center mx-auto mb-5">
        <svg
          className="w-8 h-8 text-notification-success"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-[length:var(--font-size-x-large)] font-bold text-primary mb-2">
        JazakAllah Khayran
      </h2>
      <p className="text-[length:var(--font-size-small)] text-contrast-medium mb-1">
        Your venue submission has been received.
      </p>
      <p className="text-[length:var(--font-size-x-small)] text-contrast-medium mb-8">
        Our team will review and verify your submission within 24–48 hours.
      </p>

      <a
        href="/"
        className="inline-block px-6 py-3 rounded-[var(--radius-md)] bg-teal-600 text-white text-[length:var(--font-size-small)] font-semibold hover:bg-teal-700 transition-colors"
      >
        Back to Home
      </a>
    </div>
  );
}
