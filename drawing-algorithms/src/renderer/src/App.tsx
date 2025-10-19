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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-fit">
        {/* Header */}
        <div className="mb-6 text-center bg-white/60 backdrop-blur-sm rounded-xl border border-gray-300 shadow-sm p-4">
          <h1 className="text-3xl font-semibold text-gray-700 mb-1">计算机图形学算法演示</h1>
          <p className="text-gray-500 text-xs">交互式像素绘制算法可视化工具</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-200">
          {/* Tab Navigation */}
          <div className="flex justify-center gap-2 border-b-2 border-gray-200">
            <button
              className={`px-6 py-3 -mb-0.5 font-medium transition-all duration-200 ${
                activeCanvas === "line"
                  ? "border-b-4 border-blue-500 text-blue-600 scale-105"
                  : "border-b-4 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:scale-105"
              }`}
              onClick={() => setActiveCanvas("line")}
            >
              线段
            </button>
            <button
              className={`px-6 py-3 -mb-0.5 font-medium transition-all duration-200 ${
                activeCanvas === "circle"
                  ? "border-b-4 border-red-500 text-red-600 scale-105"
                  : "border-b-4 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:scale-105"
              }`}
              onClick={() => setActiveCanvas("circle")}
            >
              圆
            </button>
            <button
              className={`px-6 py-3 -mb-0.5 font-medium transition-all duration-200 ${
                activeCanvas === "ellipse"
                  ? "border-b-4 border-purple-500 text-purple-600 scale-105"
                  : "border-b-4 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:scale-105"
              }`}
              onClick={() => setActiveCanvas("ellipse")}
            >
              椭圆
            </button>
            <button
              className={`px-6 py-3 -mb-0.5 font-medium transition-all duration-200 ${
                activeCanvas === "polygon"
                  ? "border-b-4 border-green-500 text-green-600 scale-105"
                  : "border-b-4 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:scale-105"
              }`}
              onClick={() => setActiveCanvas("polygon")}
            >
              多边形
            </button>
          </div>

          {/* Canvas Container */}
          <div className="rounded-xl overflow-hidden">{renderCanvas()}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 py-2 px-4 border-t bg-white/70 backdrop-blur-sm text-xs text-gray-400">
        <Versions />
      </div>
    </div>
  );
}

export default App;
