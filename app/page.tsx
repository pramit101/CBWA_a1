//Reference: Github Copilot and Google Gemnini for guidance, structure and some snippets
// Tailwind CSS for styling

"use client";

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
  const [tabs, setTabs] = useState<string[]>([]);
  const [tabContent, setTabContent] = useState<string[]>([]);
  const [TabsInputs, setTabsInputs] = useState("");
  const [toggleInput, setToggleInput] = useState(false);
  const [tabClickId, setTabClickId] = useState(0);
  const [toggleTabInput, setToggleTabInput] = useState(false);
  const [output, setOutput] = useState("");

  //Gemini generate snipppet for localstroage
  useEffect(() => {
    // Load the tabs and content from localStorage on initial render
    try {
      const storedTitles = localStorage.getItem("tab_title");
      const storedContent = localStorage.getItem("tab_content");

      // Using JSON.parse to handle the stored data
      if (storedTitles) {
        const parsedTitles = JSON.parse(storedTitles);
        // Ensure the parsed value is an array before setting the state
        if (Array.isArray(parsedTitles)) {
          setTabs(parsedTitles);
          setIsPressed(parsedTitles.length);
        }
      }
      if (storedContent) {
        const parsedContent = JSON.parse(storedContent);
        // Ensure the parsed value is an array before setting the state
        if (Array.isArray(parsedContent)) {
          setTabContent(parsedContent);
        }
      }
    } catch (error) {
      console.error("Failed to load data from local storage:", error);
    }
  }, []);

  useEffect(() => {
    // co-pilot helped here
    localStorage.setItem("tab_title", JSON.stringify(tabs));
    localStorage.setItem("tab_content", JSON.stringify(tabContent));
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
    const combinedOutput = `
    <!DOCTYPE html>
<html lang="en" style="width: 100%; height: 100%; margin:0; padding:0;">
<head>
    <meta charset="UTF-8">
    <title>Output document</title>
</head>
<body style="width:100%; height:100%; margin:0; padding:0;">
            <h1 style="text-align: center; margin-bottom: -25px;">This is the generated tabs and its contents</h1>
    <div style="width: 100%; height: 100%;display:flex; justify-content: center; align-items: center; padding: 5px; ">
        <div id = "main_container" style="width: 700px;height:650px; border: 1px solid black; margin: 10px ;background-color: #f0f0f5">
            <div id="button_container" style="display:flex;justify-content: space-between;"></div>
            <textarea readonly id="text_container" style="margin:20px;resize: none;width:650px;height:500px;padding:10px"></textarea>
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
            button.style.color = "white";
            button.style.backgroundColor = "#47476b";

            button.onclick = (function(index) {
                return function(){
                text_output.value = tabContent[index];
            }
            })(i);
            container.appendChild(button);
            text_output.appendChild(ta)
        }

    </script>
</body>
</html>

         
  `;
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
            onChange={(e) => setTabsInputs(e.target.value)} // co-pilot helped on this line
            onKeyDown={handleEnter}
            className="m-2 p-2 border border-gray-900 dark:border-white rounded"
            placeholder={`Tab name...`}
          />
          <button onClick={handleDone} className="text-green-500 text-2xl">
            <FontAwesomeIcon icon={faCheckCircle} />
          </button>
        </div>
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => {
              setTabClickId(index);
              setToggleTabInput(true);
            }}
            className="m-2 p-2 border border-black bg-gray-400 rounded"
          >
            {tab}
          </div>
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
          className="resize-none border-2 border-gray-500  p-5"
          rows={22}
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
          readOnly
          placeholder="Output will be shown here..."
          className="block  border-green-500 border-2 resize-none p-5"
          rows={22}
          cols={70}
          value={output}
        ></textarea>
      </div>
    </div>
  );
}
