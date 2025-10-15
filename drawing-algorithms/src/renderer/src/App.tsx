import { Stage, Layer, Rect, Circle, Text } from "react-konva";

import Versions from "./components/Versions";

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex flex-col items-center justify-center p-6">
      <div className="text-xs text-gray-500 mb-2 select-none">Powered by electron-vite</div>
      <div className="text-2xl font-bold text-gray-800 mb-2">
        Build an Electron app with <span className="text-blue-600">React</span>
        &nbsp;and <span className="text-purple-600">TypeScript</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        请尝试按 <code className="bg-gray-200 px-1 rounded text-xs">F12</code> 打开开发者工具
      </p>
      <div className="flex gap-4 mb-6">
        <a
          href="https://electron-vite.org/"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition-colors"
        >
          Documentation
        </a>
        <button
          onClick={ipcHandle}
          className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition-colors"
        >
          Send IPC
        </button>
      </div>
      <div className="mb-6">
        <Versions />
      </div>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <Stage width={600} height={250} className="mx-auto">
          <Layer>
            <Text text="Try to drag shapes" fontSize={15} x={10} y={10} />
            <Rect x={20} y={50} width={100} height={100} fill="red" shadowBlur={10} draggable />
            <Circle x={200} y={100} radius={50} fill="green" draggable />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

export default App;
