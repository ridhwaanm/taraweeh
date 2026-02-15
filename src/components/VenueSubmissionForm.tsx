import { useState } from "react";
import { StepIndicator } from "./submit/StepIndicator";
import { Step1Venue } from "./submit/Step1Venue";
import { Step2Location } from "./submit/Step2Location";
import { Step3Programme } from "./submit/Step3Programme";
import { Step4Contact } from "./submit/Step4Contact";
import { Step5Review } from "./submit/Step5Review";
import { SubmissionSuccess } from "./submit/SubmissionSuccess";

export default function VenueSubmissionForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Step 1
  const [venueName, setVenueName] = useState("");
  const [subVenueName, setSubVenueName] = useState("");

  // Step 2
  const [location, setLocation] = useState({
    addressFull: "",
    city: "",
    province: "",
    latitude: "",
    longitude: "",
    googlePlaceId: "",
  });

  // Step 3
  const [juzPerNight, setJuzPerNight] = useState("");
  const [readerNames, setReaderNames] = useState("");

  // Step 4
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const goTo = (s: number) => {
    setSubmitError(null);
    setStep(s);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/submissions/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venue_name: venueName.trim(),
          sub_venue_name: subVenueName.trim() || undefined,
          address_full: location.addressFull.trim(),
          city: location.city.trim(),
          province: location.province.trim() || undefined,
          latitude: Number(location.latitude),
          longitude: Number(location.longitude),
          google_place_id: location.googlePlaceId || undefined,
          juz_per_night: juzPerNight ? Number(juzPerNight) : undefined,
          reader_names: readerNames.trim() || undefined,
          whatsapp_number: whatsappNumber.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError(
        "Network error. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4">
        <SubmissionSuccess />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4">
      <StepIndicator currentStep={step} />

      {step === 1 && (
        <Step1Venue
          venueName={venueName}
          subVenueName={subVenueName}
          onVenueNameChange={setVenueName}
          onSubVenueNameChange={setSubVenueName}
          onNext={() => goTo(2)}
        />
      )}

      {step === 2 && (
        <Step2Location
          data={location}
          onChange={setLocation}
          onNext={() => goTo(3)}
          onBack={() => goTo(1)}
        />
      )}

      {step === 3 && (
        <Step3Programme
          juzPerNight={juzPerNight}
          readerNames={readerNames}
          onJuzPerNightChange={setJuzPerNight}
          onReaderNamesChange={setReaderNames}
          onNext={() => goTo(4)}
          onBack={() => goTo(2)}
          onSkip={() => goTo(4)}
        />
      )}

      {step === 4 && (
        <Step4Contact
          whatsappNumber={whatsappNumber}
          onWhatsappNumberChange={setWhatsappNumber}
          onNext={() => goTo(5)}
          onBack={() => goTo(3)}
        />
      )}

      {step === 5 && (
        <Step5Review
          data={{
            venueName,
            subVenueName,
            addressFull: location.addressFull,
            city: location.city,
            province: location.province,
            latitude: location.latitude,
            longitude: location.longitude,
            juzPerNight,
            readerNames,
            whatsappNumber,
          }}
          onEdit={goTo}
          onSubmit={handleSubmit}
          onBack={() => goTo(4)}
          submitting={submitting}
          error={submitError}
        />
      )}
    </div>
  );
}
