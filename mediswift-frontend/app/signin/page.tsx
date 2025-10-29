"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OtpInput from "../components/OtpInput";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<"email" | "otp">("email");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setStage("otp");
      setSending(false);
    }, 800);
  }

  function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  }

  function onCancel() {
    router.replace("/");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-blue-50">
      <div className="absolute inset-0 pointer-events-none select-none animate-background-wave opacity-60" style={{zIndex:0}}>
        <svg viewBox="0 0 1440 700" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path className="animate-[pulse_8s_ease-in-out_infinite]" fill="#2563eb" fillOpacity="0.12" d="M0,224L1440,96L1440,700L0,700Z"/>
          <path className="animate-[pulse_10s_ease-in-out_infinite]" fill="#2563eb" fillOpacity="0.08" d="M0,384L864,320L1440,192L1440,700L0,700Z"/>
        </svg>
      </div>
      <form className="relative z-10 w-[95vw] max-w-md rounded-2xl shadow-2xl bg-white p-8 pt-10 flex flex-col gap-6 animate-fadeIn transition duration-500 ease-out border border-zinc-100" onSubmit={stage === "email" ? sendOtp : verifyOtp}>
        <h1 className="text-3xl font-extrabold text-blue-700">Sign in</h1>
        <p className="text-zinc-800 mt-1">Use your email and OTP to continue.</p>

        {stage === "email" && (
          <>
            <input
              className="border border-blue-200 text-gray-700 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex flex-col gap-3 mt-1">
              <button type="submit" disabled={!email || sending} className="w-full rounded-full bg-blue-700 text-white font-semibold px-6 py-3 transition active:scale-95 disabled:opacity-60 shadow-blue-200 shadow-md">{sending ? "Sending..." : "Send OTP"}</button>
              <button type="button" className="w-full rounded-full border border-zinc-300 px-6 py-3 bg-white text-zinc-700 hover:bg-zinc-100 transition" onClick={onCancel}>Cancel</button>
            </div>
          </>
        )}

        {stage === "otp" && (
          <>
            {/* <input
              className="border border-blue-200 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              type="text"
              placeholder="OTP (for accessibility)"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0,6))}
            /> */}
            <OtpInput value={otp} onChange={setOtp} />
            <div className="flex flex-col gap-3 mt-1">
              <button type="submit" disabled={!otp || verifying} className="w-full rounded-full bg-blue-700 text-white font-semibold px-6 py-3 transition active:scale-95 disabled:opacity-60 shadow-blue-200 shadow-md">{verifying ? "Verifying..." : "Submit"}</button>
              <button type="button" className="w-full rounded-full border border-zinc-300 px-6 py-3 bg-white text-zinc-700 hover:bg-zinc-100 transition" onClick={onCancel}>Cancel</button>
            </div>
          </>
        )}
      </form>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fadeIn { animation: fadeIn 0.7s cubic-bezier(.2,.7,.5,1) forwards; }
        @keyframes background-wave {
          0%,100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(1.03) translateY(-10px); }
        }
        .animate-background-wave { animation: background-wave 10s ease-in-out infinite alternate; }
      `}</style>
    </div>
  );
}


