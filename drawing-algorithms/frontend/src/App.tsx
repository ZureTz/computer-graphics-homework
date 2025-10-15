import wailsLogo from "./assets/wails.png";
import { Greet } from "../wailsjs/go/main/App";
import { useState } from "react";

import "./App.css";

function App() {
  const [greeting, setGreeting] = useState<string>("");

  const doGreetings = async (name: string) => {
    const greetingResult = await Greet(name);
    setGreeting(greetingResult);
  };

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 place-items-center justify-items-center mx-auto py-8">
      <div className="text-blue-900 text-2xl font-bold font-mono">
        <h1 className="content-center">Vite + React + TS + Tailwind</h1>
      </div>
      <p>{greeting}</p>
      <input
        type="text"
        placeholder="Enter your name"
        className="border border-gray-300 rounded-md p-2 mt-4"
        onChange={(e) => doGreetings((e.target as HTMLInputElement).value)}
      />
      <div className="w-fit max-w-md">
        <a href="https://wails.io" target="_blank">
          <img src={wailsLogo} className="logo wails" alt="Wails logo" />
        </a>
      </div>
    </div>
  );
}

export default App;
