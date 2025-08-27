// This entire page was generate through Gemini AI. I only added the video link and my name and ID.
// This page was an additional and insignificant part of my project, hence I chose to use AI to fill in the content.
"use client";

import React from "react";

export default function About() {
  return (
    // The main container for the page, centered and styled for a clean layout.
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Content card with rounded corners and a subtle shadow */}
      <div className="max-w-4xl w-full p-8 md:p-12 rounded-xl shadow-lg bg-white dark:bg-gray-800 space-y-8">
        {/* Title and personal details section */}
        <section className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 dark:text-blue-400">
            About Me
          </h1>
          <p className="text-lg md:text-xl font-medium">
            My name is Pramit Gautam.
          </p>
          <p className="text-lg md:text-xl font-medium">Student ID: 21951900</p>
        </section>

        {/* Video Section */}
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            My Video Presentation
          </h2>

          {/*
            This div is a placeholder for your video.
            1.  Replace the entire <iframe> tag with your video's embed code (e.g., from YouTube, Vimeo, or a cloud service).
            2.  The "aspect-w-16 aspect-h-9" classes (from Tailwind's @tailwindcss/aspect-ratio plugin)
                will ensure the video maintains a perfect 16:9 aspect ratio as the page resizes.
            3.  If you use a <video> tag, make sure to add the `w-full h-full` classes to it as well.
          */}
          <div className="relative overflow-hidden w-full pt-[56.25%] rounded-lg shadow-md">
            {/* Example: Replace the placeholder iframe below with your actual video embed code */}
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Placeholder Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        {/* Optional: Add a brief bio or description section */}
        <section className="space-y-4 pt-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            A Little More About Me
          </h2>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center">
            I am in the third year of my Computer Science degree at the Latrobe
            University. I have a passion for coding and love to create web
            applications that are both functional and visually appealing. In my
            free time, I enjoy exploring new technologies and working on
            personal projects to enhance my skills.
          </p>
        </section>
      </div>
    </div>
  );
}
