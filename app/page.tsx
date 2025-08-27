"use client";

import Image from "next/image";
import Link from "next/link";
import NavLink from "./components/NavLink";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faMinusCircle,
  faCheckCircle,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [isPressed, setIsPressed] = useState(0);
  const [isPressed2, setIsPressed2] = useState(0);
  const [tabs, setTabs] = useState<string[]>([]);
  const [tabContent, setTabContent] = useState<string[]>([]);
  const [TabsInputs, setTabsInputs] = useState("");
  const [toggleInput, setToggleInput] = useState(false);
  const [tabClickId, setTabClickId] = useState(0);
  const [toggleTabInput, setToggleTabInput] = useState(false);
  const [output, setOutput] = useState("");

  useEffect(() => {
    // Get the theme from local storage if it exists.
    const storedTitle = localStorage.getItem("tab_title");
    const storedContent = localStorage.getItem("tab_content");
    if (storedTitle) {
      setTabs(storedTitle.split(","));
    }
    if (storedContent) {
      setTabContent(storedContent.split(","));
    }
  }, []);

  useEffect(() => {
    // co-pilot helped here
    localStorage.setItem("tab_title", tabs.join(","));
    localStorage.setItem("tab_content", tabContent.join(","));
  }, [tabs, tabContent]);

  const handleClick = () => {
    if (isPressed >= 15) return;
    setIsPressed((prev) => prev + 1);
    setToggleInput(true);
  };

  const handleClick2 = () => {
    if (isPressed <= 0) return;
    setIsPressed((prev) => prev - 1);
    setTabs((prevTasks) => prevTasks.slice(0, -1));
    setTabContent((prevContent) => prevContent.slice(0, -1));
    setTabClickId(0);
  };

  //co-pilot helped here
  const handleDone = () => {
    if (TabsInputs.trim() === "") return; // Prevent adding empty tab names
    setTabs((prevTabs) => [...prevTabs, TabsInputs]);
    setTabsInputs(""); // Clear the input field after adding
    setToggleInput(false);
    setToggleTabInput(true);
    setTabContent((prevContent) => [...prevContent, ""]); // Initialize content for the new tab
  };

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleDone();
    }
  };
  const submit = () => {
    if (tabs.length === 0) return;
    if (tabContent.length === 0) return;
    if (tabs.length !== tabContent.length) return;
    let combinedOutput = `<!DOCTYPE html>
<html lang="en" style="width: 100%; height: 100%; margin:0; padding:0;">
<head>
    <meta charset="UTF-8">
    <title>Output document</title>
</head>
<body style="width:100%; height:100%; margin:0; padding:0;">
    <div style="width: 100%; height: 100%;display:flex; justify-content: center; align-items: center; border : 1px solid black; padding: 5px;">
        <div id = "main_container" style="width: 500px;height:500px; border: 1px solid black; margin: 10px">
            <div id="button_container" style="display:flex;justify-content: space-between;"></div>
            <div id="text_container" style="margin:20px"></div>
        </div>
    </div>
    <script>
        var tab = ${JSON.stringify(tabs)};
        var tabContent = ${JSON.stringify(tabContent)};
        for (var i = 0; i < tab.length; i++) {
            var button = document.createElement("button");
            var ta = document.createElement("div")
            var container = document.getElementById("button_container");
            var text_output = document.getElementById("text_container");

            button.innerHTML = tab[i];
            button.style.width = "150px";
            button.style.height = "50px";
            button.style.margin = "20px";

            button.onclick = (function(index) {
                return function(){
                ta.innerHTML = tabContent[index];
            }
            })(i);
            container.appendChild(button);
            text_output.appendChild(ta)
        }

    </script>
</body>
</html>`;
    setOutput(combinedOutput);
  };

  return (
    <div className="dark:bg-black dark:text-white h-full w-full  bg-white text-black flex justify-center p-5 space-x-10">
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="flex space-x-4">
          <button className="inline-block" onClick={handleClick2}>
            <FontAwesomeIcon icon={faMinusCircle} />
          </button>
          <span>TABS: {isPressed}</span>
          <button className="inline-block" onClick={handleClick}>
            <FontAwesomeIcon icon={faPlusCircle} />
          </button>
        </div>
        <div className={toggleInput ? "block" : "hidden"}>
          <input
            type="text"
            value={TabsInputs}
            onChange={(e) => setTabsInputs(e.target.value)} // co-pilot helped here
            onKeyDown={handleEnter}
            className="m-2 p-2 border border-gray-900 dark:border-white rounded"
            placeholder={`Tab name...`}
          />
          <button onClick={handleDone} className="text-green-500 text-2xl">
            <FontAwesomeIcon icon={faCheckCircle} />
          </button>
        </div>
        {tabs.map((tab, index) => (
          <>
            <div
              key={index}
              onClick={() => {
                setTabClickId(index);
                setToggleTabInput(true);
              }}
              className="m-2 p-2 border border-gray-300 rounded"
            >
              {tab}
            </div>
          </>
        ))}
      </div>
      <div className={` ${toggleTabInput ? "block" : "hidden"} block`}>
        <h1 className="text-center text-2xl mb-5">Tab Content:</h1>
        <textarea
          placeholder="Enter the contents..."
          value={tabContent[tabClickId]}
          onChange={(e) => {
            // co-pilot helped here
            const newTabContent = [...tabContent];
            newTabContent[tabClickId] = e.target.value;
            setTabContent(newTabContent);
          }}
          className="resize-none border-2 border-black dark:border-white p-5"
          rows={25}
          cols={50}
        ></textarea>
      </div>
      <div className="space-y-2 block">
        <div
          onClick={submit}
          className="flex justify-center items-center space-x-2 p-2 bg-blue-800 text-white w-50"
        >
          <span>OUTPUT</span>
          <FontAwesomeIcon icon={faEye} />
        </div>
        <textarea
          className="block  border-red-500 border-2 resize-none p-5"
          rows={25}
          cols={70}
          value={output}
        ></textarea>
      </div>
    </div>
  );
}
