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
      className="min-h-screen text-zinc-100 antialiased px-4 sm:px-6 pt-12 pb-20 flex flex-col items-center gap-4 sm:gap-6 selection:bg-sky-500/30 selection:text-white transition-colors duration-300"
      style={{
        background: `linear-gradient(135deg, rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}) 0%, rgb(${Math.max(0, rgbColor.r - 20)}, ${Math.max(0, rgbColor.g - 20)}, ${Math.max(0, rgbColor.b - 20)}) 100%)`
      }}
    >
      <header className="sticky top-0 z-20 pt-3">
        <div className="inline-block rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
          <div className="py-3 px-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent drop-shadow-lg">
              Color Picker
            </h1>
          </div>
        </div>
      </header>

      <main className="w-full flex-1 flex items-center justify-center px-2">
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={12}
          containerStyle={{
            top: 120,
            left: 20,
            right: 20
          }}
          toastOptions={{
            duration: 2500,
            style: {
              background: "rgba(0, 0, 0, 0.8)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: "16px",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "500"
            },
            success: {
              style: {
                border: "1px solid rgba(34, 197, 94, 0.4)",
                background: "rgba(34, 197, 94, 0.1)"
              }
            },
            error: {
              style: {
                border: "1px solid rgba(239, 68, 68, 0.4)",
                background: "rgba(239, 68, 68, 0.1)"
              }
            }
          }}
        />
        <ColorInput hsvColor={hsvColor} setColor={setHsvColor} />
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-20 bg-black/20 backdrop-blur-xl border-t border-white/20">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 sm:gap-4">
          <Versions />
          <p className="text-xs text-white/80 font-medium text-center sm:text-right drop-shadow-sm">
            Built for homework - {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
