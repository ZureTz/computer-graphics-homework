import { useState } from "react";
import useImage from "use-image";
import { Stage, Layer, Image } from "react-konva";

import grid from "@renderer/assets/grid-40.svg";
import { Point, canvasLength } from "@renderer/utils/canvas";
import LineRenderer from "./LineRenderer";

const LineCanvas = (): React.JSX.Element => {
  const [gridImage] = useImage(grid);
  const [start, setStart] = useState<Point>({ x: -16, y: -5 });
  const [end, setEnd] = useState<Point>({ x: 16, y: 1 });
  const [algorithm, setAlgorithm] = useState<"bresenham" | "dda" | "wu">("bresenham");

  const handleStartChange = (newStart: Point): void => {
    setStart(newStart);
  };

  const handleEndChange = (newEnd: Point): void => {
    setEnd(newEnd);
  };

  const handleInputChange = (type: "start" | "end", axis: "x" | "y", value: string): void => {
    const numValue = parseInt(value) || 0;
    if (type === "start") {
      setStart((prev) => ({ ...prev, [axis]: numValue }));
    } else {
      setEnd((prev) => ({ ...prev, [axis]: numValue }));
    }
  };

  return (
    <div className="flex gap-6 items-start">
      {/* Control Panel */}
      <div className="flex flex-col gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm w-[240px]">
        <div className="mb-1">
          <h2 className="text-base font-bold text-gray-800 mb-0.5">直线绘制</h2>
          <p className="text-xs text-gray-600">选择算法并拖动或输入坐标</p>
        </div>

        {/* Algorithm Selection */}
        <div className="bg-white rounded-lg p-2.5 shadow-sm">
          <h3 className="font-semibold text-xs text-blue-700 mb-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            算法
          </h3>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="algorithm"
                value="bresenham"
                checked={algorithm === "bresenham"}
                onChange={(e) => setAlgorithm(e.target.value as "bresenham" | "dda" | "wu")}
                className="w-3.5 h-3.5 text-blue-600 focus:ring-1 focus:ring-blue-400 cursor-pointer"
              />
              <span className="text-xs text-gray-700 group-hover:text-blue-600 transition-colors">
                Bresenham
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="algorithm"
                value="dda"
                checked={algorithm === "dda"}
                onChange={(e) => setAlgorithm(e.target.value as "bresenham" | "dda" | "wu")}
                className="w-3.5 h-3.5 text-blue-600 focus:ring-1 focus:ring-blue-400 cursor-pointer"
              />
              <span className="text-xs text-gray-700 group-hover:text-blue-600 transition-colors">
                DDA
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="algorithm"
                value="wu"
                checked={algorithm === "wu"}
                onChange={(e) => setAlgorithm(e.target.value as "bresenham" | "dda" | "wu")}
                className="w-3.5 h-3.5 text-blue-600 focus:ring-1 focus:ring-blue-400 cursor-pointer"
              />
              <span className="text-xs text-gray-700 group-hover:text-blue-600 transition-colors">
                吴小林
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="bg-white rounded-lg p-2.5 shadow-sm">
            <h3 className="font-semibold text-xs text-blue-700 mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              起点
            </h3>
            <div className="space-y-1.5">
              <div className="flex gap-1.5 items-center">
                <label className="text-xs font-medium text-gray-600 w-3">X</label>
                <input
                  type="number"
                  value={start.x}
                  onChange={(e) => handleInputChange("start", "x", e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex gap-1.5 items-center">
                <label className="text-xs font-medium text-gray-600 w-3">Y</label>
                <input
                  type="number"
                  value={start.y}
                  onChange={(e) => handleInputChange("start", "y", e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-2.5 shadow-sm">
            <h3 className="font-semibold text-xs text-blue-700 mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              终点
            </h3>
            <div className="space-y-1.5">
              <div className="flex gap-1.5 items-center">
                <label className="text-xs font-medium text-gray-600 w-3">X</label>
                <input
                  type="number"
                  value={end.x}
                  onChange={(e) => handleInputChange("end", "x", e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex gap-1.5 items-center">
                <label className="text-xs font-medium text-gray-600 w-3">Y</label>
                <input
                  type="number"
                  value={end.y}
                  onChange={(e) => handleInputChange("end", "y", e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
        <Stage width={canvasLength} height={canvasLength}>
          <Layer>
            <Image image={gridImage} x={0} y={0} width={canvasLength} height={canvasLength} />
            <LineRenderer
              start={start}
              end={end}
              color={{ r: 30, g: 144, b: 255, a: 1 }}
              algorithm={algorithm}
              onStartChange={handleStartChange}
              onEndChange={handleEndChange}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default LineCanvas;
