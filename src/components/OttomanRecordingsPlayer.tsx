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
  const [selectedHafidh, setSelectedHafidh] = useState<string>("All");
  const [selectedVenue, setSelectedVenue] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [currentRecording, setCurrentRecording] =
    useState<RecordingWithDetails | null>(null);

  // Filter recordings based on selected filters
  const filteredRecordings = recordings.filter((recording) => {
    if (selectedHafidh !== "All" && recording.hafidh_name !== selectedHafidh)
      return false;
    if (selectedVenue !== "All" && recording.venue_name !== selectedVenue)
      return false;
    if (selectedCity !== "All" && recording.city !== selectedCity) return false;
    if (
      selectedYear !== "All" &&
      recording.hijri_year.toString() !== selectedYear
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 pb-32">
      {/* Background arabesque pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 dark:opacity-10">
        <ArabesquePattern className="w-full h-full text-amber-700" />
      </div>

      {/* Ottoman Header */}
      <div className="relative sticky top-0 z-20 bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 dark:from-amber-950 dark:via-orange-950 dark:to-red-950 border-b-4 border-amber-600 shadow-2xl">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        <div className="container mx-auto px-4 py-8">
          {/* Logo and Title */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-400/20 rounded-full blur-xl" />
              <img
                src="/logo.png"
                alt="Taraweeh"
                className="relative h-20 w-20 rounded-full border-4 border-amber-400 shadow-lg"
              />
            </div>
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-amber-100 font-serif mb-2 drop-shadow-lg">
                Taraweeh
              </h1>
              <p className="text-amber-200 text-lg font-medium tracking-wide">
                مكتبة تسجيلات التراويح • Taraweeh Recordings Directory
              </p>
              <div className="flex items-center justify-center gap-3 mt-3">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-400" />
                <CrescentMoon className="w-6 h-6 text-amber-400" />
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-400" />
              </div>
            </div>
          </div>

          {/* Filters - Ottoman styled */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <OttomanFilter
              label="القارئ • Hafidh"
              options={["All", ...huffadh]}
              selected={selectedHafidh}
              onChange={setSelectedHafidh}
            />
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
          </div>
        </div>

        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-12">
        {/* Results count with Ottoman styling */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-4 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm px-8 py-4 rounded-full border-2 border-amber-600/30 shadow-lg">
            <IslamicStar className="w-8 h-8 text-amber-600" />
            <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 font-serif">
              {filteredRecordings.length} Recording
              {filteredRecordings.length !== 1 ? "s" : ""}
            </h2>
            <IslamicStar className="w-8 h-8 text-amber-600 rotate-180" />
          </div>
        </div>

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
            <div className="inline-block w-32 h-32 mb-6 text-amber-300 dark:text-amber-700 opacity-40">
              <CrescentMoon className="w-full h-full" />
            </div>
            <h3 className="text-3xl text-amber-800 dark:text-amber-200 font-serif mb-3">
              No recordings found
            </h3>
            <p className="text-amber-600 dark:text-amber-400 text-lg">
              Try adjusting your filters to see more results
            </p>
          </div>
        )}
      </div>

      {/* YouTube Player - Ottoman styled fixed bottom */}
      {currentRecording && currentRecording.source === "youtube" && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-amber-900 to-orange-900 dark:from-zinc-900 dark:to-zinc-800 border-t-4 border-amber-600 shadow-2xl z-30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          <div className="h-[320px] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-amber-950/50 backdrop-blur-sm">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <IslamicStar className="w-8 h-8 text-amber-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-lg truncate text-amber-100 font-serif">
                    {currentRecording.hafidh_name}
                  </div>
                  <div className="text-sm text-amber-300 truncate">
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
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-orange-900 to-amber-900 dark:from-zinc-900 dark:to-zinc-800 border-t-4 border-orange-600 shadow-2xl z-30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent" />

          <div className="h-[200px] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-orange-950/50 backdrop-blur-sm">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <IslamicStar className="w-8 h-8 text-orange-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-lg truncate text-amber-100 font-serif">
                    {currentRecording.hafidh_name}
                  </div>
                  <div className="text-sm text-orange-300 truncate">
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
      <label className="block text-sm font-bold text-amber-200 mb-2 text-center">
        {label}
      </label>
      <div className="relative">
        {/* Decorative corners */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-amber-400" />

        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full px-4 py-3
            bg-amber-50 dark:bg-zinc-800
            border-2 border-amber-600/50
            rounded-md
            text-amber-900 dark:text-amber-100
            font-semibold
            focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
            cursor-pointer
            transition-all duration-200
            hover:bg-amber-100 dark:hover:bg-zinc-700
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
            className="w-5 h-5 text-amber-600"
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
