import { Circle, Group, Line, Rect } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import {
  canvasUnitLength,
  logicalToCanvasPoint,
  canvasToLogicalPoint,
  Point
} from "@renderer/utils/canvas";
import { RGBAColor, rgbaToString } from "@renderer/utils/color";
import { scanlinePolygon } from "@renderer/utils/polygon";

interface PolygonRendererProps {
  vertices: Point[];
  color: RGBAColor;
  onVertexChange?: (index: number, newPosition: Point) => void;
  onVertexDelete?: (index: number) => void;
}

/**
 * 多边形渲染器组件
 *
 * 使用扫描线算法填充多边形（待实现）
 * 当前仅渲染顶点和边框
 */
const PolygonRenderer = ({
  vertices,
  color,
  onVertexChange,
  onVertexDelete
}: PolygonRendererProps): React.JSX.Element => {
  // 将逻辑坐标转换为画布坐标
  const canvasVertices = vertices.map(logicalToCanvasPoint);
  const polygonPixels = scanlinePolygon(vertices, color);

  // 处理顶点拖拽
  const handleVertexDragMove = (index: number, e: KonvaEventObject<DragEvent>): void => {
    if (!onVertexChange) return;
    const newPos = e.target.position();
    const logicalPos = canvasToLogicalPoint(newPos);
    onVertexChange(index, logicalPos);
  };

  const handleVertexDragEnd = (index: number, e: KonvaEventObject<DragEvent>): void => {
    if (!onVertexChange) return;
    const newPos = e.target.position();
    const logicalPos = canvasToLogicalPoint(newPos);
    onVertexChange(index, logicalPos);
    // 将顶点对准网格
    const finalCanvasPos = logicalToCanvasPoint(logicalPos);
    e.target.position(finalCanvasPos);
  };

  // 处理顶点右键点击删除
  const handleVertexRightClick = (index: number, e: KonvaEventObject<PointerEvent>): void => {
    e.evt.preventDefault(); // 阻止默认右键菜单
    // 设置鼠标样式为默认
    document.body.style.cursor = "default";
    if (onVertexDelete) {
      // 获取顶点坐标信息用于确认提示
      const vertex = vertices[index];
      const confirmed = window.confirm(
        `确定要删除顶点 ${index + 1} (${vertex.x}, ${vertex.y}) 吗？`
      );
      if (confirmed) {
        onVertexDelete(index);
      }
    }
  };
  // 如果顶点数量少于3个，只渲染顶点
  if (vertices.length < 3) {
    return (
      <>
        {canvasVertices.map((vertex, index) => (
          <Circle
            key={index}
            x={vertex.x}
            y={vertex.y}
            radius={canvasUnitLength * 0.3}
            fill={rgbaToString(color)}
            stroke="#16a34a"
            strokeWidth={2}
          />
        ))}
      </>
    );
  }

  // 生成边的连线点数组（用于Konva的Line组件）
  const edgePoints: number[] = [];
  for (let i = 0; i < canvasVertices.length; i++) {
    const vertex = canvasVertices[i];
    edgePoints.push(vertex.x, vertex.y);
  }
  // 闭合多边形：连接最后一个顶点到第一个顶点
  if (canvasVertices.length > 0) {
    edgePoints.push(canvasVertices[0].x, canvasVertices[0].y);
  }

  return (
    <Group>
      {/* 绘制多边形边框 */}
      <Line
        points={edgePoints}
        stroke={rgbaToString(color)}
        strokeWidth={2}
        lineJoin="round"
        lineCap="round"
      />

      {polygonPixels.map((pixel, index) => (
        <Rect
          key={index}
          x={pixel.x}
          y={pixel.y}
          width={pixel.width}
          height={pixel.height}
          fill={rgbaToString({ ...pixel.color, a: 0.6 * (pixel.color.a ?? 1) })}
        />
      ))}

      {/* 绘制顶点（可拖拽） */}
      {canvasVertices.map((vertex, index) => (
        <Circle
          key={index}
          x={vertex.x}
          y={vertex.y}
          radius={canvasUnitLength * 0.3}
          fill={rgbaToString(color)}
          stroke="#16a34a"
          strokeWidth={2}
          draggable={onVertexChange !== undefined}
          onMouseEnter={() => {
            if (onVertexChange) {
              document.body.style.cursor = "move";
            }
          }}
          onMouseLeave={() => {
            document.body.style.cursor = "default";
          }}
          onDragMove={(e) => handleVertexDragMove(index, e)}
          onDragEnd={(e) => handleVertexDragEnd(index, e)}
          onContextMenu={(e) => handleVertexRightClick(index, e)}
        />
      ))}
    </Group>
  );
};

export default PolygonRenderer;
