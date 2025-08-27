"use client";
import NavLink from "./NavLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useState, useEffect } from "react";

export default function Menue() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Get the theme from local storage if it exists.
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    // Add or remove the 'dark' class on the document's root element (<html>).
    // This allows Tailwind CSS to apply dark mode styles.
    const htmlElement = document.documentElement;
    if (theme === "dark") {
      htmlElement.classList.add("dark");
      console.log("Dark mode enabled");
    } else {
      htmlElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <nav className="top-21 h-full fixed flex-col">
        <ul
          className={`${
            !isOpen ? "hidden" : ""
          } flex-col top-21 fixed h-full justify-between space-y-20 list-none p-4 bg-gray-800 text-white  dark:bg-gray-500`}
        >
          <NavLink href="/">HOME</NavLink>
          <NavLink href="/about">ABOUT</NavLink>
          <NavLink href="/contacts">CONTACT</NavLink>
        </ul>
      </nav>
      <nav className="w-full flex justify-around ">
        <ul
          className={`flex w-full justify-between items-center list-none p-8 bg-gray-800 text-white  dark:bg-gray-500`}
        >
          <button
            onClick={toggleMenu}
            className="text-yellow-400 text-4xl left-10"
          >
            <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
          </button>
          <NavLink href="/">TABS</NavLink>
          <NavLink href="/coding_races">CODING RACES</NavLink>
          <NavLink href="/escape_room">ESCAPE ROOM</NavLink>
          <h1 className="text-2xs">Student Number: 21951900</h1>
          <button onClick={toggleTheme}>
            <span className="text-xl text-amber-300">
              {" "}
              {theme == "light" ? "L-mode" : "D-mode"}{" "}
              {theme == "light" ? (
                <FontAwesomeIcon icon={faSun}></FontAwesomeIcon>
              ) : (
                <FontAwesomeIcon icon={faMoon}></FontAwesomeIcon>
              )}
            </span>
          </button>
        </ul>
      </nav>
    </>
  );
}
