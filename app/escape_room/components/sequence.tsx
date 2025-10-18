"use client";
import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

interface SequencePuzzleProps {
  isOwner: boolean;
  initialChunks?: string[];
  correctSequence?: string[];
  setChunks?: (chunks: string[]) => void;
}

export default function SequencePuzzle({
  isOwner,
  initialChunks = [],
  correctSequence = [],
  setChunks,
}: SequencePuzzleProps) {
  const [playerOrder, setPlayerOrder] = useState<string[]>([]);
  const [won, setWon] = useState(0);

  // When the owner updates the chunks or popup is reopened
  useEffect(() => {
    if (isOwner) {
      setPlayerOrder(correctSequence);
    } else {
      // Shuffle a copy of the sequence for player mode
      const shuffled = shuffleArray(correctSequence);
      setPlayerOrder(shuffled);
    }
  }, [correctSequence, isOwner]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Handle drag end for player
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);
    setPlayerOrder((items) => arrayMove(items, oldIndex, newIndex));
  };

  const handleChange = (index: number, value: string) => {
    if (!setChunks) return;
    const updated = [...correctSequence];
    updated[index] = value;
    setChunks(updated);
  };

  const handleCheckOrder = () => {
    const correct =
      JSON.stringify(playerOrder) === JSON.stringify(correctSequence);
    if (correct) {
      setWon(1);
    } else {
      setWon(2);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {isOwner
          ? "Owner Setup: Enter and Arrange the Sequence"
          : "Arrange in the Correct Order"}
      </h2>

      {isOwner ? (
        <div className="space-y-2">
          {correctSequence.map((chunk, i) => (
            <input
              key={i}
              type="text"
              className="border-2 border-gray-300 rounded-md p-2 w-full"
              placeholder={`Chunk ${i + 1}`}
              value={chunk}
              onChange={(e) => handleChange(i, e.target.value)}
            />
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            // use numeric IDs so even duplicate texts work
            items={playerOrder.map((_, i) => i.toString())}
            strategy={verticalListSortingStrategy}
          >
            {playerOrder.map((chunk, index) => (
              <SortableItem key={index} id={index.toString()} text={chunk} />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {!isOwner && (
        <button
          onClick={handleCheckOrder}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full"
        >
          Check Order
        </button>
      )}
      {won !== 0 && (
        <p
          className={`mt-4 text-center font-semibold ${
            won === 1 ? "text-green-600" : "text-red-600"
          }`}
        >
          {won === 1
            ? "✅ Correct! You've arranged the sequence properly."
            : "❌ Incorrect order. Try again!"}
        </p>
      )}
    </div>
  );
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
