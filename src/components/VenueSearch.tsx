import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";

interface Suggestion {
  placeId: string;
  text: string;
  description: string;
  secondaryText: string;
}

export function VenueSearch() {
  const map = useMap();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Prevent map interactions when interacting with search
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const stop = (e: Event) => e.stopPropagation();
    el.addEventListener("wheel", stop);
    el.addEventListener("mousedown", stop);
    el.addEventListener("dblclick", stop);
    el.addEventListener("touchstart", stop);
    return () => {
      el.removeEventListener("wheel", stop);
      el.removeEventListener("mousedown", stop);
      el.removeEventListener("dblclick", stop);
      el.removeEventListener("touchstart", stop);
    };
  }, []);

  const searchPlaces = async (input: string) => {
    if (input.trim().length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/places/autocomplete?input=${encodeURIComponent(input)}`,
      );
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setShowDropdown((data.suggestions || []).length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPlaces(value), 300);
  };

  const selectSuggestion = async (suggestion: Suggestion) => {
    setShowDropdown(false);
    setQuery(suggestion.text);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/places/details?placeId=${encodeURIComponent(suggestion.placeId)}`,
      );
      const details = await res.json();
      if (details.latitude && details.longitude) {
        map.flyTo([details.latitude, details.longitude], 14, {
          duration: 1.5,
        });
      }
    } catch (err) {
      console.error("Failed to fetch place details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "absolute",
        top: "12px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        width: "calc(100% - 24px)",
        maxWidth: "420px",
      }}
    >
      <div style={{ position: "relative" }}>
        <svg
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "16px",
            height: "16px",
            color: "#9ca3af",
            pointerEvents: "none",
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder="Search for a place..."
          style={{
            width: "100%",
            paddingLeft: "36px",
            paddingRight: loading ? "36px" : "12px",
            paddingTop: "10px",
            paddingBottom: "10px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            color: "#111827",
            outline: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
          onFocusCapture={(e) => {
            (e.target as HTMLInputElement).style.borderColor = "#178a7a";
            (e.target as HTMLInputElement).style.boxShadow =
              "0 2px 8px rgba(0,0,0,0.12), 0 0 0 2px rgba(23,138,122,0.2)";
          }}
          onBlurCapture={(e) => {
            (e.target as HTMLInputElement).style.borderColor = "#d1d5db";
            (e.target as HTMLInputElement).style.boxShadow =
              "0 2px 8px rgba(0,0,0,0.12)";
          }}
        />
        {loading && (
          <div
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "16px",
              height: "16px",
              border: "2px solid #d1d5db",
              borderTopColor: "#178a7a",
              borderRadius: "50%",
              animation: "spin 0.6s linear infinite",
            }}
          />
        )}
      </div>
      {showDropdown && suggestions.length > 0 && (
        <ul
          style={{
            marginTop: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(8px)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            overflow: "hidden",
            maxHeight: "240px",
            overflowY: "auto",
            listStyle: "none",
            margin: "4px 0 0 0",
            padding: 0,
          }}
        >
          {suggestions.map((s) => (
            <li key={s.placeId}>
              <button
                type="button"
                onClick={() => selectSuggestion(s)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.background = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.background = "none")
                }
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  {s.description}
                </span>
                {s.secondaryText && (
                  <span
                    style={{
                      display: "block",
                      fontSize: "11px",
                      color: "#6b7280",
                      marginTop: "1px",
                    }}
                  >
                    {s.secondaryText}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
      <style>{`@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </div>
  );
}
