"use client";
import { useEffect, useMemo, useState } from "react";
import { BookingRequest, PaymentRecord } from "../core-ui/types";
import { db, generateId } from "../core-ui/storage";
import Link from "next/link";

function useQuery() {
  const [params, setParams] = useState<URLSearchParams | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setParams(new URLSearchParams(window.location.search));
    }
  }, []);
  return params;
}

export default function PaymentPage() {
  const query = useQuery();
  const bookingId = query?.get("booking") ?? "";
  const [bookings, setBookings] = useState<BookingRequest[]>(db.getBookings());
  const [payments, setPayments] = useState<PaymentRecord[]>(db.getPayments());

  useEffect(() => {
    const interval = setInterval(() => {
      setBookings(db.getBookings());
      setPayments(db.getPayments());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const booking = useMemo(() => bookings.find((b) => b.id === bookingId), [bookings, bookingId]);
  const existingPayment = useMemo(() => payments.find((p) => p.bookingId === bookingId), [payments, bookingId]);

  function createPayment() {
    if (!booking) return;
    const baseAmount = 50000; // 500.00 in minor units
    const docFee = booking.needDoctor ? 20000 : 0;
    const payment: PaymentRecord = {
      id: generateId("pay"),
      bookingId: booking.id,
      amountInMinor: baseAmount + docFee,
      currency: "INR",
      status: "pending",
      createdAt: Date.now(),
    };
    db.upsertPayment(payment);
    setPayments(db.getPayments());
  }

  function markPaid() {
    if (!existingPayment) return;
    db.upsertPayment({ ...existingPayment, status: "paid" });
    setPayments(db.getPayments());
  }

  if (!bookingId) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Payment</h1>
        <p>No booking selected. Go to <Link className="underline" href="/book">Book</Link>.</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Payment</h1>
        <p>Booking not found.</p>
      </div>
    );
  }

  const amountMinor = existingPayment?.amountInMinor ?? (50000 + (booking.needDoctor ? 20000 : 0));
  const amountDisplay = `₹${(amountMinor / 100).toFixed(2)}`;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Payment</h1>
      <div className="space-y-2">
        <div><span className="font-medium">Booking:</span> {booking.id}</div>
        <div><span className="font-medium">Total:</span> {amountDisplay}</div>
        <div><span className="font-medium">Status:</span> {existingPayment?.status ?? "not created"}</div>
      </div>
      <div className="mt-6 flex gap-3">
        {!existingPayment && (
          <button className="rounded bg-black text-white px-4 py-2" onClick={createPayment}>Create Payment</button>
        )}
        {existingPayment && existingPayment.status === "pending" && (
          <button className="rounded bg-green-700 text-white px-4 py-2" onClick={markPaid}>Mark Paid</button>
        )}
        {existingPayment && existingPayment.status === "paid" && (
          <div className="text-green-700">Payment successful.</div>
        )}
      </div>
    </div>
  );
}


