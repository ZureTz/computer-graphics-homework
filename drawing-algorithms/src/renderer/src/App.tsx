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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center p-8 pb-16 relative overflow-hidden">
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-fit relative z-10">
        {/* Header - 简化版 */}
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            🎨 计算机图形学算法演示
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-8 border border-white/60 hover:shadow-3xl transition-shadow duration-300">
          {/* Tab Navigation */}
          <div className="flex justify-center gap-3 pb-2">
            <button
              className={`group relative px-8 py-3.5 font-semibold rounded-xl transition-all duration-300 ${
                activeCanvas === "line"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                  : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:scale-105 hover:shadow-md"
              }`}
              onClick={() => setActiveCanvas("line")}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
                线段
              </span>
            </button>
            <button
              className={`group relative px-8 py-3.5 font-semibold rounded-xl transition-all duration-300 ${
                activeCanvas === "circle"
                  ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 scale-105"
                  : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:scale-105 hover:shadow-md"
              }`}
              onClick={() => setActiveCanvas("circle")}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeWidth={2} />
                </svg>
                圆
              </span>
            </button>
            <button
              className={`group relative px-8 py-3.5 font-semibold rounded-xl transition-all duration-300 ${
                activeCanvas === "ellipse"
                  ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/30 scale-105"
                  : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:scale-105 hover:shadow-md"
              }`}
              onClick={() => setActiveCanvas("ellipse")}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <ellipse cx="12" cy="12" rx="9" ry="6" strokeWidth={2} />
                </svg>
                椭圆
              </span>
            </button>
            <button
              className={`group relative px-8 py-3.5 font-semibold rounded-xl transition-all duration-300 ${
                activeCanvas === "polygon"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 scale-105"
                  : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:scale-105 hover:shadow-md"
              }`}
              onClick={() => setActiveCanvas("polygon")}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                多边形
              </span>
            </button>
          </div>

          {/* Canvas Container */}
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/50 p-4">
            {renderCanvas()}
          </div>
        </div>
      </div>

      {/* Footer - Fixed定位 */}
      <div className="fixed bottom-0 left-0 right-0 py-2 px-6 border-t border-white/30 bg-white/80 backdrop-blur-md shadow-lg z-50">
        <Versions />
      </div>
    </div>
  );
}

export default App;
