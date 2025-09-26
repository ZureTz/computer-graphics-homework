import { useState } from "react";

function Versions(): React.JSX.Element {
  const [versions] = useState(window.electron.process.versions);

  return (
    <nav className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] text-zinc-400">
      <ul className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1 leading-none">
        <li className="inline-flex items-center gap-1">
          <span>Electron</span>
          <code className="font-mono text-sky-300">v{versions.electron}</code>
        </li>
        <li className="inline-flex items-center gap-1">
          <span>Chromium</span>
          <code className="font-mono text-cyan-300">v{versions.chrome}</code>
        </li>
        <li className="inline-flex items-center gap-1">
          <span>Node</span>
          <code className="font-mono text-emerald-300">v{versions.node}</code>
        </li>
      </ul>
    </nav>
  );
}

export default Versions;
