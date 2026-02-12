import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Drawer } from "vaul";
import type { RecordingWithDetails } from "../lib/db";
import { RecordingCard } from "./RecordingCard";
import { NumberTicker } from "./NumberTicker";

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
  const [selectedHafidh, setSelectedHafidh] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMediaType, setSelectedMediaType] = useState("All");
  const [hafidhSearch, setHafidhSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentRecording, setCurrentRecording] =
    useState<RecordingWithDetails | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  // Scroll detection for sticky header compression
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredHuffadh = huffadh.filter((h) =>
    h.toLowerCase().includes(hafidhSearch.toLowerCase()),
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

  // Group recordings by Qari
  const groupedRecordings = useMemo(() => {
    const groups: { name: string; recordings: RecordingWithDetails[] }[] = [];
    const map = new Map<string, RecordingWithDetails[]>();
    for (const rec of filteredRecordings) {
      const existing = map.get(rec.hafidh_name);
      if (existing) {
        existing.push(rec);
      } else {
        const arr = [rec];
        map.set(rec.hafidh_name, arr);
        groups.push({ name: rec.hafidh_name, recordings: arr });
      }
    }
    return groups;
  }, [filteredRecordings]);

  const hasActiveFilters =
    selectedVenue !== "All" ||
    selectedCity !== "All" ||
    selectedYear !== "All" ||
    selectedMediaType !== "All";

  const clearAllFilters = () => {
    setSelectedHafidh("");
    setHafidhSearch("");
    setSelectedVenue("All");
    setSelectedCity("All");
    setSelectedYear("All");
    setSelectedMediaType("All");
  };

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
    <div className="min-h-screen bg-background-base pb-32">
      {/* ===== Sticky Header ===== */}
      <div
        className={`sticky top-0 z-20 transition-all duration-300 ${
          scrolled
            ? "py-2 bg-background-surface/95 border-b border-contrast-low"
            : "py-4 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3">
            {/* Logo — left-aligned, links to home */}
            <a href="/" className="shrink-0">
              <img
                src="/logo.png"
                alt="Taraweeh"
                className={`transition-all duration-300 ${scrolled ? "h-8 w-8" : "h-10 w-10"}`}
              />
            </a>

            {/* Search — centered */}
            <div className="relative flex-1 max-w-lg mx-auto">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-contrast-medium"
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
                <input
                  ref={searchRef}
                  type="text"
                  value={hafidhSearch}
                  onChange={(e) => setHafidhSearch(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  placeholder={selectedHafidh || "Search Qari..."}
                  className={`w-full pl-10 pr-10 bg-background-surface border border-contrast-low text-primary text-[length:var(--font-size-small)] placeholder:text-contrast-medium focus:outline-none focus:ring-2 focus:ring-state-focus focus:border-transparent transition-all duration-300 ${
                    scrolled
                      ? "py-1.5 rounded-full text-[length:var(--font-size-x-small)]"
                      : "py-2.5 rounded-full"
                  }`}
                />

                {selectedHafidh && (
                  <button
                    onClick={() => {
                      setSelectedHafidh("");
                      setHafidhSearch("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-contrast-medium hover:text-primary"
                  >
                    <svg
                      className="w-4 h-4"
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

              {/* Suggestions dropdown */}
              {showSuggestions && hafidhSearch && (
                <div className="absolute z-30 w-full mt-1 glass-card max-h-60 overflow-y-auto">
                  {filteredHuffadh.length > 0 ? (
                    filteredHuffadh.map((hafidh) => (
                      <button
                        key={hafidh}
                        onMouseDown={() => {
                          setSelectedHafidh(hafidh);
                          setHafidhSearch("");
                          setShowSuggestions(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-primary hover:bg-background-shading transition-colors text-[length:var(--font-size-small)]"
                      >
                        {hafidh}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2.5 text-contrast-medium text-[length:var(--font-size-small)]">
                      No Qaris found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Nav buttons — desktop */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <a
                href="/submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-contrast-low text-primary text-[length:var(--font-size-small)] font-semibold hover:bg-background-surface transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Submit Venue
              </a>
              <a
                href="/venues"
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-teal-600 text-white text-[length:var(--font-size-small)] font-semibold hover:bg-teal-700 transition-colors"
              >
                Venues
              </a>
            </div>

            {/* Burger menu — mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden shrink-0 p-2 rounded-[var(--radius-md)] text-primary hover:bg-background-surface transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu dropdown */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden"
              >
                <div className="flex flex-col gap-2 pt-3 pb-1">
                  <a
                    href="/submit"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] border border-contrast-low text-primary text-[length:var(--font-size-small)] font-semibold hover:bg-background-surface transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Submit Venue
                  </a>
                  <a
                    href="/venues"
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[var(--radius-md)] bg-teal-600 text-white text-[length:var(--font-size-small)] font-semibold hover:bg-teal-700 transition-colors"
                  >
                    Venues
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ===== Filter Chips ===== */}
      <div className="sticky top-[52px] z-10 bg-background-base/90 border-b border-contrast-low">
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {/* Result count */}
            <div className="shrink-0 text-[length:var(--font-size-x-small)] text-contrast-medium font-semibold tabular-nums">
              <NumberTicker
                value={filteredRecordings.length}
                className="text-primary font-bold"
              />{" "}
              recordings
            </div>

            <div className="w-px h-5 bg-contrast-low shrink-0 mx-1" />

            {/* City chips */}
            {cities.map((city) => (
              <FilterChip
                key={city}
                label={city}
                active={selectedCity === city}
                onClick={() =>
                  setSelectedCity(selectedCity === city ? "All" : city)
                }
              />
            ))}

            {/* Year chips */}
            {years.map((year) => (
              <FilterChip
                key={year}
                label={`${year} AH`}
                active={selectedYear === String(year)}
                onClick={() =>
                  setSelectedYear(
                    selectedYear === String(year) ? "All" : String(year),
                  )
                }
              />
            ))}

            {/* Media type chips */}
            <FilterChip
              label="YouTube"
              active={selectedMediaType === "YouTube"}
              onClick={() =>
                setSelectedMediaType(
                  selectedMediaType === "YouTube" ? "All" : "YouTube",
                )
              }
            />
            <FilterChip
              label="SoundCloud"
              active={selectedMediaType === "SoundCloud"}
              onClick={() =>
                setSelectedMediaType(
                  selectedMediaType === "SoundCloud" ? "All" : "SoundCloud",
                )
              }
            />

            {/* Advanced filters — opens Vaul bottom sheet on mobile, inline on desktop */}
            <AdvancedFilterButton
              venues={venues}
              selectedVenue={selectedVenue}
              setSelectedVenue={setSelectedVenue}
              hasActiveFilters={hasActiveFilters}
              clearAllFilters={clearAllFilters}
            />
          </div>
        </div>
      </div>

      {/* ===== Main Content — Grouped by Qari ===== */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-8">
        {groupedRecordings.length > 0 ? (
          <div className="space-y-8">
            {groupedRecordings.map((group, groupIdx) => (
              <div key={group.name}>
                {groupIdx > 0 && <div className="gradient-divider mb-8" />}
                {/* Sticky Qari header */}
                <div className="sticky top-[108px] z-[5] bg-background-base/95 py-2 mb-4">
                  <h2 className="text-[length:var(--font-size-medium)] font-bold text-primary">
                    {group.name}
                    <span className="ml-2 text-[length:var(--font-size-xx-small)] text-contrast-medium font-normal">
                      {group.recordings.length} recording
                      {group.recordings.length !== 1 ? "s" : ""}
                    </span>
                  </h2>
                </div>

                {/* 2-col mobile, 3-col desktop grid */}
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-[var(--spacing-fluid-md)]"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.05 },
                    },
                  }}
                >
                  {group.recordings.map((recording) => (
                    <RecordingCard
                      key={recording.id}
                      recording={recording}
                      onPlay={playRecording}
                    />
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-[length:var(--font-size-x-large)] text-primary font-bold mb-3">
              No recordings found
            </h3>
            <p className="text-[length:var(--font-size-small)] text-contrast-medium mb-4">
              Try adjusting your filters
            </p>
            {(hasActiveFilters || selectedHafidh) && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-full bg-state-focus text-white text-[length:var(--font-size-small)] font-semibold hover:opacity-90 transition-opacity"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ===== YouTube Player ===== */}
      <AnimatePresence>
        {currentRecording && currentRecording.source === "youtube" && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 glass-card border-t border-contrast-low z-30"
          >
            <div className="h-[320px] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[length:var(--font-size-small)] truncate text-primary">
                    {currentRecording.hafidh_name}
                  </div>
                  <div className="text-[length:var(--font-size-x-small)] text-contrast-medium truncate">
                    {currentRecording.venue_name}, {currentRecording.city}{" "}
                    &bull; {currentRecording.hijri_year} هـ
                  </div>
                </div>
                <button
                  onClick={closePlayer}
                  className="ml-4 p-2 rounded-full bg-background-surface text-primary hover:bg-background-shading transition-colors"
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
              <div className="flex-1 bg-black rounded-b-[var(--radius-lg)]">
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SoundCloud Player ===== */}
      <AnimatePresence>
        {currentRecording && currentRecording.source === "soundcloud" && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 glass-card border-t border-contrast-low z-30"
          >
            <div className="h-[200px] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[length:var(--font-size-small)] truncate text-primary">
                    {currentRecording.hafidh_name}
                  </div>
                  <div className="text-[length:var(--font-size-x-small)] text-contrast-medium truncate">
                    {currentRecording.venue_name}, {currentRecording.city}{" "}
                    &bull; {currentRecording.hijri_year} هـ
                    {currentRecording.section &&
                      ` \u2022 ${currentRecording.section}`}
                  </div>
                </div>
                <button
                  onClick={closePlayer}
                  className="ml-4 p-2 rounded-full bg-background-surface text-primary hover:bg-background-shading transition-colors"
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
                  src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(currentRecording.url)}&color=%234d6ef5&auto_play=true&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===== Filter Chip ===== */
function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className={`shrink-0 px-3 py-1 rounded-full text-[length:var(--font-size-xx-small)] font-semibold transition-colors whitespace-nowrap ${
        active
          ? "bg-state-focus text-white"
          : "bg-background-surface text-contrast-medium hover:text-primary"
      }`}
    >
      {label}
    </motion.button>
  );
}

/* ===== Advanced Filter Button + Vaul Drawer ===== */
function AdvancedFilterButton({
  venues,
  selectedVenue,
  setSelectedVenue,
  hasActiveFilters,
  clearAllFilters,
}: {
  venues: string[];
  selectedVenue: string;
  setSelectedVenue: (v: string) => void;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
}) {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <button className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-background-surface text-contrast-medium hover:text-primary text-[length:var(--font-size-xx-small)] font-semibold transition-colors">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          Venue
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-state-focus" />
          )}
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 outline-none">
          <div className="glass-card rounded-t-2xl p-4 pb-8 max-h-[70vh] overflow-y-auto">
            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full bg-contrast-low mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[length:var(--font-size-large)] font-bold text-primary">
                Filter by Venue
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[length:var(--font-size-x-small)] text-state-focus font-semibold"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-1">
              <DrawerOption
                label="All Venues"
                active={selectedVenue === "All"}
                onClick={() => setSelectedVenue("All")}
              />
              {venues.map((venue) => (
                <DrawerOption
                  key={venue}
                  label={venue}
                  active={selectedVenue === venue}
                  onClick={() => setSelectedVenue(venue)}
                />
              ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function DrawerOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Drawer.Close asChild>
      <button
        onClick={onClick}
        className={`w-full text-left px-3 py-2.5 rounded-[var(--radius-md)] text-[length:var(--font-size-small)] transition-colors ${
          active
            ? "bg-state-focus/15 text-state-focus font-semibold"
            : "text-primary hover:bg-background-shading"
        }`}
      >
        {label}
      </button>
    </Drawer.Close>
  );
}
