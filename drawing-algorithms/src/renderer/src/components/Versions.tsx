import { useState } from "react";

function Versions(): React.JSX.Element {
  const [versions] = useState(window.electron.process.versions);

  return (
    <div className="flex flex-col gap-2 text-xs w-full">
      <div className="flex items-center justify-between text-slate-400">
        <span className="font-medium">Electron</span>
        <span className="font-mono text-slate-300">v{versions.electron}</span>
      </div>
      <div className="flex items-center justify-between text-slate-400">
        <span className="font-medium">Chromium</span>
        <span className="font-mono text-slate-300">v{versions.chrome}</span>
      </div>
      <div className="flex items-center justify-between text-slate-400">
        <span className="font-medium">Node</span>
        <span className="font-mono text-slate-300">v{versions.node}</span>
      </div>
    </div>
  );
}

export default Versions;
