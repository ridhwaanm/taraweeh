import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { PublicVenue } from "../lib/db";

const JUZ_LABELS: Record<string, string> = {
  "0.25": "¼ Juz",
  "0.5": "½ Juz",
  "1": "1 Juz",
  "1.5": "1½ Juz",
  "2": "2 Juz",
  "3": "3 Juz",
};

const tealIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:24px;height:24px;background:#178a7a;border:2.5px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

export function VenueMarker({ venue }: { venue: PublicVenue }) {
  const juzLabel = venue.juz_per_night
    ? JUZ_LABELS[String(venue.juz_per_night)] || `${venue.juz_per_night} Juz`
    : null;

  return (
    <Marker position={[venue.latitude, venue.longitude]} icon={tealIcon}>
      <Popup maxWidth={280} minWidth={200}>
        <div style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.4 }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#010205",
              marginBottom: "2px",
            }}
          >
            {venue.venue_name}
          </div>
          {venue.sub_venue_name && (
            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginBottom: "4px",
              }}
            >
              {venue.sub_venue_name}
            </div>
          )}
          <div
            style={{
              fontSize: "12px",
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            {venue.address_full}
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              fontSize: "11px",
            }}
          >
            {venue.city && (
              <span
                style={{
                  background: "#f3f4f6",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  color: "#374151",
                }}
              >
                {venue.city}
              </span>
            )}
            {venue.province && (
              <span
                style={{
                  background: "#f3f4f6",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  color: "#374151",
                }}
              >
                {venue.province}
              </span>
            )}
            {juzLabel && (
              <span
                style={{
                  background: "#178a7a",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                {juzLabel}/night
              </span>
            )}
          </div>
          {venue.reader_names && (
            <div
              style={{
                marginTop: "8px",
                paddingTop: "8px",
                borderTop: "1px solid #e5e7eb",
                fontSize: "12px",
                color: "#374151",
              }}
            >
              <span style={{ fontWeight: 600, color: "#178a7a" }}>
                Huffadh:
              </span>{" "}
              {venue.reader_names}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
