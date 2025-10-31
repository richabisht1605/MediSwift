"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function AmbulanceDetailsPage() {
  const { id } = useParams();

  useEffect(() => {
    const map = L.map("ambulanceMap").setView([28.6139, 77.209], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const ambulanceIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/296/296216.png",
      iconSize: [35, 35],
    });

    L.marker([28.6139, 77.209], { icon: ambulanceIcon })
      .addTo(map)
      .bindPopup("Ambulance is on the way 🚑")
      .openPopup();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 border border-zinc-100">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">
          Ambulance Details – {id}
        </h1>
        <p className="text-gray-600 mb-4">
          Tracking real-time ambulance location and details.
        </p>

        {/* Map Section */}
        <div
          id="ambulanceMap"
          className="w-full h-[350px] rounded-xl border mb-6"
        />

        {/* Info Section */}
        <div className="mt-4 space-y-3 text-base">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Rider Name:</span>
            <span className="text-gray-600">Metro Ambulance</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Vehicle:</span>
            <span className="text-gray-600">Van (DL 02 AB 1122)</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">
              Estimated Arrival:
            </span>
            <span className="text-gray-600">12 mins</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Charges:</span>
            <span className="text-gray-600">₹250</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Phone:</span>
            <span className="text-gray-600">+91 9876501234</span>
          </div>
        </div>

        <button className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition w-full">
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
