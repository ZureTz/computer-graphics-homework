import { useState } from "react";
import useImage from "use-image";
import { Stage, Layer, Image } from "react-konva";

import grid from "@renderer/assets/grid-40.svg";
import { Point, canvasLength } from "@renderer/utils/canvas";
import BresenhamLine from "./BresenhamLine";

const LineCanvas = (): React.JSX.Element => {
  const [gridImage] = useImage(grid);
  const [start, setStart] = useState<Point>({ x: -15, y: -10 });
  const [end, setEnd] = useState<Point>({ x: 10, y: 12 });

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
          <h2 className="text-lg font-bold text-gray-800 mb-1">Bresenham 直线算法</h2>
          <p className="text-xs text-gray-600">拖动端点或输入坐标来绘制线段</p>
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
            <BresenhamLine
              start={start}
              end={end}
              color={{ r: 0, g: 0, b: 255 }}
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
