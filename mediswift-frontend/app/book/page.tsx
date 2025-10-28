"use client";
import { useMemo, useState } from "react";
import { BookingRequest, Profile } from "../core-ui/types";
import { db, generateId } from "../core-ui/storage";
import Link from "next/link";

function getPatients(profiles: Profile[]) {
  return profiles.filter((p) => p.role === "patient");
}

function getAvailableRiders(profiles: Profile[]) {
  return profiles.filter((p) => p.role === "rider");
}

export default function BookPage() {
  const profiles = db.getProfiles();
  const patients = getPatients(profiles);
  const riders = getAvailableRiders(profiles);

  const [patientId, setPatientId] = useState<string>(patients[0]?.id ?? "");
  const [pickupAddress, setPickupAddress] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [needDoctor, setNeedDoctor] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return !!patientId && !!pickupAddress && !!hospitalAddress && riders.length > 0;
  }, [patientId, pickupAddress, hospitalAddress, riders.length]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = generateId("book");
    const assignedRiderId = riders[0]?.id; // naive nearest pick
    const booking: BookingRequest = {
      id,
      patientId,
      needDoctor,
      pickupAddress,
      hospitalAddress,
      status: assignedRiderId ? "enroute_pickup" : "searching",
      assignedRiderId,
      createdAt: Date.now(),
    };
    db.upsertBooking(booking);
    setBookingId(id);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Book Ambulance</h1>
      {patients.length === 0 && (
        <div className="mb-4 text-sm text-red-600">
          No patient profile found. Please <Link className="underline" href="/register">register</Link> first.
        </div>
      )}
      {riders.length === 0 && (
        <div className="mb-4 text-sm text-amber-700">
          No riders available yet. Register a rider to simulate assignment.
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <select
          className="border rounded p-2 w-full"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        >
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.phone})
            </option>
          ))}
        </select>
        <input
          className="border rounded p-2 w-full"
          placeholder="Pickup address"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
        />
        <input
          className="border rounded p-2 w-full"
          placeholder="Hospital address"
          value={hospitalAddress}
          onChange={(e) => setHospitalAddress(e.target.value)}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={needDoctor}
            onChange={(e) => setNeedDoctor(e.target.checked)}
          />
          Need doctor in ambulance
        </label>
        <button
          className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
          disabled={!canSubmit}
          type="submit"
        >
          Request Ambulance
        </button>
      </form>
      {bookingId && (
        <div className="mt-6 text-green-700">
          Booking created. <Link className="underline" href={`/track?booking=${bookingId}`}>Track here</Link>
        </div>
      )}
    </div>
  );
}


