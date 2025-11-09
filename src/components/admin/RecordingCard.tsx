import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { IslamicStar } from "../patterns/OttomanBorder";

interface Recording {
  id: number;
  hafidh_id: number;
  venue_id: number;
  hijri_year: number;
  url: string;
  source: string;
  audio_url?: string;
  section?: string;
  title?: string;
  description?: string;
  hafidh_name: string;
  venue_name: string;
  city: string;
}

interface RecordingCardProps {
  recording: Recording;
  onEdit: (recording: Recording) => void;
  onDelete: (recording: Recording) => void;
}

export function RecordingCard({
  recording,
  onEdit,
  onDelete,
}: RecordingCardProps) {
  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case "youtube":
        return "from-red-500/10 to-red-600/5 border-red-500/20";
      case "soundcloud":
        return "from-orange-500/10 to-orange-600/5 border-orange-500/20";
      default:
        return "from-teal-500/10 to-teal-600/5 border-teal-500/20";
    }
  };

  return (
    <div className="group relative">
      {/* Ottoman corner decorations */}
      <div className="absolute -top-2 -left-2 w-8 h-8 text-amber-600 dark:text-amber-400 opacity-40">
        <IslamicStar className="w-full h-full" />
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 text-amber-600 dark:text-amber-400 opacity-40 rotate-90">
        <IslamicStar className="w-full h-full" />
      </div>
      <div className="absolute -bottom-2 -left-2 w-8 h-8 text-amber-600 dark:text-amber-400 opacity-40 -rotate-90">
        <IslamicStar className="w-full h-full" />
      </div>
      <div className="absolute -bottom-2 -right-2 w-8 h-8 text-amber-600 dark:text-amber-400 opacity-40 rotate-180">
        <IslamicStar className="w-full h-full" />
      </div>

      {/* Card with Ottoman border */}
      <div
        className={`
          relative overflow-hidden rounded-lg border-2 bg-gradient-to-br
          ${getSourceColor(recording.source)}
          backdrop-blur-sm transition-all duration-300
          hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1
          dark:border-amber-700/30
        `}
      >
        {/* Geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px),
                             repeating-linear-gradient(-45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)`,
          }}
        />

        {/* Card content */}
        <div className="relative p-6">
          {/* Header with Hafidh name */}
          <div className="mb-4 border-b-2 border-amber-600/20 pb-3">
            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 font-serif">
              {recording.hafidh_name}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              {recording.venue_name}, {recording.city}
            </p>
          </div>

          {/* Details grid */}
          <div className="space-y-3">
            {/* Year */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider w-20">
                Year
              </span>
              <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                {recording.hijri_year} هـ
              </span>
            </div>

            {/* Section */}
            {recording.section && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider w-20">
                  Section
                </span>
                <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">
                  {recording.section}
                </span>
              </div>
            )}

            {/* Source badge */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider w-20">
                Source
              </span>
              <span
                className={`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
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

            {/* Title if available */}
            {recording.title && (
              <div className="mt-3 pt-3 border-t border-amber-600/10">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
                  "{recording.title}"
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex gap-2 pt-4 border-t-2 border-amber-600/20">
            <button
              onClick={() => onEdit(recording)}
              className="
                flex-1 flex items-center justify-center gap-2 px-4 py-2
                bg-teal-600 hover:bg-teal-700 text-white rounded-md
                transition-colors duration-200 text-sm font-semibold
                shadow-sm hover:shadow-md
              "
            >
              <PencilIcon className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(recording)}
              className="
                flex-1 flex items-center justify-center gap-2 px-4 py-2
                bg-red-600 hover:bg-red-700 text-white rounded-md
                transition-colors duration-200 text-sm font-semibold
                shadow-sm hover:shadow-md
              "
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Decorative border accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
      </div>
    </div>
  );
}
