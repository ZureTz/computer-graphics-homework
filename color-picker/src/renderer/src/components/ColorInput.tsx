import { formatColor } from "@renderer/utils/color";
import { useState } from "react";

export default function ColorInput(): React.JSX.Element {
  const [color, setColor] = useState("#0095ff");
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 backdrop-blur px-5 py-4 shadow-inner flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-md border border-zinc-700 shadow-inner"
          style={{ background: color }}
          aria-label="Color preview"
        />
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-zinc-500">Selected Color</span>
          <span className="font-mono text-sm text-zinc-200">{formatColor(color)}</span>
        </div>
      </div>
      <label className="flex items-center gap-3 text-xs text-zinc-400">
        <span className="w-24">Pick Color</span>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-9 w-24 cursor-pointer rounded-md border border-zinc-700 bg-zinc-800 p-1 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0"
        />
      </label>
    </div>
  );
}
