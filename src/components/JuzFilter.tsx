import { useEffect, useRef, useState } from "react";

const JUZ_LABELS: Record<string, string> = {
  "0.25": "¼",
  "0.5": "½",
  "1": "1",
  "1.5": "1½",
  "2": "2",
  "3": "3",
};

function formatJuz(value: number): string {
  return JUZ_LABELS[String(value)] ?? String(value);
}

interface JuzFilterProps {
  uniqueValues: number[];
  onFilterChange: (min: number, max: number) => void;
  onFilterClear: () => void;
}

export function JuzFilter({
  uniqueValues,
  onFilterChange,
  onFilterClear,
}: JuzFilterProps) {
  const [open, setOpen] = useState(false);
  const [minIdx, setMinIdx] = useState(0);
  const [maxIdx, setMaxIdx] = useState(uniqueValues.length - 1);
  const [isFiltered, setIsFiltered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxIndex = uniqueValues.length - 1;

  // Prevent map interactions from bleeding through
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const stop = (e: Event) => e.stopPropagation();
    el.addEventListener("wheel", stop, { passive: false });
    el.addEventListener("mousedown", stop);
    el.addEventListener("dblclick", stop);
    el.addEventListener("touchstart", stop, { passive: true });
    return () => {
      el.removeEventListener("wheel", stop);
      el.removeEventListener("mousedown", stop);
      el.removeEventListener("dblclick", stop);
      el.removeEventListener("touchstart", stop);
    };
  }, []);

  // Reset indices when uniqueValues changes
  useEffect(() => {
    if (!isFiltered) {
      setMinIdx(0);
      setMaxIdx(uniqueValues.length - 1);
    }
  }, [uniqueValues, isFiltered]);

  if (uniqueValues.length < 2) return null;

  const handleMinChange = (val: number) => {
    const newMin = Math.min(val, maxIdx);
    setMinIdx(newMin);
    setIsFiltered(true);
    onFilterChange(uniqueValues[newMin], uniqueValues[maxIdx]);
  };

  const handleMaxChange = (val: number) => {
    const newMax = Math.max(val, minIdx);
    setMaxIdx(newMax);
    setIsFiltered(true);
    onFilterChange(uniqueValues[minIdx], uniqueValues[newMax]);
  };

  const handleClear = () => {
    setMinIdx(0);
    setMaxIdx(maxIndex);
    setIsFiltered(false);
    onFilterClear();
  };

  const minLabel = formatJuz(uniqueValues[minIdx]);
  const maxLabel = formatJuz(uniqueValues[maxIdx]);
  const rangeText =
    minIdx === maxIdx ? `${minLabel} Juz` : `${minLabel}–${maxLabel} Juz`;

  // Track fill percentage for the visual bar
  const fillLeft = (minIdx / maxIndex) * 100;
  const fillRight = (maxIdx / maxIndex) * 100;

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: "60px",
        left: "12px",
        zIndex: 1000,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Toggle pill */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: isFiltered ? "#178a7a" : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          border: isFiltered ? "none" : "1px solid #d1d5db",
          borderRadius: "8px",
          padding: "8px 12px",
          fontSize: "13px",
          fontWeight: 600,
          color: isFiltered ? "white" : "#374151",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          fontFamily: "Inter, sans-serif",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        {isFiltered ? rangeText : "Juz/night"}
      </button>

      {/* Expanded panel */}
      {open && (
        <div
          style={{
            marginTop: "8px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            minWidth: "220px",
          }}
        >
          {/* Range label */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <span
              style={{ fontSize: "13px", fontWeight: 600, color: "#178a7a" }}
            >
              {rangeText}/night
            </span>
            {isFiltered && (
              <button
                onClick={handleClear}
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  background: "#f3f4f6",
                  border: "none",
                  borderRadius: "4px",
                  padding: "2px 8px",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Dual-thumb slider */}
          <div style={{ position: "relative", height: "36px" }}>
            {/* Track background */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: "4px",
                background: "#e5e7eb",
                borderRadius: "2px",
                transform: "translateY(-50%)",
              }}
            />
            {/* Active fill */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: `${fillLeft}%`,
                width: `${fillRight - fillLeft}%`,
                height: "4px",
                background: "#178a7a",
                borderRadius: "2px",
                transform: "translateY(-50%)",
              }}
            />
            {/* Min thumb */}
            <input
              type="range"
              min={0}
              max={maxIndex}
              step={1}
              value={minIdx}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                WebkitAppearance: "none",
                appearance: "none",
                background: "transparent",
                pointerEvents: "none",
                margin: 0,
                zIndex: 3,
              }}
              className="juz-range-thumb"
            />
            {/* Max thumb */}
            <input
              type="range"
              min={0}
              max={maxIndex}
              step={1}
              value={maxIdx}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                WebkitAppearance: "none",
                appearance: "none",
                background: "transparent",
                pointerEvents: "none",
                margin: 0,
                zIndex: 4,
              }}
              className="juz-range-thumb"
            />
          </div>

          {/* Tick labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "4px",
            }}
          >
            {uniqueValues.map((v) => (
              <span
                key={v}
                style={{
                  fontSize: "10px",
                  color: "#9ca3af",
                  width: 0,
                  textAlign: "center",
                  overflow: "visible",
                  whiteSpace: "nowrap",
                }}
              >
                {formatJuz(v)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
