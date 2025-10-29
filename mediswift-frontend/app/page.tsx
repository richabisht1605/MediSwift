"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserRole, VehicleType, Profile, RiderProfile, PatientProfile } from "./core-ui/types";
import { db, generateId } from "./core-ui/storage";

export default function OnboardingPage() {
  const router = useRouter();

  // Form states
  const [role, setRole] = useState<UserRole>("patient");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("ambulance");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [hasMedicalTraining, setHasMedicalTraining] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // ✅ Added image field
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isRider = role === "rider";

  const canSubmit = useMemo(() => {
    if (!name || !phone || !email || !address) return false;
    if (isRider && !vehicleNumber) return false;
    return true;
  }, [name, phone, email, address, isRider, vehicleNumber]);

  function handleEnter(e: React.KeyboardEvent) {
    if (e.key === "Enter") e.preventDefault();
  }

  function onCancel() {
    router.replace("/");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const id = generateId("prof");
      let profile: Profile;

      if (isRider) {
        const riderProfile: RiderProfile = {
          id,
          role: "rider",
          name,
          phone,
          email,
          vehicleType,
          vehicleNumber,
          hasMedicalTraining,
          address,
          imageUrl:
            imageUrl.trim() ||
            "https://randomuser.me/api/portraits/men/40.jpg", // ✅ default avatar
        };
        profile = riderProfile;
      } else {
        const patientProfile: PatientProfile = {
          id,
          role: "patient",
          name,
          phone,
          email,
          address,
        };
        profile = patientProfile;
      }

      db.upsertProfile(profile);
      setMessage("Registration successful!");
      setTimeout(() => router.push("/book"), 1800);
    }, 800);
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-blue-50">
      {/* Animated background */}
      <div
        className="absolute inset-0 pointer-events-none select-none animate-background-wave opacity-60"
        style={{ zIndex: 0 }}
      >
        <svg
          viewBox="0 0 1440 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            className="animate-[pulse_8s_ease-in-out_infinite]"
            fill="#2563eb"
            fillOpacity="0.12"
            d="M0,224L1440,96L1440,700L0,700Z"
          />
          <path
            className="animate-[pulse_10s_ease-in-out_infinite]"
            fill="#2563eb"
            fillOpacity="0.08"
            d="M0,384L864,320L1440,192L1440,700L0,700Z"
          />
        </svg>
      </div>

      {/* Main Form */}
      <form
        onSubmit={onSubmit}
        className="relative z-10 w-[95vw] max-w-md rounded-2xl shadow-2xl bg-white p-8 pt-10 flex flex-col gap-6 animate-fadeIn transition duration-500 ease-out border border-zinc-100"
        onKeyDown={handleEnter}
      >
        <h1 className="text-4xl font-extrabold text-blue-700 mb-0">MediSwift</h1>
        <p className="mb-2 text-zinc-800 mt-1 font-medium text-base">
          Gentle Speed, with Care.
        </p>

        {/* Common Fields */}
        <input
          className="border border-blue-200 text-gray-700 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="border border-blue-200 rounded text-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          className="border border-blue-200 rounded text-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <select
          className="border border-blue-200 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all text-zinc-700"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <option value="patient">Register as User</option>
          <option value="rider">Register as Rider</option>
        </select>

        <input
          className="border border-blue-200 text-gray-700 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        {/* Rider Extra Fields */}
        {isRider && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <select
              className="border border-blue-200 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all text-zinc-700"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as VehicleType)}
              required
            >
              <option value="ambulance">Ambulance</option>
              <option value="van">Van</option>
              <option value="suv">SUV</option>
              <option value="jeep">Jeep</option>
              <option value="minivan">Minivan</option>
            </select>

            <input
              className="border border-blue-200 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              type="text"
              placeholder="Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              required
            />

            <label className="inline-flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={hasMedicalTraining}
                onChange={(e) => setHasMedicalTraining(e.target.checked)}
              />
              Has medical training
            </label>

            <input
              className="border border-blue-200 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              type="url"
              placeholder="Image URL (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-1">
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="w-full rounded-full bg-blue-700 text-white font-semibold px-6 py-3 transition active:scale-95 disabled:opacity-60 shadow-blue-200 shadow-md"
          >
            {submitting ? "Registering..." : "Register"}
          </button>
          <button
            type="button"
            className="w-full rounded-full border border-zinc-300 px-6 py-3 bg-white text-zinc-700 hover:bg-zinc-100 transition"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>

        <div className="text-center text-sm text-zinc-600 mt-2">
          Already a user?{" "}
          <Link className="text-blue-700 underline" href="/signin">
            Sign in
          </Link>
        </div>

        {message && (
          <p className="text-green-700 text-center mt-4 animate-fadeIn">
            {message}
          </p>
        )}
      </form>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s cubic-bezier(0.2, 0.7, 0.5, 1) forwards;
        }
        @keyframes background-wave {
          0%,
          100% {
            transform: scaleY(1) translateY(0);
          }
          50% {
            transform: scaleY(1.03) translateY(-10px);
          }
        }
        .animate-background-wave {
          animation: background-wave 10s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}
