import { BookingRequest, PaymentRecord, Profile } from "./types";

const isBrowser = typeof window !== "undefined";

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

const KEYS = {
  profiles: "mediswift_profiles",
  bookings: "mediswift_bookings",
  payments: "mediswift_payments",
};

export const db = {
  getProfiles(): Profile[] {
    return readJson<Profile[]>(KEYS.profiles, []);
  },
  saveProfiles(profiles: Profile[]) {
    writeJson(KEYS.profiles, profiles);
  },
  upsertProfile(profile: Profile) {
    const profiles = db.getProfiles();
    const idx = profiles.findIndex((p) => p.id === profile.id);
    if (idx >= 0) profiles[idx] = profile; else profiles.push(profile);
    db.saveProfiles(profiles);
  },

  getBookings(): BookingRequest[] {
    return readJson<BookingRequest[]>(KEYS.bookings, []);
  },
  saveBookings(bookings: BookingRequest[]) {
    writeJson(KEYS.bookings, bookings);
  },
  upsertBooking(booking: BookingRequest) {
    const bookings = db.getBookings();
    const idx = bookings.findIndex((b) => b.id === booking.id);
    if (idx >= 0) bookings[idx] = booking; else bookings.push(booking);
    db.saveBookings(bookings);
  },

  getPayments(): PaymentRecord[] {
    return readJson<PaymentRecord[]>(KEYS.payments, []);
  },
  savePayments(payments: PaymentRecord[]) {
    writeJson(KEYS.payments, payments);
  },
  upsertPayment(payment: PaymentRecord) {
    const payments = db.getPayments();
    const idx = payments.findIndex((p) => p.id === payment.id);
    if (idx >= 0) payments[idx] = payment; else payments.push(payment);
    db.savePayments(payments);
  },
};

export function generateId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${random}`;
}

