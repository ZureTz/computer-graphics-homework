import { useState } from "react";

function Versions(): React.JSX.Element {
  const [versions] = useState(window.electron.process.versions);

  return (
    <div className="flex justify-center items-center space-x-4">
      <span>Electron v{versions.electron}</span>
      <span>Chromium v{versions.chrome}</span>
      <span>Node v{versions.node}</span>
    </div>
  );
}

export default Versions;
