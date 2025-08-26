"use client";

import Image from "next/image";
import Link from "next/link";
import NavLink from "./components/NavLink";
import { useEffect, useState } from "react";

export default function Home() {
  const [isPressed, setIsPressed] = useState(1);
  const tabs = [];

  const handleClick = () => {
    setIsPressed((prev) => prev + 1);
  };

  return (
    <div className="dark:bg-black dark:text-white h-full bg-white text-black">
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <button onClick={handleClick}> Add Tab: {isPressed}</button>
        {}
      </div>
    </div>
  );
}
