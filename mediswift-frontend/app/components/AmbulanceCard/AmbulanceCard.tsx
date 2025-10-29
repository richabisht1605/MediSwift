import Image from "next/image";
import { RiderProfile } from "@/app/core-ui/types";

interface AmbulanceCardProps {
  rider?: RiderProfile; // ✅ optional for mock fallback
  distanceKm?: number;
  onSelect?: () => void;
}

export default function AmbulanceCard({
  rider,
  distanceKm,
  onSelect,
}: AmbulanceCardProps) {
  // ✅ Mock data fallback
  const mockRider: RiderProfile = {
    id: "mock1",
    name: "City Ambulance Service",
    vehicleType: "van",
    vehicleNumber: "DL 09 XY 7890",
    role: "rider",
    imageUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    phone: "+91 9876543210",
    email: "cityambulance@example.com",
    hasMedicalTraining: true,
    address: "Connaught Place, New Delhi",
  };

  const displayRider = rider || mockRider;

  return (
    <div className="w-full border rounded-xl shadow-md overflow-hidden text-center bg-white hover:shadow-lg transition">
      {/* Ambulance Image */}
      <div className="relative w-full aspect-square">
        <Image
          src={displayRider.imageUrl}
          alt={displayRider.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Rider Details */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {displayRider.name}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {displayRider.vehicleType.toUpperCase()} •{" "}
          {displayRider.vehicleNumber}
        </p>

        {distanceKm && (
          <p className="text-sm text-gray-500 mt-1">
            Distance: {distanceKm.toFixed(1)} km away
          </p>
        )}

        <p className="text-xs text-gray-500 mt-1">{displayRider.address}</p>

        {/* Book Button */}
        <button
          onClick={onSelect || (() => alert(`Booking ${displayRider.name} 🚑`))}
          className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg mt-3 hover:bg-blue-700 transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
