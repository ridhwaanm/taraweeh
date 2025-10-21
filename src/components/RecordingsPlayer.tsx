import { useState } from "react";
import type { RecordingWithDetails } from "../lib/db";
import { Listbox } from "@headlessui/react";

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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 text-gray-900 pb-32">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <img src="/logo.png" alt="Taraweeh" className="h-12 w-auto" />
          <div>
            <h1 className="text-3xl font-bold text-teal-800">Taraweeh</h1>
            <p className="text-sm text-gray-600">
              Directory of Taraweeh Recordings
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FilterSelect
            label="Hafidh"
            options={["All", ...huffadh]}
            selected={selectedHafidh}
            onChange={setSelectedHafidh}
          />
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
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        <h2 className="text-2xl font-bold mb-6">
          {filteredRecordings.length} Recording
          {filteredRecordings.length !== 1 ? "s" : ""}
        </h2>

        {/* Recordings Table */}
        <div className="space-y-2">
          {filteredRecordings.map((recording, index) => (
            <div
              key={recording.id}
              className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                currentRecording?.id === recording.id
                  ? "bg-teal-100 shadow-md"
                  : "bg-white hover:bg-teal-50 shadow-sm hover:shadow"
              }`}
              onClick={() => playRecording(recording)}
            >
              <div className="col-span-1 flex items-center justify-center text-gray-500">
                {currentRecording?.id === recording.id ? (
                  <svg
                    className="w-5 h-5 text-teal-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>

              <div className="col-span-5 flex flex-col justify-center">
                <div
                  className={`font-medium ${currentRecording?.id === recording.id ? "text-teal-700" : "text-gray-900"}`}
                >
                  {recording.hafidh_name}
                </div>
                {recording.title && (
                  <div className="text-sm text-gray-600">{recording.title}</div>
                )}
              </div>

              <div className="col-span-3 flex items-center text-sm text-gray-700">
                {recording.venue_name}
              </div>

              <div className="col-span-2 flex items-center text-sm text-gray-700">
                {recording.city}
              </div>

              <div className="col-span-1 flex items-center justify-end">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    recording.source === "youtube"
                      ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {recording.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* YouTube Player - Fixed Bottom */}
      {currentRecording && currentRecording.source === "youtube" && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
          style={{ height: "320px" }}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate text-gray-900">
                  {currentRecording.hafidh_name}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {currentRecording.venue_name}, {currentRecording.city} •{" "}
                  {currentRecording.hijri_year} AH
                </div>
              </div>
              <button
                onClick={closePlayer}
                className="ml-4 text-gray-600 hover:text-gray-900 p-2"
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
                src={`https://www.youtube.com/embed/${getYouTubeId(currentRecording.url)}?autoplay=1`}
                title={
                  currentRecording.title ||
                  `${currentRecording.hafidh_name} - ${currentRecording.hijri_year} AH`
                }
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* SoundCloud Player - Opens in new tab */}
      {currentRecording && currentRecording.source === "soundcloud" && (
        <>
          {window.open(currentRecording.url, "_blank")}
          {setCurrentRecording(null)}
        </>
      )}
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

function FilterSelect({
  label,
  options,
  selected,
  onChange,
}: FilterSelectProps) {
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative">
        <Listbox.Label className="block text-xs text-gray-600 mb-1 font-medium">
          {label}
        </Listbox.Label>
        <Listbox.Button className="w-full bg-white hover:bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-left text-sm transition-all flex items-center justify-between shadow-sm">
          <span className="truncate text-gray-900">{selected}</span>
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Listbox.Button>
        <Listbox.Options className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-xl max-h-60 overflow-auto border border-gray-200">
          {options.map((option) => (
            <Listbox.Option
              key={option}
              value={option}
              className={({ active }) =>
                `cursor-pointer select-none px-4 py-2 text-sm ${
                  active ? "bg-teal-50" : ""
                } ${selected === option ? "text-teal-700 font-medium bg-teal-50" : "text-gray-900"}`
              }
            >
              {option}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
