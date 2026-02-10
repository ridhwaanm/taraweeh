import { useState } from "react";
import type { RecordingWithDetails } from "../lib/db";
import { RecordingCard } from "./RecordingCard";

interface RecordingsPlayerProps {
  recordings: RecordingWithDetails[];
  huffadh: string[];
  venues: string[];
  cities: string[];
  years: number[];
}

export default function RecordingsPlayer({
  recordings,
  huffadh,
  venues,
  cities,
  years,
}: RecordingsPlayerProps) {
  const [selectedHafidh, setSelectedHafidh] = useState<string>("");
  const [selectedVenue, setSelectedVenue] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedMediaType, setSelectedMediaType] = useState<string>("All");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);
  const [hafidhSearch, setHafidhSearch] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);
  const [currentRecording, setCurrentRecording] =
    useState<RecordingWithDetails | null>(null);

  const filteredHuffadh = huffadh.filter((hafidh) =>
    hafidh.toLowerCase().includes(hafidhSearch.toLowerCase()),
  );

  const filteredRecordings = recordings.filter((recording) => {
    if (selectedHafidh && recording.hafidh_name !== selectedHafidh)
      return false;
    if (selectedVenue !== "All" && recording.venue_name !== selectedVenue)
      return false;
    if (selectedCity !== "All" && recording.city !== selectedCity) return false;
    if (
      selectedYear !== "All" &&
      recording.hijri_year.toString() !== selectedYear
    )
      return false;
    if (
      selectedMediaType !== "All" &&
      recording.source.toLowerCase() !== selectedMediaType.toLowerCase()
    )
      return false;
    return true;
  });

  const getYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
      /youtube\.com\/shorts\/([^&\s]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const playRecording = (recording: RecordingWithDetails) => {
    setCurrentRecording(recording);
  };

  const closePlayer = () => {
    setCurrentRecording(null);
  };

  return (
    <div className="min-h-screen bg-background-base pb-32 dark:bg-[#0e0e12]">
      {/* Header */}
      <div className="relative md:sticky top-0 z-20 bg-background-surface border-b border-contrast-low dark:bg-[#292934] dark:border-[#404044]">
        {/* Mobile Header */}
        <div className="md:hidden px-[var(--spacing-static-md)] py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Taraweeh" className="h-10 w-10" />
              <span className="text-[length:var(--font-size-large)] font-bold text-primary dark:text-[#fbfcff]">
                Taraweeh
              </span>
            </div>
            <button
              onClick={() => setShowMobileSearch(true)}
              className="p-2 rounded-[var(--radius-sm)] border border-contrast-low hover:bg-background-shading transition-colors duration-[var(--motion-duration-short)] dark:border-[#404044] dark:hover:bg-[#404044]"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5 text-primary dark:text-[#fbfcff]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block max-w-7xl mx-auto px-[var(--spacing-static-md)] py-[var(--spacing-static-lg)]">
          <div className="flex items-center gap-[var(--spacing-static-md)] mb-[var(--spacing-static-lg)]">
            <img src="/logo.png" alt="Taraweeh" className="h-16 w-16" />
            <div>
              <h1 className="text-[length:var(--font-size-heading-xx-large)] font-bold text-primary dark:text-[#fbfcff]">
                Taraweeh
              </h1>
              <p className="text-[length:var(--font-size-small)] text-contrast-medium dark:text-[#88898c]">
                مكتبة تسجيلات التراويح &bull; Taraweeh Recordings Directory
              </p>
            </div>
          </div>

          {/* Hafidh Search */}
          <div className="relative max-w-xl">
            <label className="block text-[length:var(--font-size-x-small)] font-semibold text-contrast-high mb-[var(--spacing-static-xs)] dark:text-[#cecfd1]">
              Hafidh
            </label>
            <div className="relative">
              <input
                type="text"
                value={hafidhSearch}
                onChange={(e) => setHafidhSearch(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder={selectedHafidh || "Search for a Hafidh..."}
                className="w-full px-[var(--spacing-static-md)] py-[var(--spacing-static-sm)] bg-background-base border border-contrast-low rounded-[var(--radius-md)] text-primary text-[length:var(--font-size-small)] focus:outline-none focus:ring-2 focus:ring-state-focus focus:border-transparent transition-all duration-[var(--motion-duration-short)] dark:bg-[#0e0e12] dark:border-[#404044] dark:text-[#fbfcff]"
              />

              {showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-background-base border border-contrast-low rounded-[var(--radius-md)] shadow-lg max-h-60 overflow-y-auto dark:bg-[#0e0e12] dark:border-[#404044]">
                  {filteredHuffadh.length > 0 ? (
                    filteredHuffadh.map((hafidh) => (
                      <button
                        key={hafidh}
                        onClick={() => {
                          setSelectedHafidh(hafidh);
                          setHafidhSearch("");
                          setShowSuggestions(false);
                        }}
                        className="w-full px-[var(--spacing-static-md)] py-[var(--spacing-static-sm)] text-left hover:bg-background-surface text-primary transition-colors text-[length:var(--font-size-small)] dark:text-[#fbfcff] dark:hover:bg-[#292934]"
                      >
                        {hafidh}
                      </button>
                    ))
                  ) : (
                    <div className="px-[var(--spacing-static-md)] py-[var(--spacing-static-sm)] text-contrast-medium text-[length:var(--font-size-small)] dark:text-[#88898c]">
                      No huffadh found
                    </div>
                  )}
                </div>
              )}

              {selectedHafidh && (
                <button
                  onClick={() => {
                    setSelectedHafidh("");
                    setHafidhSearch("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-contrast-medium hover:text-primary dark:text-[#88898c] dark:hover:text-[#fbfcff]"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Advanced Search Toggle */}
          <div className="mt-[var(--spacing-static-md)]">
            <button
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="flex items-center gap-2 px-[var(--spacing-static-md)] py-[var(--spacing-static-sm)] border border-contrast-low rounded-[var(--radius-sm)] text-[length:var(--font-size-small)] font-semibold text-contrast-high hover:bg-background-shading transition-all duration-[var(--motion-duration-short)] dark:border-[#404044] dark:text-[#cecfd1] dark:hover:bg-[#404044]"
            >
              <span>Advanced Search</span>
              <svg
                className={`w-4 h-4 transition-transform duration-[var(--motion-duration-short)] ${showAdvancedSearch ? "rotate-180" : ""}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedSearch && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-static-md)] mt-[var(--spacing-static-md)]">
              <FilterSelect
                label="Venue"
                options={["All", ...venues]}
                selected={selectedVenue}
                onChange={setSelectedVenue}
              />
              <FilterSelect
                label="City"
                options={["All", ...cities]}
                selected={selectedCity}
                onChange={setSelectedCity}
              />
              <FilterSelect
                label="Year"
                options={["All", ...years.map(String)]}
                selected={selectedYear}
                onChange={setSelectedYear}
              />
              <FilterSelect
                label="Media Type"
                options={["All", "YouTube", "SoundCloud"]}
                selected={selectedMediaType}
                onChange={setSelectedMediaType}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50">
          <div className="bg-background-surface min-h-screen dark:bg-[#292934]">
            <div className="px-[var(--spacing-static-md)] py-[var(--spacing-static-md)]">
              <div className="flex items-center justify-between mb-[var(--spacing-static-md)]">
                <h2 className="text-[length:var(--font-size-large)] font-bold text-primary dark:text-[#fbfcff]">
                  Search Recordings
                </h2>
                <button
                  onClick={() => setShowMobileSearch(false)}
                  className="p-2 rounded-[var(--radius-sm)] border border-contrast-low hover:bg-background-shading transition-colors dark:border-[#404044] dark:hover:bg-[#404044]"
                  aria-label="Close search"
                >
                  <svg
                    className="w-5 h-5 text-primary dark:text-[#fbfcff]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Hafidh Search */}
              <div className="relative mb-[var(--spacing-static-md)]">
                <label className="block text-[length:var(--font-size-x-small)] font-semibold text-contrast-high mb-[var(--spacing-static-xs)] dark:text-[#cecfd1]">
                  Hafidh
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={hafidhSearch}
                      onChange={(e) => setHafidhSearch(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder={selectedHafidh || "Search for a Hafidh..."}
                      className="w-full px-[var(--spacing-static-md)] py-[var(--spacing-static-sm)] bg-background-base border border-contrast-low rounded-[var(--radius-md)] text-primary text-[length:var(--font-size-small)] focus:outline-none focus:ring-2 focus:ring-state-focus focus:border-transparent transition-all duration-[var(--motion-duration-short)] dark:bg-[#0e0e12] dark:border-[#404044] dark:text-[#fbfcff]"
                      autoFocus
                    />

                    {showSuggestions && (
                      <div className="absolute z-10 w-full mt-1 bg-background-base border border-contrast-low rounded-[var(--radius-md)] shadow-lg max-h-96 overflow-y-auto dark:bg-[#0e0e12] dark:border-[#404044]">
                        {filteredHuffadh.length > 0 ? (
                          filteredHuffadh.map((hafidh) => (
                            <button
                              key={hafidh}
                              onClick={() => {
                                setSelectedHafidh(hafidh);
                                setHafidhSearch("");
                                setShowSuggestions(false);
                              }}
                              className="w-full px-[var(--spacing-static-md)] py-3 text-left hover:bg-background-surface text-primary transition-colors border-b border-contrast-low text-[length:var(--font-size-small)] dark:text-[#fbfcff] dark:hover:bg-[#292934] dark:border-[#404044]"
                            >
                              {hafidh}
                            </button>
                          ))
                        ) : (
                          <div className="px-[var(--spacing-static-md)] py-3 text-contrast-medium text-[length:var(--font-size-small)] dark:text-[#88898c]">
                            No huffadh found
                          </div>
                        )}
                      </div>
                    )}

                    {selectedHafidh && (
                      <button
                        onClick={() => {
                          setSelectedHafidh("");
                          setHafidhSearch("");
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-contrast-medium hover:text-primary dark:text-[#88898c] dark:hover:text-[#fbfcff]"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    className="flex-shrink-0 p-[var(--spacing-static-sm)] border border-contrast-low rounded-[var(--radius-md)] text-primary hover:bg-background-shading transition-all duration-[var(--motion-duration-short)] dark:border-[#404044] dark:text-[#fbfcff] dark:hover:bg-[#404044]"
                    aria-label="Advanced Filters"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedSearch && (
                <div className="space-y-[var(--spacing-static-md)]">
                  <FilterSelect
                    label="Venue"
                    options={["All", ...venues]}
                    selected={selectedVenue}
                    onChange={setSelectedVenue}
                  />
                  <FilterSelect
                    label="City"
                    options={["All", ...cities]}
                    selected={selectedCity}
                    onChange={setSelectedCity}
                  />
                  <FilterSelect
                    label="Year"
                    options={["All", ...years.map(String)]}
                    selected={selectedYear}
                    onChange={setSelectedYear}
                  />
                  <FilterSelect
                    label="Media Type"
                    options={["All", "YouTube", "SoundCloud"]}
                    selected={selectedMediaType}
                    onChange={setSelectedMediaType}
                  />
                </div>
              )}

              <button
                onClick={() => setShowMobileSearch(false)}
                className="mt-[var(--spacing-static-lg)] w-full px-[var(--spacing-static-md)] py-3 bg-primary text-background-base font-bold rounded-[var(--radius-md)] hover:opacity-90 transition-opacity text-[length:var(--font-size-small)] dark:bg-[#fbfcff] dark:text-[#0e0e12]"
              >
                Apply Filters ({filteredRecordings.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-[var(--spacing-static-md)] py-[var(--spacing-fluid-lg)]">
        {filteredRecordings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-fluid-md)]">
            {filteredRecordings.map((recording) => (
              <RecordingCard
                key={recording.id}
                recording={recording}
                onPlay={playRecording}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-[var(--spacing-static-2xl)]">
            <h3 className="text-[length:var(--font-size-x-large)] text-primary font-bold mb-3 dark:text-[#fbfcff]">
              No recordings found
            </h3>
            <p className="text-[length:var(--font-size-medium)] text-contrast-medium dark:text-[#88898c]">
              Try adjusting your filters to see more results
            </p>
          </div>
        )}
      </div>

      {/* YouTube Player */}
      {currentRecording && currentRecording.source === "youtube" && (
        <div className="fixed bottom-0 left-0 right-0 bg-background-surface border-t border-contrast-low shadow-lg z-30 dark:bg-[#292934] dark:border-[#404044]">
          <div className="h-[320px] flex flex-col">
            <div className="flex items-center justify-between px-[var(--spacing-static-md)] py-3 border-b border-contrast-low dark:border-[#404044]">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[length:var(--font-size-small)] truncate text-primary dark:text-[#fbfcff]">
                  {currentRecording.hafidh_name}
                </div>
                <div className="text-[length:var(--font-size-x-small)] text-contrast-medium truncate dark:text-[#88898c]">
                  {currentRecording.venue_name}, {currentRecording.city} &bull;{" "}
                  {currentRecording.hijri_year} هـ
                </div>
              </div>
              <button
                onClick={closePlayer}
                className="ml-4 p-2 rounded-[var(--radius-sm)] bg-notification-error text-white hover:opacity-90 transition-opacity"
                aria-label="Close player"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 bg-black">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${getYouTubeId(currentRecording.url)}?autoplay=1`}
                title={
                  currentRecording.title ||
                  `${currentRecording.hafidh_name} - ${currentRecording.hijri_year} AH`
                }
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* SoundCloud Player */}
      {currentRecording && currentRecording.source === "soundcloud" && (
        <div className="fixed bottom-0 left-0 right-0 bg-background-surface border-t border-contrast-low shadow-lg z-30 dark:bg-[#292934] dark:border-[#404044]">
          <div className="h-[200px] flex flex-col">
            <div className="flex items-center justify-between px-[var(--spacing-static-md)] py-3 border-b border-contrast-low dark:border-[#404044]">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[length:var(--font-size-small)] truncate text-primary dark:text-[#fbfcff]">
                  {currentRecording.hafidh_name}
                </div>
                <div className="text-[length:var(--font-size-x-small)] text-contrast-medium truncate dark:text-[#88898c]">
                  {currentRecording.venue_name}, {currentRecording.city} &bull;{" "}
                  {currentRecording.hijri_year} هـ
                  {currentRecording.section &&
                    ` \u2022 ${currentRecording.section}`}
                </div>
              </div>
              <button
                onClick={closePlayer}
                className="ml-4 p-2 rounded-[var(--radius-sm)] bg-notification-error text-white hover:opacity-90 transition-opacity"
                aria-label="Close player"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1">
              <iframe
                width="100%"
                height="100%"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(currentRecording.url)}&color=%23010205&auto_play=true&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-[length:var(--font-size-x-small)] font-semibold text-contrast-high mb-[var(--spacing-static-xs)] dark:text-[#cecfd1]">
        {label}
      </label>
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-[var(--spacing-static-md)] py-[var(--spacing-static-sm)] bg-background-base border border-contrast-low rounded-[var(--radius-md)] text-primary text-[length:var(--font-size-small)] focus:outline-none focus:ring-2 focus:ring-state-focus focus:border-transparent cursor-pointer transition-all duration-[var(--motion-duration-short)] hover:bg-background-surface appearance-none dark:bg-[#0e0e12] dark:border-[#404044] dark:text-[#fbfcff] dark:hover:bg-[#292934]"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-contrast-medium dark:text-[#88898c]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
