import Image from "next/image";

interface RiderCardProps {
  name: string;
  imageUrl: string;
  onBook?: () => void;
}

export default function RiderCard({ name, imageUrl, onBook }: RiderCardProps) {
  return (
    <div className="w-64 border rounded-xl shadow-md overflow-hidden text-center bg-white">
      <div className="relative w-full aspect-square">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <h2 className="text-lg font-semibold mt-3">{name}</h2>
      <button
        onClick={onBook}
        className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg my-3 hover:bg-blue-700 transition"
      >
        Book Now
      </button>
    </div>
  );
}
