"use client";

import { useState } from "react";

interface FillInBlanksProps {
  isOwner?: boolean; // true if game creator is setting the question
}

export default function FillInBlanks({ isOwner = false }: FillInBlanksProps) {
  const [question, setQuestion] = useState(
    "The ___ jumps over the ___ and lands on the ___."
  );
  const [answers, setAnswers] = useState(["fox", "fence", "ground"]);
  const [inputs, setInputs] = useState(["", "", ""]);
  const [feedback, setFeedback] = useState("");

  // ---- OWNER MODE ----
  const handleOwnerChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  // ---- PLAYER MODE ----
  const handleInputChange = (index: number, value: string) => {
    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
  };

  const handleSubmit = () => {
    const correct = inputs.every(
      (val, i) => val.trim().toLowerCase() === answers[i].trim().toLowerCase()
    );

    setFeedback(
      correct
        ? "✅ All answers correct! You may proceed."
        : "❌ Some answers are incorrect. Try again."
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg mx-auto space-y-5 border border-gray-300">
      <h2 className="text-2xl font-bold text-center">
        {isOwner ? "Set Fill-in-the-Blanks Puzzle" : "Fill in the Blanks"}
      </h2>

      {/* Question */}
      <textarea
        className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-blue-500"
        rows={3}
        disabled={!isOwner}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {/* Answer Fields */}
      <div className="space-y-3">
        {isOwner ? (
          <>
            <p className="font-semibold text-gray-700">Correct Answers:</p>
            {answers.map((ans, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Answer ${i + 1}`}
                value={ans}
                onChange={(e) => handleOwnerChange(i, e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            ))}
          </>
        ) : (
          <>
            <p className="font-semibold text-gray-700">
              Fill in the blanks below:
            </p>
            {inputs.map((input, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Blank ${i + 1}`}
                value={input}
                onChange={(e) => handleInputChange(i, e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            ))}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Submit Answers
            </button>
            {feedback && (
              <p
                className={`text-center mt-3 font-semibold ${
                  feedback.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {feedback}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
