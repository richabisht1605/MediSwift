"use client";
import { useEffect, useMemo, useState } from "react";
import { Profile, UserRole, VehicleType } from "../core-ui/types";
import { db, generateId } from "../core-ui/storage";

function useQueryRole(): UserRole | null {
  const [role, setRole] = useState<UserRole | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const r = new URLSearchParams(window.location.search).get("role");
    if (r === "patient" || r === "rider") setRole(r);
  }, []);
  return role;
}

export default function RegisterPage() {
  const qpRole = useQueryRole();
  const [role, setRole] = useState<UserRole>("patient");
  useEffect(() => {
    if (qpRole) setRole(qpRole);
  }, [qpRole]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("ambulance");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [hasMedicalTraining, setHasMedicalTraining] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isRider = role === "rider";

  const canSubmit = useMemo(() => {
    if (!name || !phone || !email || !address) return false;
    if (isRider) return !!vehicleNumber;
    return true;
  }, [name, phone, email, address, isRider, vehicleNumber]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = generateId("prof");
    let profile: Profile;
    if (isRider) {
      profile = {
        id,
        role: "rider",
        name,
        phone,
        email,
        vehicleType,
        vehicleNumber,
        hasMedicalTraining,
        address,
      };
    } else {
      profile = { id, role: "patient", name, phone, email, address };
    }
    db.upsertProfile(profile);
    setMessage("Profile saved.");
  }

  return (
    <div className="min-h-[80vh] grid place-items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 animate-pulse" />
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow p-6">
      <h1 className="text-2xl font-semibold mb-4">Create your MediSwift account</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex gap-4">
          <select
            className="border rounded p-2"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value="patient">Register as User</option>
            <option value="rider">Register as Rider</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="border rounded p-2"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border rounded p-2"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="border rounded p-2 sm:col-span-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border rounded p-2 sm:col-span-2"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {isRider && (
            <>
              <select
                className="border rounded p-2"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as VehicleType)}
              >
                <option value="ambulance">Ambulance</option>
                <option value="hatchback">Hatchback</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="van">Van</option>
              </select>
              <input
                className="border rounded p-2"
                placeholder="Vehicle number"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
              />
              <label className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={hasMedicalTraining}
                  onChange={(e) => setHasMedicalTraining(e.target.checked)}
                />
                Has medical training
              </label>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <a href="/" className="rounded border border-zinc-300 px-4 py-2">
            Cancel
          </a>
          <button
            className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
            disabled={!canSubmit}
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
      {message && <p className="text-green-600 mt-4">{message}</p>}
      </div>
    </div>
  );
}


