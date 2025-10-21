"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, Key, Clock } from "lucide-react";
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

export default function EscapeRoom() {
  const [layers, setLayers] = useState<Layer[]>([
    { id: 1, name: "Layer 1", background: 0 },
  ]);
  const [currentLayerId, setCurrentLayerId] = useState(1);
  const currentLayer = layers.find((l) => l.id === currentLayerId);
  const currentBgIndex = currentLayer?.background || 0;
  const [popup, setPopup] = useState<string | null>(null);
  const [currentBgID, setCurrentBgID] = useState(1);
  const [layerCount, setLayerCount] = useState(1);
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
  const [PM, setPM] = useState(false);
  const [minutes, setMinutes] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [SessionId, setSessionId] = useState(null)
  const [questions, setQuestions] = useState<string[]>([]) 
  const [isLoading, setIsLoading] = useState(true);
  const [roomIndex, setRoomIndex] = useState<number>(0)
  const [isSaving, setIsSaving] = useState(false);
  const [chunks, setChunks] = useState<string[]>([" ", " ", " ", " ", " "]);

  useEffect(() => {
    const loadSession = async () => {
      const storedSessionId = localStorage.getItem('escapeRoomSessionId');
      
      if (storedSessionId) {
        try {
          const response = await fetch(`/api/escape-room/load?sessionId=${storedSessionId}`);
          
          if (response.ok) {
            const data = await response.json();
            
            // Restore ALL state
            setSessionId(data.id);
            setRoomIndex(data.roomName);
            setLayerCount(data.layerCount);
            setMinutes(data.timerMinutes);
            setLayers(data.layers);
            setCodeInput(data.keypadCode);
            setHint(data.hint);
            setQuizUnlock(data.quizUnlock);
            setHelpContent(data.helpContent);
            setQuiz(data.quiz);
            setH1(data.h1);
            setH2(data.h2);
            setH3(data.h3);
            setHQ(data.hiddenQuestion);
            setHA(data.hiddenAnswer);
            setChunks(data.sequenceChunks);
            
            console.log('Session loaded:', data.id);
          }
        } catch (error) {
          console.error('Error loading session:', error);
        }
      }
      
      setIsLoading(false);
    };
  
    loadSession();
  }, []);


  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/escape-room/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: SessionId,
          roomIndex: roomIndex,
          layerCount: layerCount,
          timerMinutes: minutes,
          layers: layers,
          keypadCode: codeInput,
          hint: hint,
          quizUnlock: quizUnlock,
          helpContent: helpContent,
          quiz: quiz,
          h1: h1,
          h2: h2,
          h3: h3,
          hiddenQuestion: HQ,
          hiddenAnswer: HA,
          sequenceChunks: chunks
        })
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('escapeRoomSessionId', data.id);
        setSessionId(data.id);
        alert('Saved successfully!');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving session');
    }
    
    setIsSaving(false);
  };

  const handleSetCode = () => {
    if (codeInput.trim() !== "") {
      setConfirmedCode(codeInput.trim());
    }
  };

  useEffect(() => {
    if (!isRunning) return; // only run when active
    if (timeLeft <= 0) {
      setGameOver(true);
      setIsRunning(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startCountdown = () => {
    if (minutes > 0) {
      setTimeLeft(minutes * 60);
      setGameOver(false);
      setIsRunning(true);
    }
  };

  const resetCountdown = () => {
    setIsRunning(false);
    setGameOver(false);
    setTimeLeft(0);
  };

  // Format time (mm:ss)
  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
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


  const Buttons = () => {
    if (currentBgIndex == 0) {
      return (
        <div className="relative w-full h-full">
          <button
            onClick={() => setPopup("keypad")}
            className={`${
              PM ? "opacity-0" : "opacity-60 hover:opacity-100"
            } transition-opacity duration-500 ${styles.plusIcon}`}
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
            className={`${
              PM ? "opacity-0" : "opacity-60 hover:opacity-100"
            } transition-opacity duration-500 ${styles.plusIcon}`}
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
            className={`${
              PM ? "opacity-0" : "opacity-60 hover:opacity-100"
            } transition-opacity duration-500 ${styles.plusIcon}`}
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
    } else if (currentBgIndex == 1) {
      return (
        <div className="relative w-full h-full">
          <button
            onClick={() => setPopup("quizpad")}
            className={`${
              PM ? "opacity-0" : "opacity-60 hover:opacity-100"
            } transition-opacity duration-500 ${styles.plusIcon}`}
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
            className={`${
              PM ? "opacity-0" : "opacity-60 hover:opacity-100"
            } transition-opacity duration-500 ${styles.plusIcon}`}
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
    } else if (currentBgIndex == 2) {
      return (
        <div className="relative w-full h-full">
          <button
            onClick={() => setPopup("h1")}
            className={`${
              PM ? "opacity-0" : "opacity-60 hover:opacity-100"
            } transition-opacity duration-500 ${styles.plusIcon}`}
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
            className={`${
              PM ? "opacity-0" : "opacity-60 hover:opacity-100"
            } transition-opacity duration-500 ${styles.plusIcon}`}
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
            className={`${
              PM ? "opacity-0" : "opacity-60 hover:opacity-100"
            } transition-opacity duration-500 ${styles.plusIcon}`}
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
            className={`${
              PM ? "opacity-0" : "opacity-60 hover:opacity-100"
            } transition-opacity duration-500 ${styles.plusIcon}`}
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
    } else if (currentBgIndex == 3) {
      return (
        <div className="relative w-full h-full">
          <button
            className={`${preview && !k1 ? "opacity-0" : "opacity-100"}`}
            onClick={() => {
              if (!k1) {
                if (PM) {
                  setPopup("key");
                  setK1(true);
                  setKeyCount(keyCount + 1);
                }
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
            className={`${
              PM ? "opacity-0" : "opacity-60 hover:opacity-100"
            } transition-opacity duration-500 ${styles.plusIcon}`}
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
              if (!k2) {
                if (PM) {
                  setPopup("key");
                  setK2(true);
                  setKeyCount(keyCount + 1);
                }
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
              if (!k3) {
                if (PM) {
                  setPopup("key");
                  setK3(true);
                  setKeyCount(keyCount + 1);
                }
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
    } else if (currentBgIndex == 4) {
      return (
        <button
          onClick={() => setPopup("sequence")}
          className={`${
            PM ? "opacity-0" : "opacity-60 hover:opacity-100"
          } transition-opacity duration-500 ${styles.plusIcon}`}
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
          <div className="flex items-center justify-between mb-4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Escape Room Builder
              </h1>
              <p className="text-gray-600">
                Currently editing:{" "}
                <span className="font-semibold">{currentLayer?.name}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-18">
              <h2 className="mb-3 font-bold">Set timer</h2>
              <input
                type="number"
                min="5"
                placeholder="Enter Minutes"
                className="border p-2 w-1/2 mb-3 rounded"
                value={minutes || ""}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              />
              <Clock size={24} className="text-gray-600 mb-3" />{" "}
            </div>
            <div className="space-x-5 mr-20 mt-15">
              <button
                onClick={() => {
                  setPreview(false);
                  setPM(false);
                  resetCountdown();
                }}
                className={`bg-red-600 ${
                  PM ? "" : "border-blue-500 border-5"
                } rounded-lg p-2 text-white cursor-pointer`}
              >
                Edit mode
              </button>
              <button
                onClick={() => {
                  setPreview(true);
                  setPM(true);
                  startCountdown();
                }}
                className={`bg-green-600 ${
                  PM ? "border-blue-500 border-5" : ""
                } rounded-lg p-2 text-white cursor-pointer`}
              >
                Player Mode
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative flex-1 h-[500px] w-260 rounded-lg resize-none shadow-2xl border-4 border-gray-300 cursor-crosshair overflow-hidden">
            {gameOver ? (
              <div className="flex flex-col justify-center items-center h-full w-full bg-black bg-opacity-75 z-50">
                <h1 className="text-red-600 text-6xl">You ran out of time!</h1>
                <button
                  className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={() => {
                    startCountdown();
                  }}
                >
                  RESTART
                </button>
              </div>
            ) : (
              <>
                <Image
                  src={backgrounds[layers[currentLayerId].background]}
                  alt="Golden key"
                  fill
                  className="object-cover rounded-lg overflow-hidden resize-none"
                />
                <div className="text-3xl font-mono mb-4 z-index-60 absolute top-8 left-2  bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
                  {timeLeft > 0 ? formatTime(timeLeft) : "00:00"}
                </div>
                <h3 className=" z-index-60 text-l font-strong  absolute top-2 left-8 text-white">
                  TIMER
                </h3>
                <Buttons />
                {popup === "keypad" && (
                  <div
                    className="fixed inset-0 flex items-center justify-center z-30"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                    onClick={() => {
                      setPopup(null);
                      if (!PM) {
                        setPreview(false);
                      }
                    }}
                  >
                    <div
                      className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
                      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                      {preview ? (
                        <Keypad correctCode={codeInput} />
                      ) : (
                        <>
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
                            onClick={() => setPopup(null)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
                          >
                            Close
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {(popup === "symbols" || popup == "quizHint") && (
                  <div
                    className="absolute inset-0 flex items-center justify-center z-30"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                    onClick={() => {
                      setPopup(null);
                      if (!PM) {
                        setPreview(false);
                      }
                    }}
                  >
                    <div
                      className="bg-white p-6 rounded-lg shadow-lg flex space-y-5 flex-col"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {popup == "symbols" && !preview ? (
                        <>
                          <h2 className="text-xl font-bold mb-4">Hint</h2>
                          <textarea
                            placeholder="Place the hint to acess the keypad password"
                            className="p-2"
                            onChange={(e) => setHint(e.target.value)}
                            value={hint}
                          ></textarea>
                          <button
                            onClick={() => {
                              setPopup(null);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            Close
                          </button>
                        </>
                      ) : popup == "quizHint" && !preview ? (
                        <>
                          <h2 className="text-xl font-bold mb-4">Hint</h2>
                          <textarea
                            placeholder="Place the hint to acess the quiz"
                            className="p-2"
                            onChange={(e) => setQuizUnlock(e.target.value)}
                            value={quizUnlock}
                          ></textarea>
                          <button
                            onClick={() => {
                              setPopup(null);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            Close
                          </button>
                        </>
                      ) : (
                        ""
                      )}

                      {preview && popup == "symbols" ? (
                        <HintPopup
                          hint={hint}
                          onClose={() => {
                            setPopup(null);
                          }}
                        />
                      ) : preview && popup == "quizHint" ? (
                        <QuizHintPopup
                          hint={quizUnlock}
                          onClose={() => {
                            setPopup(null);
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
                      if (!PM) {
                        setPreview(false);
                      }
                    }}
                  >
                    <div
                      className="bg-white p-6 rounded-lg shadow-lg flex space-y-5 flex-col"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {preview ? (
                        <HelpPopup
                          content={helpContent}
                          onClose={() => {
                            setPopup(null);
                          }}
                        />
                      ) : (
                        <>
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
                              setPopup(null);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            Close
                          </button>
                        </>
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
                      if (!PM) {
                        setPreview(false);
                      }
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
                      if (!PM) {
                        setPreview(false);
                      }
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
                        if (!PM) {
                          setPreview(false);
                        }
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
                        {preview ? "" : ""}
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
                      if (!PM) {
                        setPreview(false);
                      }
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
                      if (!PM) {
                        setPreview(false);
                      }
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
                        onClick={() => setPopup(null)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
                      >
                        Close
                      </button>{" "}
                    </div>
                  </div>
                )}
              </>
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
