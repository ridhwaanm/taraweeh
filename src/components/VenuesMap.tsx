import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { VenueMarker } from "./VenueMarker";
import { VenueSearch } from "./VenueSearch";
import type { PublicVenue } from "../lib/db";
import "leaflet/dist/leaflet.css";

// South Africa center
const SA_CENTER: [number, number] = [-29.0, 25.0];
const SA_ZOOM = 6;

export default function VenuesMap() {
  const [venues, setVenues] = useState<PublicVenue[]>([]);

  useEffect(() => {
    const el = document.getElementById("venues-data");
    if (el?.textContent) {
      try {
        setVenues(JSON.parse(el.textContent));
      } catch (e) {
        console.error("Failed to parse venue data:", e);
      }
    }
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <MapContainer
        center={SA_CENTER}
        zoom={SA_ZOOM}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <VenueSearch />
        {venues.map((venue) => (
          <VenueMarker key={venue.id} venue={venue} />
        ))}
      </MapContainer>
      {venues.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "12px",
            zIndex: 1000,
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
            color: "#374151",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          {venues.length} venue{venues.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
