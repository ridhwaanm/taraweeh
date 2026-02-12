const STEP_LABELS = ["Venue", "Location", "Programme", "Contact", "Review"];

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export function StepIndicator({
  currentStep,
  totalSteps = 5,
}: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2 mb-6">
      <div className="flex items-center gap-0">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isComplete = step < currentStep;
          const isCurrent = step === currentStep;
          return (
            <div key={step} className="flex items-center">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  isComplete
                    ? "bg-teal-600"
                    : isCurrent
                      ? "ring-2 ring-teal-600 bg-teal-600"
                      : "bg-contrast-low"
                }`}
              />
              {step < totalSteps && (
                <div
                  className={`w-8 h-0.5 transition-colors ${
                    isComplete ? "bg-teal-600" : "bg-contrast-low"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <span className="text-[length:var(--font-size-x-small)] text-contrast-medium font-semibold">
        {STEP_LABELS[currentStep - 1]}
      </span>
    </div>
  );
}
