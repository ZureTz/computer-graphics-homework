import { useEffect, useRef, useState } from "react";
import useImage from "use-image";
import type Konva from "konva";
import { Stage, Layer, Image, Transformer, Rect } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";

import grid from "@renderer/assets/grid-40.svg";
import {
  Point,
  canvasLength,
  logicalToCanvasPoint,
  canvasToLogicalPoint,
  Rectangle,
  canvasUnitLength
} from "@renderer/utils/canvas";
import { liangBarskyClipping } from "@renderer/utils/clipping";
import LineRenderer from "./LineRenderer";

const LineCanvas = (): React.JSX.Element => {
  const [gridImage] = useImage(grid);
  const [start, setStart] = useState<Point>({ x: -16, y: -5 });
  const [end, setEnd] = useState<Point>({ x: 16, y: 1 });
  const [algorithm, setAlgorithm] = useState<"bresenham" | "dda" | "wu">("bresenham");
  const [isSelected, setIsSelected] = useState(false);

  const [isRectangleMode, setIsRectangleMode] = useState(false);
  const [rectangle, setRectangle] = useState<Rectangle | null>(null);
  const [tempRectPoint, setTempRectPoint] = useState<Point | null>(null);

  const lineGroupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

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

  const handleTransform = (newStart: Point, newEnd: Point): void => {
    setStart(newStart);
    setEnd(newEnd);
  };

  const handleStagePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>): void => {
    const stage = e.target.getStage();
    if (!stage) return;

    const clickedOnEmpty = e.target === stage;
    const clickedTransformerHandle = e.target.getParent()?.className === "Transformer";

    if (isRectangleMode && clickedOnEmpty) {
      // 在矩形模式下点击画布
      const pos = stage.getPointerPosition();
      if (!pos) return;

      const logicalPoint = canvasToLogicalPoint(pos);

      if (tempRectPoint === null) {
        // 第一个点
        setTempRectPoint(logicalPoint);
      } else {
        // 第二个点，创建矩形
        const canvasPoint1 = tempRectPoint;
        const canvasPoint2 = logicalPoint;

        const x = Math.min(canvasPoint1.x, canvasPoint2.x);
        const y = Math.min(canvasPoint1.y, canvasPoint2.y);
        const width = Math.abs(canvasPoint2.x - canvasPoint1.x);
        const height = Math.abs(canvasPoint2.y - canvasPoint1.y);

        setRectangle({
          x,
          y,
          width,
          height
        });

        setTempRectPoint(null);
      }
    } else if (clickedOnEmpty && !clickedTransformerHandle) {
      setIsSelected(false);
      setTempRectPoint(null);
    }
  };

  const handleClipping = (): void => {
    if (!rectangle) return;

    // 将逻辑坐标的矩形转换为canvas坐标
    const canvasRect: Rectangle = {
      x: canvasRectangle?.x ?? 0,
      y: canvasRectangle?.y ?? 0,
      width: canvasRectangle?.width ?? 0,
      height: canvasRectangle?.height ?? 0
    };

    // 将直线端点转换为canvas坐标
    const canvasStart = logicalToCanvasPoint(start);
    const canvasEnd = logicalToCanvasPoint(end);

    // 执行裁剪
    const clippedPoints = liangBarskyClipping(canvasRect, canvasStart, canvasEnd);

    if (clippedPoints) {
      // 将裁剪后的点转换回逻辑坐标
      const newStart = canvasToLogicalPoint(clippedPoints[0]);
      const newEnd = canvasToLogicalPoint(clippedPoints[1]);
      setStart(newStart);
      setEnd(newEnd);
    }
  };

  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;

    if (isSelected && lineGroupRef.current) {
      transformer.nodes([lineGroupRef.current]);
      transformer.getLayer()?.batchDraw();
      transformer.forceUpdate?.();
    } else {
      transformer.nodes([]);
    }
  }, [isSelected, start, end]);

  const canvasRectanglePoint = logicalToCanvasPoint({
    x: rectangle?.x ?? 0,
    y: (rectangle?.y ?? 0) + (rectangle?.height ?? 0)
  });
  const canvasRectangle = {
    x: canvasRectanglePoint.x,
    y: canvasRectanglePoint.y,
    width: (rectangle?.width ?? 0) * canvasUnitLength,
    height: (rectangle?.height ?? 0) * canvasUnitLength
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
        {/* Rectangle Mode Toggle */}
        <div className="bg-white rounded-lg p-2.5 shadow-sm">
          <h3 className="font-semibold text-xs text-blue-700 mb-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            裁切模式
          </h3>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={isRectangleMode}
              onChange={(e) => {
                setIsRectangleMode(e.target.checked);
                setTempRectPoint(null);
                if (e.target.checked) {
                  setIsSelected(false);
                  return;
                }
                // 取消toggle时清除矩形数据
                setTempRectPoint(null);
                setRectangle(null);
              }}
              className="w-3.5 h-3.5 text-green-600 focus:ring-1 focus:ring-green-400 cursor-pointer rounded"
            />
            <span className="text-xs text-gray-700 group-hover:text-green-600 transition-colors">
              矩形裁切模式
            </span>
          </label>
          {isRectangleMode && (
            <p className="text-xs text-green-600 mt-1.5 pl-5">
              {tempRectPoint ? "点击第二个点" : "点击第一个点"}
            </p>
          )}
          {isRectangleMode && rectangle && (
            <button
              onClick={handleClipping}
              className="mt-2 w-full px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
            >
              裁剪直线
            </button>
          )}
        </div>

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
        <Stage
          width={canvasLength}
          height={canvasLength}
          onMouseDown={handleStagePointerDown}
          onTouchStart={handleStagePointerDown}
        >
          <Layer>
            <Image
              image={gridImage}
              x={0}
              y={0}
              width={canvasLength}
              height={canvasLength}
              listening={false}
            />
            {/* 绘制矩形（位于最底层，不影响点击） */}
            {isRectangleMode && rectangle && canvasRectangle && (
              <Rect
                x={canvasRectangle.x}
                y={canvasRectangle.y}
                width={canvasRectangle.width}
                height={canvasRectangle.height}
                stroke="#10b981"
                strokeWidth={2}
                fill="rgba(16, 185, 129, 0.1)"
                listening={false}
              />
            )}
            {/* 绘制临时矩形点 */}
            {tempRectPoint && (
              <Rect
                x={logicalToCanvasPoint(tempRectPoint).x - 3}
                y={logicalToCanvasPoint(tempRectPoint).y - 3}
                width={6}
                height={6}
                fill="#10b981"
                listening={false}
              />
            )}
            <LineRenderer
              ref={lineGroupRef}
              start={start}
              end={end}
              color={{ r: 30, g: 144, b: 255, a: 1 }}
              algorithm={algorithm}
              onStartChange={handleStartChange}
              onEndChange={handleEndChange}
              onSelect={() => setIsSelected(true)}
              onTransform={handleTransform}
              isSelected={isSelected}
            />
            <Transformer ref={transformerRef} rotateEnabled centeredScaling anchorSize={8} />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default LineCanvas;
