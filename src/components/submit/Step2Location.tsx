import { useEffect, useRef, useState } from "react";

interface LocationData {
  addressFull: string;
  city: string;
  province: string;
  latitude: string;
  longitude: string;
  googlePlaceId: string;
}

const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
];

interface Suggestion {
  placeId: string;
  text: string;
  description: string;
  secondaryText: string;
}

interface Step2LocationProps {
  data: LocationData;
  onChange: (data: LocationData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Location({
  data,
  onChange,
  onNext,
  onBack,
}: Step2LocationProps) {
  const [query, setQuery] = useState(data.addressFull);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [filled, setFilled] = useState(data.addressFull !== "");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const searchPlaces = async (input: string) => {
    if (input.trim().length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/places/autocomplete?input=${encodeURIComponent(input)}`,
      );
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setShowDropdown((data.suggestions || []).length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setFilled(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPlaces(value), 300);
  };

  const selectSuggestion = async (suggestion: Suggestion) => {
    setShowDropdown(false);
    setQuery(suggestion.text);
    setLoading(true);

    try {
      const res = await fetch(
        `/api/places/details?placeId=${encodeURIComponent(suggestion.placeId)}`,
      );
      const details = await res.json();

      if (details.error) {
        console.error("Place details error:", details.error);
        return;
      }

      onChange({
        addressFull: details.addressFull || suggestion.text,
        city: details.city || "",
        province: details.province || "",
        latitude: details.latitude != null ? String(details.latitude) : "",
        longitude: details.longitude != null ? String(details.longitude) : "",
        googlePlaceId: details.placeId || suggestion.placeId,
      });
      setFilled(true);
    } catch (err) {
      console.error("Failed to fetch place details:", err);
    } finally {
      setLoading(false);
    }
  };

  const update = (field: keyof LocationData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const isValid =
    data.addressFull.trim() !== "" &&
    data.city.trim() !== "" &&
    data.province.trim() !== "" &&
    Number.isFinite(Number(data.latitude)) &&
    Number.isFinite(Number(data.longitude)) &&
    data.latitude !== "" &&
    data.longitude !== "";

  const inputClasses =
    "w-full px-4 py-3 rounded-[var(--radius-md)] bg-background-surface border border-contrast-low text-primary text-[length:var(--font-size-small)] placeholder:text-contrast-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-colors";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[length:var(--font-size-large)] font-bold text-primary">
          Location
        </h2>
        <p className="text-[length:var(--font-size-x-small)] text-contrast-medium mt-1">
          {manualMode
            ? "Enter the venue address and details manually"
            : "Search for the venue — city, province and coordinates will be filled automatically"}
        </p>
      </div>

      <div className="space-y-4">
        {manualMode ? (
          <>
            {/* Manual: Address */}
            <div>
              <label className="block text-[length:var(--font-size-small)] font-semibold text-primary mb-1.5">
                Address <span className="text-notification-error">*</span>
              </label>
              <textarea
                value={data.addressFull}
                onChange={(e) => update("addressFull", e.target.value)}
                placeholder="Enter the full address"
                rows={2}
                className={inputClasses + " resize-none"}
              />
            </div>

            {/* Manual: City */}
            <div>
              <label className="block text-[length:var(--font-size-small)] font-semibold text-primary mb-1.5">
                City <span className="text-notification-error">*</span>
              </label>
              <input
                type="text"
                value={data.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="e.g. Cape Town"
                className={inputClasses}
              />
            </div>

            {/* Manual: Province */}
            <div>
              <label className="block text-[length:var(--font-size-small)] font-semibold text-primary mb-1.5">
                Province <span className="text-notification-error">*</span>
              </label>
              <select
                value={data.province}
                onChange={(e) => update("province", e.target.value)}
                className={inputClasses}
              >
                <option value="">Select a province</option>
                {SA_PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Manual: Lat/Lng */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[length:var(--font-size-small)] font-semibold text-primary mb-1.5">
                  Latitude <span className="text-notification-error">*</span>
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={data.latitude}
                  onChange={(e) => update("latitude", e.target.value)}
                  placeholder="-33.925"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-[length:var(--font-size-small)] font-semibold text-primary mb-1.5">
                  Longitude <span className="text-notification-error">*</span>
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={data.longitude}
                  onChange={(e) => update("longitude", e.target.value)}
                  placeholder="18.424"
                  className={inputClasses}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Autocomplete search */}
            <div>
              <label className="block text-[length:var(--font-size-small)] font-semibold text-primary mb-1.5">
                Search Address{" "}
                <span className="text-notification-error">*</span>
              </label>
              <div ref={wrapperRef} className="relative">
                <div className="relative">
                  <svg
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-contrast-medium pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() =>
                      suggestions.length > 0 && setShowDropdown(true)
                    }
                    placeholder="Type a venue name or address..."
                    className="w-full pl-10 pr-10 py-3 rounded-[var(--radius-md)] bg-background-surface border-2 border-teal-600/40 text-primary text-[length:var(--font-size-small)] placeholder:text-contrast-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-colors"
                  />
                  {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-contrast-low border-t-teal-600 rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                {showDropdown && suggestions.length > 0 && (
                  <ul className="absolute z-50 w-full mt-1 bg-background-surface border border-contrast-low rounded-[var(--radius-md)] shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                    {suggestions.map((s) => (
                      <li key={s.placeId}>
                        <button
                          type="button"
                          onClick={() => selectSuggestion(s)}
                          className="w-full text-left px-4 py-3 hover:bg-background-base transition-colors"
                        >
                          <span className="block text-[length:var(--font-size-small)] text-primary font-semibold">
                            {s.description}
                          </span>
                          {s.secondaryText && (
                            <span className="block text-[length:var(--font-size-xx-small)] text-contrast-medium mt-0.5">
                              {s.secondaryText}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Auto-populated fields */}
            {filled ? (
              <div className="space-y-3 rounded-[var(--radius-md)] border border-contrast-low bg-background-surface p-4">
                <p className="text-[length:var(--font-size-xx-small)] text-contrast-medium font-semibold uppercase tracking-wider">
                  Filled from search — edit if needed
                </p>

                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
                  <span className="text-[length:var(--font-size-x-small)] text-contrast-medium">
                    Address
                  </span>
                  <input
                    type="text"
                    value={data.addressFull}
                    onChange={(e) => update("addressFull", e.target.value)}
                    className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-background-base border border-contrast-low text-primary text-[length:var(--font-size-x-small)] focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />

                  <span className="text-[length:var(--font-size-x-small)] text-contrast-medium">
                    City
                  </span>
                  <input
                    type="text"
                    value={data.city}
                    onChange={(e) => update("city", e.target.value)}
                    className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-background-base border border-contrast-low text-primary text-[length:var(--font-size-x-small)] focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />

                  <span className="text-[length:var(--font-size-x-small)] text-contrast-medium">
                    Province
                  </span>
                  <select
                    value={data.province}
                    onChange={(e) => update("province", e.target.value)}
                    className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-background-base border border-contrast-low text-primary text-[length:var(--font-size-x-small)] focus:outline-none focus:ring-1 focus:ring-teal-600"
                  >
                    <option value="">Select a province</option>
                    {SA_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>

                  <span className="text-[length:var(--font-size-x-small)] text-contrast-medium">
                    Coords
                  </span>
                  <span className="text-[length:var(--font-size-x-small)] text-primary px-3 py-1.5">
                    {Number(data.latitude).toFixed(4)},{" "}
                    {Number(data.longitude).toFixed(4)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-[length:var(--font-size-xx-small)] text-contrast-medium italic">
                Select an address above to auto-fill city, province and
                coordinates
              </p>
            )}
          </>
        )}

        <button
          type="button"
          onClick={() => setManualMode(!manualMode)}
          className="text-[length:var(--font-size-xx-small)] text-teal-600 font-semibold hover:underline"
        >
          {manualMode
            ? "Use address search instead"
            : "Can't find your address? Enter manually"}
        </button>
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
          Next
        </button>
      </div>
    </div>
  );
}
