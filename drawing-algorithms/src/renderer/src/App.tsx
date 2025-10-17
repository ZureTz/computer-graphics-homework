import { useState } from "react";

import LineCanvas from "./components/LineCanvas";
import CircleCanvas from "./components/CircleCanvas";
import EllipseCanvas from "./components/EllipseCanvas";
import PolygonCanvas from "./components/PolygonCanvas";
import Versions from "./components/Versions";

type CanvasType = "line" | "circle" | "ellipse" | "polygon";

function App(): React.JSX.Element {
  const [activeCanvas, setActiveCanvas] = useState<CanvasType>("line");

  const renderCanvas = (): React.JSX.Element => {
    switch (activeCanvas) {
      case "line":
        return <LineCanvas />;
      case "circle":
        return <CircleCanvas />;
      case "ellipse":
        return <EllipseCanvas />;
      case "polygon":
        return <PolygonCanvas />;
      default:
        return <LineCanvas />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-fit bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="flex justify-center border-b">
          <button
            className={`px-4 py-2 -mb-px border-b-2 ${activeCanvas === "line" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            onClick={() => setActiveCanvas("line")}
          >
            线段
          </button>
          <button
            className={`px-4 py-2 -mb-px border-b-2 ${activeCanvas === "circle" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            onClick={() => setActiveCanvas("circle")}
          >
            圆
          </button>
          <button
            className={`px-4 py-2 -mb-px border-b-2 ${activeCanvas === "ellipse" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            onClick={() => setActiveCanvas("ellipse")}
          >
            椭圆
          </button>
          <button
            className={`px-4 py-2 -mb-px border-b-2 ${activeCanvas === "polygon" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            onClick={() => setActiveCanvas("polygon")}
          >
            多边形
          </button>
        </div>
        <div className="border rounded-lg overflow-hidden">{renderCanvas()}</div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-2 border-t bg-gray-50 text-xs text-gray-400">
        <Versions />
      </div>
    </div>
  );
}

export default App;
