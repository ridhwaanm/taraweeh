import { useState } from "react";
import type { RecordingWithDetails } from "../lib/db";
import { OttomanRecordingCard } from "./OttomanRecordingCard";
import {
  ArabesquePattern,
  CrescentMoon,
  IslamicStar,
} from "./patterns/OttomanBorder";

interface RecordingsPlayerProps {
  recordings: RecordingWithDetails[];
  huffadh: string[];
  venues: string[];
  cities: string[];
  years: number[];
}

export default function OttomanRecordingsPlayer({
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
  const [currentRecording, setCurrentRecording] =
    useState<RecordingWithDetails | null>(null);

  // Filter huffadh based on search
  const filteredHuffadh = huffadh.filter((hafidh) =>
    hafidh.toLowerCase().includes(hafidhSearch.toLowerCase()),
  );

  // Filter recordings based on selected filters
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

  // Extract YouTube video ID from URL
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 pb-32">
      {/* Background arabesque pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 dark:opacity-10">
        <ArabesquePattern className="w-full h-full text-blue-700" />
      </div>

      {/* Ottoman Header - Çini Blue */}
      <div className="relative sticky top-0 z-20 bg-gradient-to-r from-blue-900 via-cyan-800 to-teal-900 dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950 border-b-4 border-cyan-600 shadow-2xl">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        <div className="container mx-auto px-4 py-8">
          {/* Logo and Title */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-cyan-400/20 blur-xl" />
              <img
                src="/logo.png"
                alt="Taraweeh"
                className="relative h-24 w-24 drop-shadow-2xl"
              />
            </div>
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-cyan-50 font-serif mb-2 drop-shadow-lg">
                Taraweeh
              </h1>
              <p className="text-cyan-100 text-lg font-medium tracking-wide">
                مكتبة تسجيلات التراويح • Taraweeh Recordings Directory
              </p>
              <div className="flex items-center justify-center gap-3 mt-3">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-cyan-400" />
                <CrescentMoon className="w-6 h-6 text-cyan-400" />
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-cyan-400" />
              </div>
            </div>
          </div>

          {/* Filters - Ottoman styled */}
          <div className="space-y-4">
            {/* Hafidh Search with Suggestions */}
            <div className="relative">
              <label className="block text-sm font-bold text-cyan-200 mb-2 text-center">
                القارئ • Hafidh
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={hafidhSearch}
                  onChange={(e) => setHafidhSearch(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  placeholder={selectedHafidh || "Search for a Hafidh..."}
                  className="w-full px-4 py-3 bg-cyan-50 dark:bg-zinc-800 border-2 border-cyan-600/50 rounded-md text-cyan-900 dark:text-cyan-100 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                />

                {/* Suggestions dropdown */}
                {showSuggestions && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border-2 border-cyan-600/50 rounded-md shadow-xl max-h-60 overflow-y-auto">
                    {filteredHuffadh.length > 0 ? (
                      filteredHuffadh.map((hafidh) => (
                        <button
                          key={hafidh}
                          onClick={() => {
                            setSelectedHafidh(hafidh);
                            setHafidhSearch("");
                            setShowSuggestions(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-cyan-100 dark:hover:bg-cyan-900/30 text-cyan-900 dark:text-cyan-100 transition-colors"
                        >
                          {hafidh}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-cyan-600 dark:text-cyan-400">
                        No huffadh found
                      </div>
                    )}
                  </div>
                )}

                {/* Clear button if hafidh selected */}
                {selectedHafidh && (
                  <button
                    onClick={() => {
                      setSelectedHafidh("");
                      setHafidhSearch("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-200"
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
            <div className="flex justify-center">
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="flex items-center gap-2 px-6 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-600/50 rounded-full text-cyan-100 font-semibold transition-all duration-200"
              >
                <span>Advanced Search</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${showAdvancedSearch ? "rotate-180" : ""}`}
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

            {/* Advanced Filters - Collapsible */}
            {showAdvancedSearch && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top">
                <OttomanFilter
                  label="المسجد • Venue"
                  options={["All", ...venues]}
                  selected={selectedVenue}
                  onChange={setSelectedVenue}
                />
                <OttomanFilter
                  label="المدينة • City"
                  options={["All", ...cities]}
                  selected={selectedCity}
                  onChange={setSelectedCity}
                />
                <OttomanFilter
                  label="السنة • Year"
                  options={["All", ...years.map(String)]}
                  selected={selectedYear}
                  onChange={setSelectedYear}
                />
                <OttomanFilter
                  label="نوع الوسائط • Media Type"
                  options={["All", "YouTube", "SoundCloud"]}
                  selected={selectedMediaType}
                  onChange={setSelectedMediaType}
                />
              </div>
            )}
          </div>
        </div>

        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-600 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-12">
        {/* Recordings Grid - Ottoman Card Layout */}
        {filteredRecordings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecordings.map((recording) => (
              <OttomanRecordingCard
                key={recording.id}
                recording={recording}
                onPlay={playRecording}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <div className="inline-block w-32 h-32 mb-6 text-cyan-300 dark:text-cyan-700 opacity-40">
              <CrescentMoon className="w-full h-full" />
            </div>
            <h3 className="text-3xl text-blue-800 dark:text-cyan-200 font-serif mb-3">
              No recordings found
            </h3>
            <p className="text-blue-600 dark:text-cyan-400 text-lg">
              Try adjusting your filters to see more results
            </p>
          </div>
        )}
      </div>

      {/* YouTube Player - Ottoman styled fixed bottom */}
      {currentRecording && currentRecording.source === "youtube" && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-blue-900 to-cyan-900 dark:from-zinc-900 dark:to-zinc-800 border-t-4 border-cyan-600 shadow-2xl z-30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          <div className="h-[320px] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-blue-950/50 backdrop-blur-sm">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-lg truncate text-cyan-100 font-serif">
                    {currentRecording.hafidh_name}
                  </div>
                  <div className="text-sm text-cyan-300 truncate">
                    {currentRecording.venue_name}, {currentRecording.city} •{" "}
                    {currentRecording.hijri_year} هـ
                  </div>
                </div>
              </div>
              <button
                onClick={closePlayer}
                className="ml-4 p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg flex-shrink-0"
                aria-label="Close player"
              >
                <svg
                  className="w-6 h-6"
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

      {/* SoundCloud Player - Ottoman styled fixed bottom */}
      {currentRecording && currentRecording.source === "soundcloud" && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-cyan-900 to-teal-900 dark:from-zinc-900 dark:to-zinc-800 border-t-4 border-cyan-600 shadow-2xl z-30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          <div className="h-[200px] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-cyan-950/50 backdrop-blur-sm">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-lg truncate text-cyan-100 font-serif">
                    {currentRecording.hafidh_name}
                  </div>
                  <div className="text-sm text-cyan-300 truncate">
                    {currentRecording.venue_name}, {currentRecording.city} •{" "}
                    {currentRecording.hijri_year} هـ
                    {currentRecording.section &&
                      ` • ${currentRecording.section}`}
                  </div>
                </div>
              </div>
              <button
                onClick={closePlayer}
                className="ml-4 p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg flex-shrink-0"
                aria-label="Close player"
              >
                <svg
                  className="w-6 h-6"
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
                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(currentRecording.url)}&color=%23ff5500&auto_play=true&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Ottoman-styled filter component
function OttomanFilter({
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
    <div className="relative">
      <label className="block text-sm font-bold text-cyan-200 mb-2 text-center">
        {label}
      </label>
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full px-4 py-3
            bg-cyan-50 dark:bg-zinc-800
            border-2 border-cyan-600/50
            rounded-md
            text-cyan-900 dark:text-cyan-100
            font-semibold
            focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
            cursor-pointer
            transition-all duration-200
            hover:bg-cyan-100 dark:hover:bg-zinc-700
            appearance-none
          "
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-cyan-600"
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
