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

  const navItems: { id: CanvasType; label: string; icon: React.ReactNode }[] = [
    {
      id: "line",
      label: "线段绘制",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      )
    },
    {
      id: "circle",
      label: "圆绘制",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
        </svg>
      )
    },
    {
      id: "ellipse",
      label: "椭圆绘制",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <ellipse cx="12" cy="12" rx="9" ry="6" strokeWidth={2} />
        </svg>
      )
    },
    {
      id: "polygon",
      label: "多边形绘制",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      )
    }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0f172a] text-slate-200 font-sans selection:bg-pink-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-pink-600/20 blur-[100px]" />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-64 flex flex-col bg-white/5 backdrop-blur-2xl border-r border-white/10 shadow-2xl">
        <div className="p-6 pb-8">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            图形学算法
          </h1>
          <p className="text-xs text-slate-400 mt-1">Computer Graphics Demo</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveCanvas(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeCanvas === item.id
                  ? "bg-white/10 text-white shadow-lg shadow-purple-500/10 border border-white/10"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <span
                className={`transition-colors duration-300 ${
                  activeCanvas === item.id
                    ? "text-purple-400"
                    : "text-slate-500 group-hover:text-slate-300"
                }`}
              >
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.label}</span>
              {activeCanvas === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <Versions />
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto h-full flex flex-col">
            <header className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {navItems.find((i) => i.id === activeCanvas)?.label}
                </h2>
                <p className="text-slate-400 text-sm mt-1">交互式算法演示与参数调整</p>
              </div>
            </header>

            <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
              {/* Inner content wrapper to handle padding/layout of children */}
              <div className="h-full w-full p-6 overflow-auto custom-scrollbar flex items-center justify-center">
                {renderCanvas()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
