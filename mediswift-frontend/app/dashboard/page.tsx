"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AmbulanceCard from "../components/AmbulanceCard/AmbulanceCard";
import { Profile, RiderProfile } from "../core-ui/types";
import "leaflet/dist/leaflet.css";

const defaultCenter: [number, number] = [28.6139, 77.2090]; // New Delhi

// ✅ Fake Rider Data (mocked)
const mockRiders: RiderProfile[] = [
  {
    id: "r1",
    name: "Metro Ambulance",
    vehicleType: "van",
    vehicleNumber: "DL 02 AB 1122",
    role: "rider",
    imageUrl: "https://randomuser.me/api/portraits/men/44.jpg",
    phone: "+91 9876501234",
    email: "metroambulance@example.com",
    hasMedicalTraining: true,
    address: "Karol Bagh, New Delhi",
  },
  {
    id: "r2",
    name: "Emergency Lifeline",
    vehicleType: "suv",
    vehicleNumber: "DL 05 CD 2233",
    role: "rider",
    imageUrl: "https://randomuser.me/api/portraits/women/47.jpg",
    phone: "+91 8765432109",
    email: "lifeline@example.com",
    hasMedicalTraining: true,
    address: "Saket, New Delhi",
  },
  {
    id: "r3",
    name: "Rapid Response Ambulance",
    vehicleType: "van",
    vehicleNumber: "DL 10 EF 3344",
    role: "rider",
    imageUrl: "https://randomuser.me/api/portraits/men/50.jpg",
    phone: "+91 7896543210",
    email: "rapidresponse@example.com",
    hasMedicalTraining: true,
    address: "Rohini, New Delhi",
  },
];

export default function DashboardPage() {
  const [riders] = useState<RiderProfile[]>(mockRiders);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapRef.current || leafletMapRef.current) return;

    import("leaflet").then((L) => {
      const map = L.map(mapRef.current!).setView(defaultCenter, 12);
      leafletMapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      riders.forEach((r, idx) => {
        const pos: [number, number] = [
          defaultCenter[0] + idx * 0.01,
          defaultCenter[1] + idx * 0.01,
        ];

        L.marker(pos)
          .addTo(map)
          .bindPopup(`${r.name} • ${r.vehicleType.toUpperCase()} (${r.vehicleNumber})`);
      });
    });

    return () => {
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
    };
  }, [riders]);

  const handleBook = (riderName: string) => {
    alert(`Booking confirmed with ${riderName}! 🚑`);
  };

  return (
    <div className=" w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-3">
          <h1 className="text-2xl font-extrabold text-blue-700">Dashboard</h1>
          <p className="text-zinc-700 mt-1">
            Your location with nearby ambulances.
          </p>
        </div>

        {/* Map */}
        <div className="px-6">
          <div
            ref={mapRef}
            className="w-full h-[360px] rounded-xl overflow-hidden border border-zinc-200"
          />
        </div>

        {/* Rider Cards */}
        <div className="p-6 mt-4">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">
            Available Ambulances
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {riders.map((r, idx) => (
              <AmbulanceCard
                key={r.id}
                rider={r}
                distanceKm={1.5 + idx * 0.7}
                onSelect={() => handleBook(r.name)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
