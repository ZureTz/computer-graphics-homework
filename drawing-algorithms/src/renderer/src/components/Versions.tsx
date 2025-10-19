import { useState } from "react";

function Versions(): React.JSX.Element {
  const [versions] = useState(window.electron.process.versions);

  return (
    <div className="flex justify-center items-center space-x-6 text-xs">
      <div className="flex items-center gap-1.5 text-gray-500">
        <span className="font-semibold text-gray-700">Electron</span>
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md font-mono">
          v{versions.electron}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-500">
        <span className="font-semibold text-gray-700">Chromium</span>
        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md font-mono">
          v{versions.chrome}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-500">
        <span className="font-semibold text-gray-700">Node</span>
        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md font-mono">
          v{versions.node}
        </span>
      </div>
    </div>
  );
}

export default Versions;
