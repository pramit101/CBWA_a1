"use client";

import { useState } from "react";
import { Delete } from "lucide-react";

interface KeypadProps {
  correctCode: string;
  onSuccess?: () => void;
}

export default function Keypad({ correctCode, onSuccess }: KeypadProps) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleNumberClick = (num: string) => {
    if (input.length < correctCode.length) {
      const newInput = input + num;
      setInput(newInput);

      // Check if correct
      if (newInput === correctCode) {
        setStatus("success");
        onSuccess?.();
      }
    }
  };

  const handleDelete = () => {
    setInput(input.slice(0, -1));
    setStatus("idle");
  };

  const handleClear = () => {
    setInput("");
    setStatus("idle");
  };

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="w-full max-w-sm">
        {/* Title */}
        <h1
          role="heading"
          className="text-center text-3xl font-bold text-cyan-400 mb-8 tracking-wider font-mono"
        >
          ACCESS KEYPAD
        </h1>

        {/* Display */}
        <div className="bg-slate-950 border-2 border-cyan-400 rounded-lg p-6 mb-8 shadow-lg shadow-cyan-400/50">
          <div className="text-center">
            <p className="text-cyan-400 text-sm font-mono mb-2 opacity-75">
              CODE INPUT
            </p>
            <div className="text-4xl font-mono text-cyan-300 tracking-widest min-h-12 flex items-center justify-center">
              {input
                .padEnd(correctCode.length, "•")
                .split("")
                .map((char, i) => (
                  <span
                    key={i}
                    className={`${
                      i < input.length
                        ? "text-cyan-400 animate-pulse"
                        : "text-slate-600"
                    }`}
                  >
                    {char}
                  </span>
                ))}
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-6 text-center min-h-6">
            {status === "success" && (
              <p className="text-green-400 font-mono font-bold text-lg animate-pulse">
                PASS
              </p>
            )}
            {status === "error" && (
              <p className="text-red-400 font-mono font-bold text-lg animate-pulse">
                DENIED
              </p>
            )}
            {status === "idle" && input.length > 0 && (
              <p className="text-yellow-400 font-mono text-sm">
                {correctCode.length - input.length} more digits...
              </p>
            )}
          </div>
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              disabled={status === "success"}
              className={`py-4 rounded-lg font-mono font-bold text-xl transition-all duration-200 ${
                status === "success"
                  ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                  : "bg-cyan-500 text-slate-900 hover:bg-cyan-400 active:scale-95 hover:shadow-lg hover:shadow-cyan-400/50 border border-cyan-300"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDelete}
            disabled={status === "success" || input.length === 0}
            className={`py-4 rounded-lg font-mono font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              status === "success" || input.length === 0
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-500 active:scale-95 hover:shadow-lg hover:shadow-red-600/50 border border-red-400"
            }`}
          >
            <Delete size={20} /> DEL
          </button>

          <button
            onClick={handleClear}
            disabled={status === "success" || input.length === 0}
            className={`py-4 rounded-lg font-mono font-bold transition-all duration-200 ${
              status === "success" || input.length === 0
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-orange-600 text-white hover:bg-orange-500 active:scale-95 hover:shadow-lg hover:shadow-orange-600/50 border border-orange-400"
            }`}
          >
            CLR
          </button>
        </div>
      </div>
    </div>
  );
}
