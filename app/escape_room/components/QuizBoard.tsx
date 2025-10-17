"use client";
import { useState } from "react";

interface QuizQuestion {
  id: number;
  question: string;
  answer: string;
}

interface QuizBoardProps {
  quiz: QuizQuestion[];
  setQuiz: React.Dispatch<React.SetStateAction<QuizQuestion[]>>;
}

export default function QuizBoard({ quiz, setQuiz }: QuizBoardProps) {
  const [nextId, setNextId] = useState(1);

  const addQuestion = () => {
    if (quiz.length > 4) return; // Limit to 5 questions
    setQuiz([...quiz, { id: nextId, question: "", answer: "" }]);
    setNextId(nextId + 1);
  };

  const updateQuestion = (
    id: number,
    field: "question" | "answer",
    value: string
  ) => {
    setQuiz(quiz.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const removeQuestion = (id: number) => {
    setQuiz(quiz.filter((q) => q.id !== id));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Quiz Board</h1>
      <button
        onClick={addQuestion}
        className={`mb-4 px-4 py-2 ${
          quiz.length > 4 ? "bg-gray-600" : "bg-blue-600 hover:bg-green-700"
        }  text-white rounded-lg  transition`}
      >
        Add Question (Max 5)
      </button>

      <div className="space-y-4 overflow-scroll max-h-50">
        {quiz.map((q) => (
          <div
            key={q.id}
            className="bg-white p-4 rounded-lg shadow flex flex-col gap-2"
          >
            <input
              type="text"
              placeholder="Enter question"
              value={q.question}
              onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Enter correct answer"
              value={q.answer}
              onChange={(e) => updateQuestion(q.id, "answer", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={() => removeQuestion(q.id)}
              className="self-end px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {quiz.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Preview</h2>
          <ul className="list-disc list-inside">
            {quiz.map((q) => (
              <li key={q.id}>
                <strong>{q.question}</strong> - <span>{q.answer}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
