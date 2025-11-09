/**
 * Ottoman-style decorative border pattern
 * SVG-based for perfect scaling
 */
export function OttomanBorder({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      {/* Ornate corner pattern */}
      <path
        d="M0 0 L50 0 C30 20, 20 30, 0 50 Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M400 0 L350 0 C370 20, 380 30, 400 50 Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M0 400 L50 400 C30 380, 20 370, 0 350 Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M400 400 L350 400 C370 380, 380 370, 400 350 Z"
        fill="currentColor"
        opacity="0.15"
      />

      {/* Geometric border pattern */}
      <pattern
        id="ottoman-pattern"
        x="0"
        y="0"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M20 0 L40 20 L20 40 L0 20 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
        <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.4" />
      </pattern>

      {/* Top border */}
      <rect x="50" y="0" width="300" height="4" fill="url(#ottoman-pattern)" />
      {/* Right border */}
      <rect
        x="396"
        y="50"
        width="4"
        height="300"
        fill="url(#ottoman-pattern)"
      />
      {/* Bottom border */}
      <rect
        x="50"
        y="396"
        width="300"
        height="4"
        fill="url(#ottoman-pattern)"
      />
      {/* Left border */}
      <rect x="0" y="50" width="4" height="300" fill="url(#ottoman-pattern)" />
    </svg>
  );
}

/**
 * Islamic star pattern for decorative elements
 */
export function IslamicStar({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 10 L58 38 L88 38 L64 56 L72 84 L50 66 L28 84 L36 56 L12 38 L42 38 Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M50 20 L54 36 L70 36 L57 46 L61 62 L50 52 L39 62 L43 46 L30 36 L46 36 Z"
        fill="currentColor"
        opacity="0.4"
      />
      <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

/**
 * Arabesque floral pattern
 */
export function ArabesquePattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="arabesque"
          x="0"
          y="0"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M25 0 Q35 10 25 20 Q15 10 25 0 Z"
            fill="currentColor"
            opacity="0.1"
          />
          <path
            d="M0 25 Q10 15 20 25 Q10 35 0 25 Z"
            fill="currentColor"
            opacity="0.1"
          />
          <path
            d="M50 25 Q40 15 30 25 Q40 35 50 25 Z"
            fill="currentColor"
            opacity="0.1"
          />
          <path
            d="M25 50 Q15 40 25 30 Q35 40 25 50 Z"
            fill="currentColor"
            opacity="0.1"
          />
          <circle cx="25" cy="25" r="2" fill="currentColor" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#arabesque)" />
    </svg>
  );
}
