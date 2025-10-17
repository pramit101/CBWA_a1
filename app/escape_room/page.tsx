"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, Key } from "lucide-react";
import styles from "./page.module.css";
import Keypad from "./components/keypad";
import HintPopup from "./components/Hint";
import HelpPopup from "./components/Help";
import QuizBoard from "./components/QuizBoard";
import QuizPlay from "./components/QuizPlay";
import QuizHintPopup from "./components/quizHintPopup";
import FillInBlanks from "./components/FillBlanks";
import SequencePuzzle from "./components/sequence";

interface Layer {
  id: number;
  name: string;
  background: number;
}

interface QuizQuestion {
  id: number;
  question: string;
  answer: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]; // make a copy so original is not mutated
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
export default function EscapeRoom() {
  const [layers, setLayers] = useState<Layer[]>([
    { id: 1, name: "Layer 1", background: 0 },
  ]);
  const [currentLayerId, setCurrentLayerId] = useState(1);
  const [currentBgID, setCurrentBgID] = useState(1);
  const [layerCount, setLayerCount] = useState(1);
  const [showLayerInput, setShowLayerInput] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [confirmedCode, setConfirmedCode] = useState("");
  const [preview, setPreview] = useState(false);
  const [hint, setHint] = useState("");
  const [helpContent, setHelpContent] = useState("");
  const [quizUnlock, setQuizUnlock] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [h1, setH1] = useState("");
  const [h2, setH2] = useState("");
  const [h3, setH3] = useState("");
  const [keyCount, setKeyCount] = useState(0);
  const [k1, setK1] = useState(false);
  const [k2, setK2] = useState(false);
  const [k3, setK3] = useState(false);
  const [HQ, setHQ] = useState("");
  const [HA, setHA] = useState("");
  const [UA, setUA] = useState("");
  const [chunks, setChunks] = useState<string[]>([" ", " ", " ", " ", " "]);

  const handleSetCode = () => {
    if (codeInput.trim() !== "") {
      setConfirmedCode(codeInput.trim());
    }
  };

  const backgrounds = [
    "/Images/l1.png",
    "/Images/l2.png",
    "/Images/l3.png",
    "/Images/l4.png",
    "/Images/l6.png",
  ];

  const backgroundNames = [
    "Entrance",
    "Lobby",
    "The archive",
    "Data center",
    "Exit",
  ];

  const currentLayer = layers.find((l) => l.id === currentLayerId);
  const currentBgIndex = currentLayer?.background || 0;
  const [popup, setPopup] = useState<string | null>(null);

  const Buttons = () => {
    if (currentBgID == 1) {
      return (
        <div className="relative w-full h-full">
          <button
            onClick={() => setPopup("keypad")}
            className={styles.plusIcon}
            style={{
              position: "absolute",
              left: `46%`,
              top: `45%`,
              width: `8%`,
              height: "10%",
              zIndex: 20,
              cursor: "pointer",
            }}
          />
          <button
            onClick={() => setPopup("symbols")}
            className={styles.plusIcon}
            style={{
              position: "absolute",
              left: `72%`,
              top: `15%`,
              width: `15%`,
              height: "35%",
              zIndex: 20,
              cursor: "pointer",
            }}
          />

          <button
            onClick={() => setPopup("help")}
            className={styles.plusIcon}
            style={{
              position: "absolute",
              left: `68%`,
              top: `58%`,
              width: `18%`,
              height: "15%",
              zIndex: 20,
              cursor: "pointer",
            }}
          />
        </div>
      );
    } else if (currentBgID == 2) {
      return (
        <div className="relative w-full h-full">
          <button
            onClick={() => setPopup("quizpad")}
            className={styles.plusIcon}
            style={{
              position: "absolute",
              left: `46%`,
              top: `60%`,
              width: `8%`,
              height: "10%",
              zIndex: 20,
              cursor: "pointer",
            }}
          />
          <button
            onClick={() => setPopup("quizHint")}
            className={styles.plusIcon}
            style={{
              position: "absolute",
              left: `10%`,
              top: `32%`,
              width: `35%`,
              height: "35%",
              zIndex: 20,
              cursor: "pointer",
            }}
          />
        </div>
      );
    } else if (currentBgID == 3) {
      return (
        <div className="relative w-full h-full">
          <button
            onClick={() => setPopup("h1")}
            className={styles.plusIcon}
            style={{
              position: "absolute",
              left: `87%`,
              top: `17%`,
              width: `6%`,
              height: "20%",
              zIndex: 20,
              cursor: "pointer",
            }}
          />
          <button
            onClick={() => setPopup("FillBlanks")}
            className={styles.plusIcon}
            style={{
              position: "absolute",
              left: `42%`,
              top: `25%`,
              width: `20%`,
              height: "40%",
              zIndex: 20,
              cursor: "pointer",
            }}
          />
          <button
            onClick={() => setPopup("h2")}
            className={styles.plusIcon}
            style={{
              position: "absolute",
              left: `15%`,
              top: `1%`,
              width: `5%`,
              height: "10%",
              zIndex: 20,
              cursor: "pointer",
            }}
          />
          <button
            onClick={() => setPopup("h3")}
            className={styles.plusIcon}
            style={{
              position: "absolute",
              left: `12%`,
              top: `76%`,
              width: `10%`,
              height: "10%",
              zIndex: 20,
              cursor: "pointer",
            }}
          />
        </div>
      );
    } else if (currentBgID == 4) {
      return (
        <div className="relative w-full h-full">
          <button
            className={`${preview && !k1 ? "opacity-0" : "opacity-100"}`}
            onClick={() => {
              setPopup("key");
              setK1(true);
              if (!k1) {
                setKeyCount(keyCount + 1);
              }
            }}
            style={{
              position: "absolute",
              left: `75%`,
              top: `25%`,
              width: `6%`,
              height: "20%",
              zIndex: 20,
              cursor: "pointer",
            }}
          >
            <Key
              size={40}
              className="text-amber-400 drop-shadow-[0_0_8px_rgba(255,193,7,0.8)] 
                   cursor-pointer animate-bounce-slow hover:scale-110 
                   transition-transform duration-300"
            />
          </button>
          <button
            onClick={() => setPopup("hiddenQuestion")}
            className={styles.plusIcon}
            style={{
              position: "absolute",
              left: `42%`,
              top: `25%`,
              width: `20%`,
              height: "40%",
              zIndex: 20,
              cursor: "pointer",
            }}
          />
          <button
            onClick={() => {
              setPopup("key");
              setK2(true);
              if (!k2) {
                setKeyCount(keyCount + 1);
              }
            }}
            className={`${preview && !k2 ? "opacity-0" : "opacity-100"}`}
            style={{
              position: "absolute",
              left: `15%`,
              top: `35%`,
              width: `5%`,
              height: "10%",
              zIndex: 20,
              cursor: "pointer",
            }}
          >
            {" "}
            <Key
              size={40}
              className="text-amber-400 drop-shadow-[0_0_8px_rgba(255,193,7,0.8)] 
               cursor-pointer animate-bounce-slow hover:scale-110 
               transition-transform duration-300"
            />
          </button>

          <button
            onClick={() => {
              setPopup("key");
              setK3(true);
              if (!k3) {
                setKeyCount(keyCount + 1);
              }
            }}
            className={`${preview && !k3 ? "opacity-0" : "opacity-100"}`}
            style={{
              position: "absolute",
              left: `38%`,
              top: `15%`,
              width: `10%`,
              height: "10%",
              zIndex: 20,
              cursor: "pointer",
            }}
          >
            {" "}
            <Key
              size={40}
              className="text-amber-400 drop-shadow-[0_0_8px_rgba(255,193,7,0.8)] 
               cursor-pointer animate-bounce-slow hover:scale-110 
               transition-transform duration-300"
            />
          </button>
        </div>
      );
    } else if (currentBgID == 5) {
      return (
        <button
          onClick={() => setPopup("sequence")}
          className={styles.plusIcon}
          style={{
            position: "absolute",
            left: `35%`,
            top: `60%`,
            width: `30%`,
            height: "20%",
            zIndex: 20,
            cursor: "pointer",
          }}
        />
      );
    }
  };

  const handleUpdateLayerCount = (count: number) => {
    if (count < 1 || count > 5) return;

    setLayerCount(count);

    if (count > layers.length) {
      // Add new layers
      const newLayers = [];
      for (let i = layers.length + 1; i <= count; i++) {
        newLayers.push({
          id: i,
          name: `Layer ${i}`,
          background: 0,
        });
      }
      setLayers([...layers, ...newLayers]);
    } else if (count < layers.length) {
      // Remove layers from the end
      const updatedLayers = layers.slice(0, count);
      setLayers(updatedLayers);
      // Reset current layer if it was removed
      if (currentLayerId > count) {
        setCurrentLayerId(updatedLayers[updatedLayers.length - 1].id);
      }
    }
  };

  const handleBackgroundChange = (index: number) => {
    setCurrentBgID(index + 1);
    if (currentLayer) {
      setLayers(
        layers.map((l) =>
          l.id === currentLayerId ? { ...l, background: index } : l
        )
      );
    }
  };

  const handleLayerSwitch = (id: number) => {
    setCurrentLayerId(id);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Canvas Area */}
      <div className="flex-1 p-8 resize-none">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Escape Room Builder
            </h1>
            <p className="text-gray-600">
              Currently editing:{" "}
              <span className="font-semibold">{currentLayer?.name}</span>
            </p>
          </div>

          {/* Canvas */}
          <div className="relative flex-1 h-[500px] w-260 rounded-lg resize-none shadow-2xl border-4 border-gray-300 cursor-crosshair overflow-hidden">
            <Image
              src={backgrounds[currentBgIndex]}
              alt="Golden key"
              fill
              className="object-cover rounded-lg overflow-hidden resize-none"
            />

            <Buttons />
            {popup === "keypad" && (
              <div
                className="fixed inset-0 flex items-center justify-center z-30"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                onClick={() => {
                  setPopup(null);
                  setPreview(false);
                }}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                  <h2 className="text-xl font-bold mb-4 text-center">
                    Set the pass code (4-digits)
                  </h2>
                  <input
                    type="text"
                    placeholder="Set the code to pass"
                    value={codeInput}
                    onChange={(e) => {
                      setCodeInput(e.target.value);
                    }}
                  />
                  <button
                    onClick={handleSetCode}
                    className="bg-blue-500 text-white ml-4 px-4 py-2 rounded"
                  >
                    {confirmedCode ? "Change Code" : "Set Code"}
                  </button>
                  <button
                    onClick={() => setPreview(!preview)}
                    className="bg-green-500 text-white ml-4 px-4 py-2 rounded"
                  >
                    Preview
                  </button>
                  {preview ? <Keypad correctCode={codeInput} /> : ""}
                  <button
                    onClick={() => setPopup(null)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            {(popup === "symbols" || popup == "quizHint") && (
              <div
                className="absolute inset-0 flex items-center justify-center z-30"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                onClick={() => {
                  setPopup(null);
                  setPreview(false);
                }}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg flex space-y-5 flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-xl font-bold mb-4">Hint</h2>
                  {popup == "symbols" ? (
                    <textarea
                      placeholder="Place the hint to acess the keypad password"
                      className="p-2"
                      onChange={(e) => setHint(e.target.value)}
                      value={hint}
                    ></textarea>
                  ) : (
                    <textarea
                      placeholder="Place the hint to acess the quiz"
                      className="p-2"
                      onChange={(e) => setQuizUnlock(e.target.value)}
                      value={quizUnlock}
                    ></textarea>
                  )}

                  <button
                    onClick={() => {
                      setPreview(!preview);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => {
                      setPopup(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Close
                  </button>
                  {preview && popup == "symbols" ? (
                    <HintPopup
                      hint={hint}
                      onClose={() => {
                        setPopup(null);
                        setPreview(false);
                      }}
                    />
                  ) : preview && popup == "quizHint" ? (
                    <QuizHintPopup
                      hint={quizUnlock}
                      onClose={() => {
                        setPopup(null);
                        setPreview(false);
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
            {popup === "help" && (
              <div
                className="absolute inset-0 flex items-center justify-center z-30"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                onClick={() => {
                  setPopup(null);
                  setPreview(false);
                }}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg flex space-y-5 flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-xl font-bold mb-4">Help</h2>
                  <textarea
                    placeholder="Place the Help description on how to play and navigate through the escape room"
                    className="p-2"
                    rows={6}
                    onChange={(e) => setHelpContent(e.target.value)}
                    value={helpContent}
                  ></textarea>
                  <button
                    onClick={() => {
                      setPreview(!preview);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => {
                      setPopup(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Close
                  </button>
                  {preview ? (
                    <HelpPopup
                      content={helpContent}
                      onClose={() => {
                        setPopup(null);
                        setPreview(false);
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
            {popup === "quizpad" && (
              <div
                className="fixed inset-0 flex items-center justify-center z-30"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                onClick={() => {
                  setPopup(null);
                  setPreview(false);
                }}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                  {preview ? (
                    <QuizPlay quiz={quiz} pass={quizUnlock} />
                  ) : (
                    <>
                      <h2 className="text-xl font-bold mb-4 text-center">
                        Set the correct answer to unlock quiz
                      </h2>
                      <input
                        type="text"
                        placeholder="Set the answer"
                        className="p-2"
                        value={quizUnlock}
                        onChange={(e) => {
                          setQuizUnlock(e.target.value);
                        }}
                      />
                      <button
                        onClick={handleSetCode}
                        className="bg-blue-500 text-white ml-4 px-4 py-2 m-2 rounded"
                      >
                        {confirmedCode ? "Change Answer" : "Set Answer"}
                      </button>
                      <QuizBoard quiz={quiz} setQuiz={setQuiz} />
                      <button
                        onClick={() => setPreview(!preview)}
                        className="bg-green-500 text-white ml-4 mt-2 px-4 py-2 rounded"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => setPopup(null)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
                      >
                        Close
                      </button>{" "}
                    </>
                  )}
                </div>
              </div>
            )}
            {popup === "FillBlanks" && (
              <div
                className="fixed inset-0 flex items-center justify-center z-30"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                onClick={() => {
                  setPopup(null);
                  setPreview(false);
                }}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                  <>
                    <h2 className="text-xl font-bold mb-4 text-center">
                      Set the correct answer to unlock quiz
                    </h2>
                    <FillInBlanks isOwner={!preview} />
                    <button
                      onClick={() => setPreview(!preview)}
                      className="bg-green-500 text-white ml-4 mt-2 px-4 py-2 rounded"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setPopup(null)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
                    >
                      Close
                    </button>{" "}
                  </>
                </div>
              </div>
            )}
            {(popup === "h1" || popup == "h2" || popup == "h3") && (
              <>
                <div
                  className="fixed inset-0 flex items-center justify-center z-30"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                  onClick={() => {
                    setPopup(null);
                    setPreview(false);
                  }}
                >
                  <div
                    className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                  >
                    <h2 className="font-bold mb-4 text-center text-xl">
                      {popup == "h1"
                        ? "Hint 1"
                        : popup == "h2"
                        ? "Hint 2"
                        : "Hint 3"}
                    </h2>
                    {popup == "h1" ? (
                      <textarea
                        placeholder="Place the hint 1 description here"
                        className={`p-2 w-full border-gray-300 border-2 ${
                          preview ? "readonly" : ""
                        }`}
                        readOnly={preview}
                        rows={6}
                        onChange={(e) => setH1(e.target.value)}
                        value={h1}
                      ></textarea>
                    ) : popup == "h2" ? (
                      <textarea
                        placeholder="Place the hint 2 description here"
                        className={`p-2 w-full border-gray-300 border-2 ${
                          preview ? "readonly" : ""
                        }`}
                        readOnly={preview}
                        rows={6}
                        onChange={(e) => setH2(e.target.value)}
                        value={h2}
                      ></textarea>
                    ) : (
                      <textarea
                        placeholder="Place the hint 3 description here"
                        className={`p-2 w-full border-gray-300 border-2 ${
                          preview ? "readonly" : ""
                        }`}
                        readOnly={preview}
                        rows={6}
                        onChange={(e) => setH3(e.target.value)}
                        value={h3}
                      ></textarea>
                    )}
                    {preview ? (
                      ""
                    ) : (
                      <button
                        onClick={() => setPreview(!preview)}
                        className="bg-green-500 text-white ml-4 mt-2 px-4 py-2 rounded"
                      >
                        Preview
                      </button>
                    )}
                    <button
                      onClick={() => setPopup(null)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
                    >
                      Close
                    </button>{" "}
                  </div>
                </div>
              </>
            )}
            {popup === "hiddenQuestion" && (
              <div
                className="absolute inset-0 flex items-center justify-center z-30"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                onClick={() => {
                  setPopup(null);
                  setPreview(false);
                }}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg flex space-y-5 flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  {preview ? (
                    <>
                      <h2>
                        {keyCount >= 3 ? (
                          <span className="font-normal text-lg">{`Question: ${HQ}`}</span>
                        ) : (
                          "Find all 3 keys to unlock the question!"
                        )}
                        <input
                          type="text"
                          placeholder="Answer the question here"
                          onChange={(e) => setUA(e.target.value)}
                          value={UA}
                          className="p-2 w-full border-gray-300 border-2 mt-4"
                        />
                      </h2>
                      {UA == HA ? (
                        <h2>✅ Correct Answer!</h2>
                      ) : (
                        <h2>❌ Try Again!</h2>
                      )}
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold mb-4">
                        Question:{" "}
                        <input
                          type="text"
                          placeholder="Set your question here"
                          className="p-2 w-full border-gray-300 border-2"
                          onChange={(e) => setHQ(e.target.value)}
                          value={HQ}
                        ></input>
                      </h2>
                      <input
                        type="text"
                        placeholder="Set the answer here"
                        className="p-2 w-full border-gray-300 border-2"
                        onChange={(e) => setHA(e.target.value)}
                        value={HA}
                      />
                      <button
                        onClick={() => setPreview(!preview)}
                        className="bg-green-500 text-white ml-4 mt-2 px-4 py-2 rounded"
                      >
                        Preview
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setPopup(null)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
                  >
                    Close
                  </button>{" "}
                </div>
              </div>
            )}
            {popup === "sequence" && (
              <div
                className="fixed inset-0 flex items-center justify-center z-30"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                onClick={() => {
                  setPopup(null);
                  setPreview(false);
                }}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                  <SequencePuzzle
                    isOwner={!preview}
                    initialChunks={chunks}
                    correctSequence={chunks}
                    setChunks={setChunks}
                  />
                  <button
                    onClick={() => setPreview(!preview)}
                    className="bg-green-500 text-white ml-4 mt-2 px-4 py-2 rounded"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setPopup(null)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
                  >
                    Close
                  </button>{" "}
                </div>
              </div>
            )}
          </div>

          {/* Layer Navigation */}
          <div className="mt-6 flex gap-2 items-center overflow-x-auto pb-2">
            {layers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => handleLayerSwitch(layer.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  currentLayerId === layer.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-500"
                }`}
              >
                {layer.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-72 bg-white border-l-2 border-gray-300 p-6 shadow-lg overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Settings</h2>

        {/* Number of Layers Section */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Number of Layers
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleUpdateLayerCount(layerCount - 1)}
              disabled={layerCount <= 1}
              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronDown size={20} />
            </button>

            <div className="flex-1">
              <input
                type="number"
                min="1"
                max="6"
                value={layerCount}
                onChange={(e) => handleUpdateLayerCount(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => handleUpdateLayerCount(layerCount + 1)}
              disabled={layerCount >= 20}
              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronUp size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Min: 1, Max: 5</p>
        </div>

        {/* Background Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Choose theme for this layer
          </label>
          <div className="space-y-2">
            {backgrounds.map((bg, index) => (
              <button
                key={index}
                onClick={() => handleBackgroundChange(index)}
                className={`w-full h-16 rounded-lg border-4 bg-cover bg-center transition-all ${
                  currentBgIndex === index
                    ? "border-blue-600 shadow-lg"
                    : "border-gray-300 hover:border-blue-400"
                }`}
                style={{
                  backgroundImage: `url(${bg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.6,
                }}
                title={backgroundNames[index]}
              >
                <span className="text-s font-semibold text-white drop-shadow">
                  {backgroundNames[index]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
