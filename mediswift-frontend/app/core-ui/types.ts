export type UserRole = "patient" | "rider";

export type VehicleType = "hatchback" | "sedan" | "suv" | "van" | "ambulance";

export interface PatientProfile {
  id: string;
  role: "patient";
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface RiderProfile {
  id: string;
  role: "rider";
  name: string;
  phone: string;
  email: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  hasMedicalTraining: boolean;
  address: string;
}

export type Profile = PatientProfile | RiderProfile;

export interface BookingRequest {
  id: string;
  patientId: string;
  needDoctor: boolean;
  pickupAddress: string;
  hospitalAddress: string;
  status: "searching" | "enroute_pickup" | "arrived_pickup" | "enroute_hospital" | "arrived_hospital" | "completed" | "cancelled";
  assignedRiderId?: string;
  createdAt: number;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  amountInMinor: number; // e.g. cents
  currency: string; // e.g. INR
  status: "pending" | "paid" | "failed";
  createdAt: number;
}

