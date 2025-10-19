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
      <div className="flex flex-col gap-4 p-5 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200 shadow-sm min-w-[220px]">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-gray-800 mb-1">中点画圆算法</h2>
          <p className="text-xs text-gray-600">使用中点画圆算法绘制圆形</p>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <h3 className="font-semibold text-sm text-red-700 mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            圆心坐标
          </h3>
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <label className="text-xs font-medium text-gray-600 w-5">X:</label>
              <input
                type="number"
                value={circleCenter.x}
                onChange={(e) => handleInputChange("centerX", e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div className="flex gap-2 items-center">
              <label className="text-xs font-medium text-gray-600 w-5">Y:</label>
              <input
                type="number"
                value={circleCenter.y}
                onChange={(e) => handleInputChange("centerY", e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <h3 className="font-semibold text-sm text-red-700 mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            半径
          </h3>
          <input
            type="number"
            value={radius}
            onChange={(e) => handleInputChange("radius", e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
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
