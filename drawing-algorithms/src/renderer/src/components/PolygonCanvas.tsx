import { useEffect, useRef, useState } from "react";
import useImage from "use-image";
import type Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage, Layer, Image, Transformer, Rect } from "react-konva";

import grid from "@renderer/assets/grid-40.svg";
import {
  canvasLength,
  canvasToLogicalPoint,
  logicalToCanvasPoint,
  Point,
  Rectangle,
  canvasUnitLength
} from "@renderer/utils/canvas";
import { sutherlandHodgmanClipping } from "@renderer/utils/clipping";
import PolygonRenderer from "./PolygonRenderer";

const PolygonCanvas = (): React.JSX.Element => {
  const [gridImage] = useImage(grid);
  const [vertices, setVertices] = useState<Point[]>([
    { x: -12, y: -8 },
    { x: 0, y: -10 },
    { x: 10, y: 0 },
    { x: 5, y: 8 },
    { x: -8, y: 5 }
  ]);
  const [isSelected, setIsSelected] = useState(false);
  const [isRectangleMode, setIsRectangleMode] = useState(false);
  const [rectangle, setRectangle] = useState<Rectangle | null>(null);
  const [tempRectPoint, setTempRectPoint] = useState<Point | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const polygonGroupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  // 添加新顶点
  const handleAddVertex = (): void => {
    setVertices([...vertices, { x: 0, y: 0 }]);
  };

  // 删除指定顶点
  const handleRemoveVertex = (index: number): void => {
    setVertices(vertices.filter((_, i) => i !== index));
  };

  // 检查坐标是否已被其他顶点占用
  const isCoordinateOccupied = (point: Point, excludeIndex?: number): boolean => {
    return vertices.some((vertex, index) => {
      if (excludeIndex !== undefined && index === excludeIndex) {
        return false;
      }
      return vertex.x === point.x && vertex.y === point.y;
    });
  };

  // 更新顶点坐标（通过输入框）
  const handleVertexChange = (index: number, axis: "x" | "y", value: string): void => {
    const numValue = parseInt(value) || 0;
    const newVertices = [...vertices];
    const newVertex = { ...newVertices[index], [axis]: numValue };

    // 检查新坐标是否与其他顶点重复
    if (isCoordinateOccupied(newVertex, index)) {
      return; // 如果重复，不更新
    }

    newVertices[index] = newVertex;
    setVertices(newVertices);
  };

  // 通过拖拽更新顶点坐标
  const handleVertexDrag = (index: number, newPosition: Point): void => {
    // 检查新坐标是否与其他顶点重复
    if (isCoordinateOccupied(newPosition, index)) {
      return; // 如果重复，不更新
    }

    const newVertices = [...vertices];
    newVertices[index] = newPosition;
    setVertices(newVertices);
  };

  // 处理变换（平移、旋转、缩放）
  const handleTransform = (newVertices: Point[]): void => {
    setVertices(newVertices);
  };

  // 处理多边形裁剪
  const handleClipping = (): void => {
    if (!rectangle || vertices.length < 3) return;

    // 将逻辑坐标的矩形转换为裁剪多边形的顶点数组（逆时针方向）
    const clipPolygon: Point[] = [
      { x: rectangle.x, y: rectangle.y },
      { x: rectangle.x + rectangle.width, y: rectangle.y },
      { x: rectangle.x + rectangle.width, y: rectangle.y + rectangle.height },
      { x: rectangle.x, y: rectangle.y + rectangle.height }
    ];

    // 执行 Sutherland-Hodgman 裁剪算法
    const clippedVertices = sutherlandHodgmanClipping(vertices, clipPolygon);

    // 更新顶点：四舍五入到整数坐标并去重
    if (clippedVertices.length >= 3) {
      // 将坐标四舍五入到整数
      const roundedVertices = clippedVertices.map((v) => ({
        x: Math.round(v.x),
        y: Math.round(v.y)
      }));

      // 去除重复的相邻顶点
      const deduplicatedVertices: Point[] = [];
      for (let i = 0; i < roundedVertices.length; i++) {
        const current = roundedVertices[i];
        const next = roundedVertices[(i + 1) % roundedVertices.length];

        // 只有当前顶点与下一个顶点不同时才添加
        if (current.x !== next.x || current.y !== next.y) {
          deduplicatedVertices.push(current);
        }
      }

      // 确保至少有3个顶点
      if (deduplicatedVertices.length >= 3) {
        setVertices(deduplicatedVertices);
      }
    }
  };

  // 通过点击画布添加顶点或绘制矩形
  const handleCanvasClick = (e: KonvaEventObject<MouseEvent>): void => {
    const stage = e.target.getStage();
    if (!stage) return;

    // 检查是否点击了多边形或其控制点
    const clickedOnPolygon = e.target !== stage && e.target.getParent() === polygonGroupRef.current;
    const clickedOnTransformer = e.target.getParent()?.className === "Transformer";

    if (clickedOnPolygon || clickedOnTransformer) return;

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    const logicalPoint = canvasToLogicalPoint(pointerPosition);

    if (isRectangleMode) {
      // 矩形模式：绘制裁剪矩形
      if (tempRectPoint === null) {
        // 第一个点
        setTempRectPoint(logicalPoint);
      } else {
        // 第二个点，创建矩形
        const x = Math.min(tempRectPoint.x, logicalPoint.x);
        const y = Math.min(tempRectPoint.y, logicalPoint.y);
        const width = Math.abs(logicalPoint.x - tempRectPoint.x);
        const height = Math.abs(logicalPoint.y - tempRectPoint.y);

        setRectangle({
          x,
          y,
          width,
          height
        });

        setTempRectPoint(null);
      }
    } else {
      // 普通模式：添加顶点
      // 检查该坐标是否已被占用
      if (isCoordinateOccupied(logicalPoint)) {
        return; // 如果已占用，不添加
      }
      setVertices([...vertices, logicalPoint]);
    }
  };

  // 更新 Transformer
  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;

    if (isSelected && polygonGroupRef.current) {
      transformer.nodes([polygonGroupRef.current]);
      transformer.getLayer()?.batchDraw();
      transformer.forceUpdate?.();
    } else {
      transformer.nodes([]);
    }
  }, [isSelected, vertices]);

  // 监听 ESC 键取消选中
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && isSelected) {
        setIsSelected(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelected]);

  return (
    <div className="flex gap-6 items-start">
      {/* Control Panel */}
      <div
        className="flex flex-col gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm w-[240px]"
        style={{ maxHeight: `${canvasLength}px` }}
      >
        <div className="mb-1 flex-shrink-0">
          <h2 className="text-base font-bold text-gray-800 mb-0.5">多边形填充</h2>
          <p className="text-xs text-gray-600">扫描线算法</p>
        </div>

        {/* 矩形模式切换 */}
        <div className="bg-white rounded-lg p-2.5 shadow-sm flex-shrink-0">
          <h3 className="font-semibold text-xs text-green-700 mb-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
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
                } else {
                  setRectangle(null);
                }
              }}
              className="w-3.5 h-3.5 text-blue-600 focus:ring-1 focus:ring-blue-400 cursor-pointer rounded"
            />
            <span className="text-xs text-gray-700 group-hover:text-blue-600 transition-colors">
              矩形裁切模式
            </span>
          </label>
          {isRectangleMode && (
            <p className="text-xs text-blue-600 mt-1.5 pl-5">
              {tempRectPoint ? "点击第二个点" : "点击第一个点"}
            </p>
          )}
          {isRectangleMode && rectangle && (
            <button
              onClick={handleClipping}
              className="mt-2 w-full px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              裁剪多边形
            </button>
          )}
        </div>

        {/* 顶点列表 */}
        <div className="bg-white rounded-lg p-2.5 shadow-sm border-2 border-green-100 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <h3 className="font-semibold text-xs text-green-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              顶点 ({vertices.length})
            </h3>
            <button
              onClick={handleAddVertex}
              className="px-1.5 py-0.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-all flex items-center gap-0.5"
            >
              <span className="text-sm font-bold">+</span>
              <span>添加</span>
            </button>
          </div>

          {/* 顶点滚动列表 - 自定义滚动条 */}
          <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar">
            {vertices.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">暂无顶点</p>
            ) : (
              vertices.map((vertex, index) => (
                <div
                  key={index}
                  className="flex items-start gap-1.5 p-1.5 bg-gray-50 rounded border border-gray-200 hover:border-green-300 transition-colors"
                >
                  <span className="text-xs font-semibold text-gray-600 min-w-[16px] pt-0.5">
                    {index + 1}
                  </span>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <label className="text-xs text-gray-500 w-4 flex-shrink-0">X</label>
                      <input
                        type="number"
                        value={vertex.x}
                        onChange={(e) => handleVertexChange(index, "x", e.target.value)}
                        className="w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <label className="text-xs text-gray-500 w-4 flex-shrink-0">Y</label>
                      <input
                        type="number"
                        value={vertex.y}
                        onChange={(e) => handleVertexChange(index, "y", e.target.value)}
                        className="w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveVertex(index)}
                    className="px-1.5 py-0.5 bg-red-400 hover:bg-red-500 text-white text-xs rounded transition-all leading-none flex-shrink-0 self-start mt-0.5"
                    title="删除顶点"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 帮助提示 */}
        <div className="bg-white rounded-lg p-2.5 shadow-sm border-2 border-green-100 flex-shrink-0">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="w-full flex items-center justify-between text-xs font-semibold text-green-700 hover:text-green-800 transition-colors"
          >
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              操作提示
            </span>
            <span className="text-lg leading-none">{showHelp ? "−" : "+"}</span>
          </button>
          {showHelp && (
            <ul className="text-xs text-gray-600 leading-relaxed space-y-0.5 mt-2 pl-3">
              <li>• 点击画布添加顶点</li>
              <li>• 编辑坐标或拖拽顶点</li>
              <li>• 点击多边形后可变换</li>
              <li>
                • 按 <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">ESC</kbd> 取消
              </li>
            </ul>
          )}
          {!showHelp && (
            <p className="text-xs text-gray-500 mt-1.5">点击画布添加顶点，编辑坐标调整位置</p>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
        <Stage width={canvasLength} height={canvasLength} onClick={handleCanvasClick}>
          <Layer>
            <Image image={gridImage} x={0} y={0} width={canvasLength} height={canvasLength} />
            {/* 绘制矩形（位于最底层，不影响点击） */}
            {isRectangleMode &&
              rectangle &&
              (() => {
                const canvasRectPoint = logicalToCanvasPoint({
                  x: rectangle.x,
                  y: rectangle.y + rectangle.height
                });
                return (
                  <Rect
                    x={canvasRectPoint.x}
                    y={canvasRectPoint.y}
                    width={rectangle.width * canvasUnitLength}
                    height={rectangle.height * canvasUnitLength}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="rgba(59, 130, 246, 0.1)"
                    listening={false}
                  />
                );
              })()}
            {/* 绘制临时矩形点 */}
            {tempRectPoint && (
              <Rect
                x={logicalToCanvasPoint(tempRectPoint).x - 3}
                y={logicalToCanvasPoint(tempRectPoint).y - 3}
                width={6}
                height={6}
                fill="#3b82f6"
                listening={false}
              />
            )}
            <PolygonRenderer
              ref={polygonGroupRef}
              vertices={vertices}
              color={{ r: 34, g: 197, b: 94, a: 1 }}
              onVertexChange={handleVertexDrag}
              onVertexDelete={handleRemoveVertex}
              onSelect={() => setIsSelected(true)}
              onTransform={handleTransform}
              isSelected={isSelected}
            />
            <Transformer
              ref={transformerRef}
              rotateEnabled
              centeredScaling
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
                "top-center",
                "bottom-center",
                "middle-left",
                "middle-right"
              ]}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default PolygonCanvas;
