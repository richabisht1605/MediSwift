"use client";
import { useEffect, useMemo, useRef } from "react";

type Props = {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
};

export default function OtpInput({ length = 6, value, onChange, disabled }: Props) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const digits = useMemo(() => {
    const clean = (value || "").replace(/\D/g, "").slice(0, length);
    return Array.from({ length }, (_, i) => clean[i] ?? "");
  }, [value, length]);

  useEffect(() => {
    // ensure array size
    inputsRef.current = inputsRef.current.slice(0, length);
  }, [length]);

  function setDigitAt(index: number, char: string) {
    const clean = char.replace(/\D/g, "").slice(0, 1);
    const arr = [...digits];
    arr[index] = clean;
    const joined = arr.join("");
    onChange(joined);
    if (clean && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function onKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && inputsRef.current[index - 1]) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && inputsRef.current[index - 1]) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && inputsRef.current[index + 1]) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  }

  return (
    <div className="flex items-center gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-12 text-center text-lg border border-blue-200 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={d}
          onChange={(e) => setDigitAt(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}


