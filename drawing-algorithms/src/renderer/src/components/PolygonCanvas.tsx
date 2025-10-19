import useImage from "use-image";
import { Stage, Layer, Image } from "react-konva";
import { useState } from "react";

import grid from "@renderer/assets/grid-40.svg";
import { canvasLength, canvasToLogicalPoint, Point } from "@renderer/utils/canvas";
import PolygonRenderer from "./PolygonRenderer";

const PolygonCanvas = (): React.JSX.Element => {
  const [gridImage] = useImage(grid);
  const [vertices, setVertices] = useState<Point[]>([]);

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

  // 通过点击画布添加顶点
  const handleCanvasClick = (e: unknown): void => {
    const stage = (
      e as {
        target: { getStage: () => { getPointerPosition: () => { x: number; y: number } | null } };
      }
    ).target.getStage();
    const pointerPosition = stage.getPointerPosition();
    if (pointerPosition) {
      const logicalPoint = canvasToLogicalPoint(pointerPosition);
      // 检查该坐标是否已被占用
      if (isCoordinateOccupied(logicalPoint)) {
        return; // 如果已占用，不添加
      }
      setVertices([...vertices, logicalPoint]);
    }
  };

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

        {/* 操作说明 */}
        <div className="bg-white rounded-lg p-2.5 shadow-sm border-2 border-green-100 flex-shrink-0">
          <h3 className="font-semibold text-xs text-green-700 mb-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            操作说明
          </h3>
          <ul className="text-xs text-gray-600 leading-relaxed space-y-0.5">
            <li>• 点击&ldquo;添加&rdquo;或点击画布添加顶点</li>
            <li>• 手动编辑顶点坐标</li>
            <li>• 拖拽顶点调整位置</li>
            <li>• 右键点击顶点删除</li>
            <li>• 点击&ldquo;×&rdquo;按钮删除顶点</li>
          </ul>
        </div>
      </div>

      {/* Canvas */}
      <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
        <Stage width={canvasLength} height={canvasLength} onClick={handleCanvasClick}>
          <Layer>
            <Image image={gridImage} x={0} y={0} width={canvasLength} height={canvasLength} />
            <PolygonRenderer
              vertices={vertices}
              color={{ r: 34, g: 197, b: 94, a: 1 }}
              onVertexChange={handleVertexDrag}
              onVertexDelete={handleRemoveVertex}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default PolygonCanvas;
