import type { RecordingWithDetails } from "../lib/db";

interface RecordingCardProps {
  recording: RecordingWithDetails;
  onPlay: (recording: RecordingWithDetails) => void;
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/shorts\/([^&\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function GeometricPattern({ id }: { id: number }) {
  const hue = (id * 137) % 360;
  const bg = `hsl(${hue}, 20%, 12%)`;
  const fg = `hsl(${hue}, 30%, 30%)`;

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="200" height="200" fill={bg} />
      <defs>
        <pattern
          id={`geo-${id}`}
          x="0"
          y="0"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M25 0 L31 19 L50 25 L31 31 L25 50 L19 31 L0 25 L19 19 Z"
            fill={fg}
            opacity="0.3"
          />
          <path
            d="M25 10 L29 21 L40 25 L29 29 L25 40 L21 29 L10 25 L21 21 Z"
            fill={fg}
            opacity="0.2"
          />
          <circle cx="25" cy="25" r="3" fill={fg} opacity="0.35" />
          <circle cx="0" cy="0" r="2" fill={fg} opacity="0.2" />
          <circle cx="50" cy="0" r="2" fill={fg} opacity="0.2" />
          <circle cx="0" cy="50" r="2" fill={fg} opacity="0.2" />
          <circle cx="50" cy="50" r="2" fill={fg} opacity="0.2" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill={`url(#geo-${id})`} />
    </svg>
  );
}

export function RecordingCard({ recording, onPlay }: RecordingCardProps) {
  const youtubeId =
    recording.source === "youtube" ? getYouTubeId(recording.url) : null;

  return (
    <button
      onClick={() => onPlay(recording)}
      className="group relative w-full text-left"
    >
      <div className="relative aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden bg-background-surface">
        {/* Image / Pattern */}
        {youtubeId ? (
          <img
            src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
            alt={`${recording.hafidh_name} - ${recording.venue_name}`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[var(--motion-duration-moderate)] group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <GeometricPattern id={recording.id} />
        )}

        {/* Source badge — top right */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider opacity-70 group-hover:opacity-100 transition-opacity duration-[var(--motion-duration-short)] ${
              recording.source === "youtube"
                ? "bg-[#cc1922] text-white"
                : "bg-[#f7cb47] text-[#1a1a22]"
            }`}
          >
            {recording.source}
          </span>
        </div>

        {/* Play button — center, appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-[var(--motion-duration-short)] shadow-lg">
            <svg
              className="w-7 h-7 text-[#0e0e12] ml-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>

        {/* Gradient overlay + text — bottom */}
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20 pb-4 px-4">
          <h3 className="text-[length:var(--font-size-large)] font-bold text-white leading-tight line-clamp-1">
            {recording.hafidh_name}
          </h3>
          <div className="flex items-center justify-between mt-1.5">
            <p className="text-[length:var(--font-size-small)] text-white/70 line-clamp-1">
              {recording.venue_name}, {recording.city}
            </p>
            <span className="text-[length:var(--font-size-small)] text-white/60 font-semibold shrink-0 ml-3">
              {recording.hijri_year} هـ
            </span>
          </div>
          {recording.section && (
            <p className="text-[length:var(--font-size-xx-small)] text-white/50 mt-1 line-clamp-1">
              {recording.section}
            </p>
          )}
        </div>

        {/* Hover darkening overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-[var(--motion-duration-short)]" />
      </div>
    </button>
  );
}
