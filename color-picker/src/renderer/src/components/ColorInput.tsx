import { HsvColor, HsvColorPicker } from "react-colorful";
import toast from "react-hot-toast";

import { convertHsvToRgb, convertRgbToHex } from "@renderer/utils/color";

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
  const hsvString = `hsv(${Math.round(hsvColor.h)}, ${Math.round(hsvColor.s)}%, ${Math.round(hsvColor.v)}%)`;

  const copyColor = async (text: string): Promise<void> => {
    await navigator.clipboard?.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 backdrop-blur px-6 py-5 shadow-inner flex flex-col gap-5 sm:gap-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-md border border-zinc-700 shadow-inner"
            style={{ background: rgbString }}
            aria-label="Color preview"
          />
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500">
              Selected Color
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="font-mono text-sm text-zinc-200">{rgbString}</span>
              <span className="font-mono text-sm text-zinc-200">{hsvString}</span>
            </div>
            <span className="font-mono text-xs text-zinc-400">{hexString}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
        <button
          aria-label="Copy RGB"
          onClick={() => copyColor(rgbString)}
          className="px-2 sm:px-2.5 h-8 text-[11px] sm:text-xs rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
        >
          <span className="hidden sm:inline">Copy RGB</span>
          <span className="sm:hidden inline">RGB</span>
        </button>
        <button
          aria-label="Copy HSV"
          onClick={() => copyColor(hsvString)}
          className="px-2 sm:px-2.5 h-8 text-[11px] sm:text-xs rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
        >
          <span className="hidden sm:inline">Copy HSV</span>
          <span className="sm:hidden inline">HSV</span>
        </button>
        <button
          aria-label="Copy HEX"
          onClick={() => copyColor(hexString)}
          className="px-2 sm:px-2.5 h-8 text-[11px] sm:text-xs rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
        >
          <span className="hidden sm:inline">Copy HEX</span>
          <span className="sm:hidden inline">HEX</span>
        </button>
      </div>
      <div className="flex-1 min-h-0 w-full">
        <div className="w-full h-full">
          <HsvColorPicker
            color={hsvColor}
            onChange={setColor}
            style={{
              width: "100%",
              maxHeight: "360px",
              padding: "16px",
              borderRadius: "12px",
              background: "#33333a",
              boxShadow: "0 6px 12px #00000040"
            }}
          />
        </div>
      </div>
    </div>
  );
}
