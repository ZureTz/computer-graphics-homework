import useImage from "use-image";
import { Stage, Layer, Image } from "react-konva";

import grid from "@renderer/assets/grid-40.svg";
import { canvasLength, Point } from "@renderer/utils/canvas";
import { useState } from "react";
import EllipseRenderer from "./EllipseRenderer";

const EllipseCanvas = (): React.JSX.Element => {
  const [gridImage] = useImage(grid);
  const [ellipseCenter, setEllipseCenter] = useState<Point>({ x: 0, y: 0 });
  const [radiusX, setRadiusX] = useState<number>(12); // 长轴半径
  const [radiusY, setRadiusY] = useState<number>(8); // 短轴半径

  const handleCenterChange = (newCenter: Point): void => {
    setEllipseCenter(newCenter);
  };

  const handleRadiusXChange = (newRadiusX: number): void => {
    setRadiusX(newRadiusX);
  };

  const handleRadiusYChange = (newRadiusY: number): void => {
    setRadiusY(newRadiusY);
  };

  const handleInputChange = (
    type: "centerX" | "centerY" | "radiusX" | "radiusY",
    value: string
  ): void => {
    const numValue = parseInt(value) || 0;
    if (type === "centerX") {
      setEllipseCenter((prev) => ({ ...prev, x: numValue }));
    } else if (type === "centerY") {
      setEllipseCenter((prev) => ({ ...prev, y: numValue }));
    } else if (type === "radiusX") {
      setRadiusX(Math.max(1, numValue));
    } else if (type === "radiusY") {
      setRadiusY(Math.max(1, numValue));
    }
  };

  return (
    <div className="flex gap-6 items-start">
      {/* Control Panel */}
      <div className="flex flex-col gap-3 p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200 shadow-sm w-[240px]">
        <div className="mb-1">
          <h2 className="text-base font-bold text-gray-800 mb-0.5">中点画椭圆</h2>
          <p className="text-xs text-gray-600">拖动或调整长短轴</p>
        </div>

        <div className="bg-white rounded-lg p-2.5 shadow-sm">
          <h3 className="font-semibold text-xs text-purple-700 mb-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            中心
          </h3>
          <div className="space-y-1.5">
            <div className="flex gap-1.5 items-center">
              <label className="text-xs font-medium text-gray-600 w-3">X</label>
              <input
                type="number"
                value={ellipseCenter.x}
                onChange={(e) => handleInputChange("centerX", e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-1.5 items-center">
              <label className="text-xs font-medium text-gray-600 w-3">Y</label>
              <input
                type="number"
                value={ellipseCenter.y}
                onChange={(e) => handleInputChange("centerY", e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-2.5 shadow-sm">
          <h3 className="font-semibold text-xs text-purple-700 mb-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            半径
          </h3>
          <div className="space-y-1.5">
            <div className="flex gap-1.5 items-center">
              <label className="text-xs font-medium text-gray-600 w-3">a</label>
              <input
                type="number"
                value={radiusX}
                onChange={(e) => handleInputChange("radiusX", e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-1.5 items-center">
              <label className="text-xs font-medium text-gray-600 w-3">b</label>
              <input
                type="number"
                value={radiusY}
                onChange={(e) => handleInputChange("radiusY", e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
        <Stage width={canvasLength} height={canvasLength}>
          <Layer>
            <Image image={gridImage} x={0} y={0} width={canvasLength} height={canvasLength} />
            <EllipseRenderer
              center={ellipseCenter}
              radiusX={radiusX}
              radiusY={radiusY}
              color={{ r: 147, g: 51, b: 234, a: 1 }}
              onCenterChange={handleCenterChange}
              onRadiusXChange={handleRadiusXChange}
              onRadiusYChange={handleRadiusYChange}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default EllipseCanvas;
