import { useState } from "react";

function Versions(): React.JSX.Element {
  const [versions] = useState(window.electron.process.versions);

  return (
    <div className="rounded-xl bg-zinc-900/70 backdrop-blur border border-zinc-800/80 shadow-inner px-5 py-4">
      <h2 className="text-sm font-medium text-zinc-300 mb-3 tracking-wide">Runtime Versions</h2>
      <ul className="text-xs grid gap-1.5">
        <li className="flex justify-between bg-zinc-800/60 rounded-md px-3 py-2">
          <span className="text-zinc-400">Electron</span>
          <code className="font-mono text-sky-300">v{versions.electron}</code>
        </li>
        <li className="flex justify-between bg-zinc-800/60 rounded-md px-3 py-2">
          <span className="text-zinc-400">Chromium</span>
          <code className="font-mono text-cyan-300">v{versions.chrome}</code>
        </li>
        <li className="flex justify-between bg-zinc-800/60 rounded-md px-3 py-2">
          <span className="text-zinc-400">Node</span>
          <code className="font-mono text-emerald-300">v{versions.node}</code>
        </li>
      </ul>
    </div>
  );
}

export default Versions;
