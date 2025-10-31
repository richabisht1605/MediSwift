import Link from "next/link";
import Image from "next/image";

interface RiderCardProps {
  id: string;
  name: string;
  imageUrl: string;
}

export default function RiderCard({ id, name, imageUrl }: RiderCardProps) {
  return (
    <div className="w-64 border rounded-xl shadow-md overflow-hidden text-center bg-white">
      <div className="relative w-full aspect-square">
        <Image src={imageUrl} alt={name} fill className="object-cover" />
      </div>

      <h2 className="text-lg font-semibold mt-3">{name}</h2>

      <Link href={`/ambulances/${id}`} className="block my-3">
        <button className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition w-full">
          Book Now
        </button>
      </Link>
    </div>
  );
}
