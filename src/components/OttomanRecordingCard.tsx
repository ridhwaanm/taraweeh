import { IslamicStar } from "./patterns/OttomanBorder";
import type { RecordingWithDetails } from "../lib/db";

interface OttomanRecordingCardProps {
  recording: RecordingWithDetails;
  onPlay: (recording: RecordingWithDetails) => void;
}

export function OttomanRecordingCard({
  recording,
  onPlay,
}: OttomanRecordingCardProps) {
  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case "youtube":
        return "from-red-500/10 to-red-600/5 border-red-500/20 hover:border-red-500/40";
      case "soundcloud":
        return "from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40";
      default:
        return "from-teal-500/10 to-teal-600/5 border-teal-500/20 hover:border-teal-500/40";
    }
  };

  return (
    <button
      onClick={() => onPlay(recording)}
      className="group relative w-full text-left transition-all duration-300 hover:-translate-y-1"
    >
      {/* Ottoman corner decorations */}
      <div className="absolute -top-2 -left-2 w-8 h-8 text-amber-600 dark:text-amber-400 opacity-40 transition-opacity group-hover:opacity-70">
        <IslamicStar className="w-full h-full" />
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 text-amber-600 dark:text-amber-400 opacity-40 rotate-90 transition-opacity group-hover:opacity-70">
        <IslamicStar className="w-full h-full" />
      </div>
      <div className="absolute -bottom-2 -left-2 w-8 h-8 text-amber-600 dark:text-amber-400 opacity-40 -rotate-90 transition-opacity group-hover:opacity-70">
        <IslamicStar className="w-full h-full" />
      </div>
      <div className="absolute -bottom-2 -right-2 w-8 h-8 text-amber-600 dark:text-amber-400 opacity-40 rotate-180 transition-opacity group-hover:opacity-70">
        <IslamicStar className="w-full h-full" />
      </div>

      {/* Card with Ottoman border */}
      <div
        className={`
          relative overflow-hidden rounded-lg border-2 bg-gradient-to-br
          ${getSourceColor(recording.source)}
          backdrop-blur-sm transition-all duration-300
          hover:shadow-2xl hover:shadow-amber-500/20
          dark:border-amber-700/30
        `}
      >
        {/* Geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px),
                             repeating-linear-gradient(-45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)`,
          }}
        />

        {/* Card content */}
        <div className="relative p-6">
          {/* Header with Hafidh name */}
          <div className="mb-4 border-b-2 border-amber-600/20 pb-3">
            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 font-serif line-clamp-1 group-hover:text-amber-700 dark:group-hover:text-amber-200 transition-colors">
              {recording.hafidh_name}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-1">
              {recording.venue_name}, {recording.city}
            </p>
          </div>

          {/* Details grid */}
          <div className="space-y-2">
            {/* Year */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Year
              </span>
              <span className="text-sm text-zinc-700 dark:text-zinc-300 font-bold">
                {recording.hijri_year} هـ
              </span>
            </div>

            {/* Section */}
            {recording.section && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Section
                </span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-1">
                  {recording.section}
                </span>
              </div>
            )}

            {/* Source badge */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Source
              </span>
              <span
                className={`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase
                ${
                  recording.source === "youtube"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                }
              `}
              >
                {recording.source}
              </span>
            </div>
          </div>

          {/* Play indicator */}
          <div className="mt-4 pt-4 border-t-2 border-amber-600/20 flex items-center justify-center">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-semibold">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              <span className="text-sm">Click to Play</span>
            </div>
          </div>
        </div>

        {/* Decorative border accents */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-amber-600/0 group-hover:from-amber-400/5 group-hover:to-amber-600/5 transition-all duration-300 pointer-events-none" />
      </div>
    </button>
  );
}
