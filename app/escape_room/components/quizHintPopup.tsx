// components/HintPopup.tsx
import React from "react";

interface HintPopupProps {
  hint: string;
  onClose: () => void;
}

const QuizHintPopup: React.FC<HintPopupProps> = ({ hint, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose} // click outside closes
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 max-w-md w-full"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <h2 className="text-xl font-bold text-center">Hint</h2>
        <p className="text-gray-700">{hint}</p>
        <button
          onClick={onClose}
          className="self-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QuizHintPopup;
