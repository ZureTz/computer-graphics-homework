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
      <div className="flex flex-col gap-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm min-w-[220px]">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-gray-800 mb-1">直线绘制算法</h2>
          <p className="text-xs text-gray-600">选择算法并拖动端点或输入坐标</p>
        </div>

        {/* Algorithm Selection */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <h3 className="font-semibold text-sm text-blue-700 mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            算法选择
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="algorithm"
                value="bresenham"
                checked={algorithm === "bresenham"}
                onChange={(e) => setAlgorithm(e.target.value as "bresenham" | "dda" | "wu")}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-400 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                Bresenham 算法
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="algorithm"
                value="dda"
                checked={algorithm === "dda"}
                onChange={(e) => setAlgorithm(e.target.value as "bresenham" | "dda" | "wu")}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-400 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                DDA 算法
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="algorithm"
                value="wu"
                checked={algorithm === "wu"}
                onChange={(e) => setAlgorithm(e.target.value as "bresenham" | "dda" | "wu")}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-400 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                吴小林算法
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <h3 className="font-semibold text-sm text-blue-700 mb-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              起点坐标
            </h3>
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <label className="text-xs font-medium text-gray-600 w-5">X:</label>
                <input
                  type="number"
                  value={start.x}
                  onChange={(e) => handleInputChange("start", "x", e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex gap-2 items-center">
                <label className="text-xs font-medium text-gray-600 w-5">Y:</label>
                <input
                  type="number"
                  value={start.y}
                  onChange={(e) => handleInputChange("start", "y", e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm">
            <h3 className="font-semibold text-sm text-blue-700 mb-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              终点坐标
            </h3>
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <label className="text-xs font-medium text-gray-600 w-5">X:</label>
                <input
                  type="number"
                  value={end.x}
                  onChange={(e) => handleInputChange("end", "x", e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex gap-2 items-center">
                <label className="text-xs font-medium text-gray-600 w-5">Y:</label>
                <input
                  type="number"
                  value={end.y}
                  onChange={(e) => handleInputChange("end", "y", e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
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
