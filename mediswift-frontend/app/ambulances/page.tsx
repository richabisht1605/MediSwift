"use client";

import { useEffect, useState } from "react";
import AmbulanceCard from "../components/AmbulanceCard/AmbulanceCard";
import { RiderProfile } from "../core-ui/types";
// import AmbulanceCard from "@/components/AmbulanceCard/AmbulanceCard";
// import { RiderProfile } from "@/core-ui/types";

export default function AllAmbulancesPage() {
  const [ambulances, setAmbulances] = useState<RiderProfile[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  // 🩺 Mock Data (same format as Dashboard)
  useEffect(() => {
    const mockData: RiderProfile[] = Array.from({ length: 40 }, (_, i) => ({
      id: `a${i + 1}`,
      name: `Ambulance Service ${i + 1}`,
      vehicleType: i % 2 === 0 ? "van" : "suv",
      vehicleNumber: `DL 0${i} AB ${1000 + i}`,
      role: "rider",
      imageUrl: `https://randomuser.me/api/portraits/${
        i % 2 === 0 ? "men" : "women"
      }/${i + 10}.jpg`,
      phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `ambulance${i + 1}@example.com`,
      hasMedicalTraining: i % 2 === 0,
      address: ["Karol Bagh", "Saket", "Rohini", "Connaught Place"][i % 4],
      location: ["Delhi", "Noida", "Gurgaon", "Faridabad"][i % 4],
    }));

    setAmbulances(mockData);
  }, []);

  // 🚀 Infinite scroll logic
  const loadMoreAmbulances = () => {
    if (visibleCount < ambulances.length) {
      setVisibleCount((prev) => prev + 10);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
        loadMoreAmbulances();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, ambulances.length, visibleCount]);

  return (
    <div className="w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-3">
          <h1 className="text-2xl font-extrabold text-blue-700">
            All Ambulances
          </h1>
          <p className="text-zinc-700 mt-1">
            Explore all available ambulance services in your region.
          </p>
        </div>

        {/* Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ambulances.slice(0, visibleCount).map((r) => (
              <AmbulanceCard
                key={r.id}
                rider={r}
                distanceKm={Math.floor(Math.random() * 10) + 1}
                onSelect={() => window.location.assign(`/ambulances/${r.id}`)}
              />
            ))}
          </div>

          {/* Loading or End Message */}
          {hasMore ? (
            <p className="text-center text-blue-600 mt-4 animate-pulse">
              Loading more ambulances...
            </p>
          ) : (
            <p className="text-center text-gray-500 mt-4">
              No more ambulances available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
