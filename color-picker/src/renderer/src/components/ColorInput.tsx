import { HsvColor, HsvColorPicker } from "react-colorful";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import {
  convertHsvToRgb,
  convertRgbToHex,
  convertRgbToHsv,
  parseRgbString,
  parseHsvString,
  parseHexString
} from "@renderer/utils/color";

export default function ColorInput({
  hsvColor,
  setColor
}: {
  hsvColor: HsvColor;
  setColor: React.Dispatch<React.SetStateAction<HsvColor>>;
}): React.JSX.Element {
  const rgbColor = convertHsvToRgb(hsvColor);
  const hexString = convertRgbToHex(rgbColor);
  const rgbString = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
  const hsvString = `hsv(${Math.round(hsvColor.h)}°, ${Math.round(hsvColor.s)}%, ${Math.round(hsvColor.v)}%)`;

  const [rgbInput, setRgbInput] = useState(rgbString);
  const [hsvInput, setHsvInput] = useState(hsvString);
  const [hexInput, setHexInput] = useState(hexString);

  // Update input values when color changes from picker
  useEffect(() => {
    setRgbInput(rgbString);
    setHsvInput(hsvString);
    setHexInput(hexString);
  }, [rgbString, hsvString, hexString]);

  const handleRgbChange = (value: string): void => {
    if (value === rgbString) {
      return;
    }

    setRgbInput(value);
    const parsed = parseRgbString(value);
    if (parsed === null) {
      toast.error("Invalid RGB format");
      return;
    }
    const newHsv = convertRgbToHsv(parsed);
    setColor(newHsv);
    toast.success("RGB color applied");
  };

  const handleHsvChange = (value: string): void => {
    if (value === hsvString) {
      return;
    }

    setHsvInput(value);
    const parsed = parseHsvString(value);
    if (parsed === null) {
      toast.error("Invalid HSV format");
      return;
    }
    setColor(parsed);
    toast.success("HSV color applied");
  };

  const handleHexChange = (value: string): void => {
    if (value === hexString) {
      return;
    }

    setHexInput(value);
    const parsed = parseHexString(value);
    if (parsed === null) {
      toast.error("Invalid HEX format");
      return;
    }
    const newHsv = convertRgbToHsv(parsed);
    setColor(newHsv);
    toast.success("HEX color applied");
  };

  const copyColor = async (text: string): Promise<void> => {
    await navigator.clipboard?.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl px-8 py-7 shadow-2xl flex flex-col gap-6 sm:gap-8 w-full max-w-3xl mx-auto transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div
            className="h-16 w-16 rounded-2xl border-2 border-white/30 shadow-xl ring-2 ring-white/10 transition-colors duration-200"
            style={{ background: rgbString }}
            aria-label="Color preview"
          />
          <div className="flex flex-col gap-2">
            <span className="text-sm uppercase tracking-wider text-white font-semibold drop-shadow-sm">
              Selected Color
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <input
                  type="text"
                  value={rgbInput}
                  onChange={(e) => setRgbInput(e.target.value)}
                  onBlur={(e) => handleRgbChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRgbChange(e.currentTarget.value)}
                  className="font-mono text-sm text-white bg-black/20 border border-white/20 outline-none w-44 px-3 py-2 rounded-lg hover:bg-black/30 focus:bg-black/40 focus:ring-2 focus:ring-white/30 transition-all duration-200"
                  placeholder="rgb(255, 255, 255)"
                />
                <input
                  type="text"
                  value={hsvInput}
                  onChange={(e) => setHsvInput(e.target.value)}
                  onBlur={(e) => handleHsvChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleHsvChange(e.currentTarget.value)}
                  className="font-mono text-sm text-white bg-black/20 border border-white/20 outline-none w-54 px-3 py-2 rounded-lg hover:bg-black/30 focus:bg-black/40 focus:ring-2 focus:ring-white/30 transition-all duration-200"
                  placeholder="hsv(360°, 100%, 100%)"
                />
              </div>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                onBlur={(e) => handleHexChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleHexChange(e.currentTarget.value)}
                className="font-mono text-sm text-white/90 bg-black/20 border border-white/20 outline-none w-32 px-3 py-2 rounded-lg hover:bg-black/30 focus:bg-black/40 focus:ring-2 focus:ring-white/30 transition-all duration-200"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          aria-label="Copy RGB"
          onClick={() => copyColor(rgbString)}
          className="px-4 py-2.5 text-sm font-medium rounded-xl bg-black/30 hover:bg-black/50 text-white border border-white/20 hover:border-white/40 transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          <span className="hidden sm:inline">Copy RGB</span>
          <span className="sm:hidden inline">RGB</span>
        </button>
        <button
          aria-label="Copy HSV"
          onClick={() => copyColor(hsvString)}
          className="px-4 py-2.5 text-sm font-medium rounded-xl bg-black/30 hover:bg-black/50 text-white border border-white/20 hover:border-white/40 transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          <span className="hidden sm:inline">Copy HSV</span>
          <span className="sm:hidden inline">HSV</span>
        </button>
        <button
          aria-label="Copy HEX"
          onClick={() => copyColor(hexString)}
          className="px-4 py-2.5 text-sm font-medium rounded-xl bg-black/30 hover:bg-black/50 text-white border border-white/20 hover:border-white/40 transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          <span className="hidden sm:inline">Copy HEX</span>
          <span className="sm:hidden inline">HEX</span>
        </button>
      </div>
      <div className="flex-1 min-h-0 w-full">
        <div className="w-full h-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
          <HsvColorPicker
            color={hsvColor}
            onChange={setColor}
            style={{
              width: "100%",
              maxHeight: "400px",
              padding: "24px",
              borderRadius: "16px",
              background: "rgba(0, 0, 0, 0.3)",
              boxShadow: "inset 0 2px 12px rgba(0, 0, 0, 0.3)"
            }}
          />
        </div>
      </div>
    </div>
  );
}
