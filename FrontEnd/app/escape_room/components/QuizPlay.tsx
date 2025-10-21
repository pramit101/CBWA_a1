"use client";

import { useState } from "react";

interface QuizQuestion {
  id: number;
  question: string;
  answer: string;
}

interface QuizPlayProps {
  quiz: QuizQuestion[];
  pass: string;
  onComplete?: () => void; // optional callback for when user finishes
}

export default function QuizPlay({ quiz, pass, onComplete }: QuizPlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [access, setAccess] = useState(false);
  const [code, setCode] = useState("");

  const currentQuestion = quiz[currentIndex];

  const handleSubmit = () => {
    if (!currentQuestion) return;

    const correct =
      userAnswer.trim().toLowerCase() ===
      currentQuestion.answer.trim().toLowerCase();
    if (correct) {
      setScore(score + 1);
      setFeedback("✅ Correct!");
      setTimeout(() => {
        if (currentIndex + 1 < quiz.length) {
          setUserAnswer("");
          setFeedback("");
        } else {
          setFinished(true);
          onComplete?.(); // call callback if provided
        }
      }, 1200);
    } else {
      setFeedback(`❌ Wrong. Try again`);
      setTimeout(() => {
        setUserAnswer("");
        setFeedback("");
      }, 2000);
    }
  };

  if (quiz.length === 0) {
    return (
      <div className="p-6 bg-gray-100 rounded-xl shadow-lg text-center">
        <p className="text-gray-700 text-lg">No questions available.</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="p-6 bg-green-100 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-2">You finished the quiz!</h2>
        <p className="text-lg">
          You got <span className="font-semibold">{score}</span> out of{" "}
          <span className="font-semibold">{quiz.length}</span> correct.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter access code"
        className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={() => setAccess(code === pass)}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mb-4"
      >
        {" "}
        Submit{" "}
      </button>
      {access ? (
        <>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Question {currentIndex + 1} of {quiz.length}
          </h2>

          <p className="text-gray-800 text-lg mb-4 text-center">
            {currentQuestion.question}
          </p>

          <input
            type="text"
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
            placeholder="Your answer..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={!userAnswer.trim()}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300"
          >
            Submit
          </button>

          {feedback && (
            <p
              className={`text-center mt-4 text-lg font-semibold ${
                feedback.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {feedback}
            </p>
          )}
        </>
      ) : (
        "Enter the correct access code to start the quiz"
      )}
    </div>
  );
}
