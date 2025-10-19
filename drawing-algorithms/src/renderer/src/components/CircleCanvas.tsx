import useImage from "use-image";
import { Stage, Layer, Image } from "react-konva";

import grid from "@renderer/assets/grid-40.svg";
import { canvasLength, Point } from "@renderer/utils/canvas";
import { useState } from "react";
import CircleRenderer from "./CircleRenderer";

const CircleCanvas = (): React.JSX.Element => {
  const [gridImage] = useImage(grid);
  const [circleCenter, setCircleCenter] = useState<Point>({ x: 0, y: 0 });
  const [radius, setRadius] = useState<number>(10);

  const handleCenterChange = (newCenter: Point): void => {
    setCircleCenter(newCenter);
  };

  const handleRadiusChange = (newRadius: number): void => {
    setRadius(newRadius);
  };

  const handleInputChange = (type: "centerX" | "centerY" | "radius", value: string): void => {
    const numValue = parseInt(value) || 0;
    if (type === "centerX") {
      setCircleCenter((prev) => ({ ...prev, x: numValue }));
    } else if (type === "centerY") {
      setCircleCenter((prev) => ({ ...prev, y: numValue }));
    } else if (type === "radius") {
      setRadius(numValue);
    }
  };

  return (
    <div className="flex gap-6 items-start">
      {/* Control Panel */}
      <div className="flex flex-col gap-3 p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200 shadow-sm w-[240px]">
        <div className="mb-1">
          <h2 className="text-base font-bold text-gray-800 mb-0.5">中点画圆</h2>
          <p className="text-xs text-gray-600">Bresenham 圆算法</p>
        </div>

        <div className="bg-white rounded-lg p-2.5 shadow-sm">
          <h3 className="font-semibold text-xs text-red-700 mb-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            圆心
          </h3>
          <div className="space-y-1.5">
            <div className="flex gap-1.5 items-center">
              <label className="text-xs font-medium text-gray-600 w-3">X</label>
              <input
                type="number"
                value={circleCenter.x}
                onChange={(e) => handleInputChange("centerX", e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-1.5 items-center">
              <label className="text-xs font-medium text-gray-600 w-3">Y</label>
              <input
                type="number"
                value={circleCenter.y}
                onChange={(e) => handleInputChange("centerY", e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-2.5 shadow-sm">
          <h3 className="font-semibold text-xs text-red-700 mb-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            半径
          </h3>
          <input
            type="number"
            value={radius}
            onChange={(e) => handleInputChange("radius", e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Canvas */}
      <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
        <Stage width={canvasLength} height={canvasLength}>
          <Layer>
            <Image image={gridImage} x={0} y={0} width={canvasLength} height={canvasLength} />
            <CircleRenderer
              center={circleCenter}
              radius={radius}
              color={{ r: 220, g: 38, b: 38, a: 1 }}
              onCenterChange={handleCenterChange}
              onRadiusChange={handleRadiusChange}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default CircleCanvas;
