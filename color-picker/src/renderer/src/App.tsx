import { useState } from "react";
import { HsvColor } from "react-colorful";
import { Toaster } from "react-hot-toast";

import Versions from "./components/Versions";
import ColorInput from "./components/ColorInput";
import { convertHsvToRgb } from "./utils/color";

function App(): React.JSX.Element {
  const [hsvColor, setHsvColor] = useState<HsvColor>({ h: 205, s: 66, v: 80 });
  const rgbColor = convertHsvToRgb(hsvColor);
  return (
    <div
      className="min-h-screen text-zinc-100 antialiased px-6 pt-16 pb-24 flex flex-col items-center gap-8 selection:bg-sky-500/30 selection:text-white"
      style={{ background: `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})` }}
    >
      <header className="sticky top-0 z-20 w-full">
        <div className="max-w-2xl mx-auto rounded-xl bg-zinc-950/40 backdrop-blur border border-white/10 shadow-sm">
          <div className="py-3 flex justify-center">
            <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent drop-shadow">
              Color Picker
            </h1>
          </div>
        </div>
      </header>

      <div className="w-full flex-1 flex items-center">
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          gutter={10}
          containerStyle={{ margin: 50 }}
          toastOptions={{
            duration: 2000,
            style: {
              background: "rgba(9, 9, 11, 0.6)", // zinc-950/60
              color: "#e5e7eb", // zinc-200
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderRadius: "12px"
            },
            success: {
              style: {
                border: "1px solid rgba(16, 185, 129, 0.35)", // emerald-500
                color: "#d1fae5" // emerald-100
              }
            },
            error: {
              style: {
                border: "1px solid rgba(244, 63, 94, 0.35)", // rose-500
                color: "#ffe4e6" // rose-100
              }
            }
          }}
        />
        <ColorInput hsvColor={hsvColor} setColor={setHsvColor} />
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-20 bg-zinc-950/40 backdrop-blur border-t border-white/10">
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between gap-2 sm:gap-3">
          <Versions />
          <p className="text-[11px] text-zinc-200 whitespace-normal sm:whitespace-nowrap text-center sm:text-right drop-shadow mt-1 sm:mt-0">
            Built for homework - {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
