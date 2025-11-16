import { forwardRef, useImperativeHandle, useRef } from "react";
import type Konva from "konva";
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
import { bresenhamLine } from "@renderer/utils/line";

interface PolygonRendererProps {
  vertices: Point[];
  color: RGBAColor;
  onVertexChange?: (index: number, newPosition: Point) => void;
  onVertexDelete?: (index: number) => void;
  onSelect?: () => void;
  onTransform?: (newVertices: Point[]) => void;
  isSelected?: boolean;
}

/**
 * 多边形渲染器组件
 *
 * 使用扫描线算法填充多边形
 * 支持顶点编辑、拖拽、变换（平移、旋转、缩放）
 */
const PolygonRenderer = forwardRef<Konva.Group, PolygonRendererProps>(
  (
    { vertices, color, onVertexChange, onVertexDelete, onSelect, onTransform, isSelected = false },
    ref
  ) => {
    // 将逻辑坐标转换为画布坐标
    const canvasVertices = vertices.map(logicalToCanvasPoint);
    const polygonPixels = scanlinePolygon(vertices, color);
    const groupRef = useRef<Konva.Group>(null);

    useImperativeHandle(ref, () => groupRef.current as Konva.Group);

    // 处理 Group 变换（平移、旋转、缩放）
    const handleGroupTransform = (): void => {
      if (!onTransform || !groupRef.current) {
        return;
      }

      const group = groupRef.current;
      const scaleX = group.scaleX();
      const scaleY = group.scaleY();
      const rotation = (group.rotation() * Math.PI) / 180; // 转换为弧度
      const groupPos = group.position();

      // 计算变换后的顶点
      const transformedVertices = canvasVertices.map((vertex) => {
        // 应用缩放
        const x = vertex.x * scaleX;
        const y = vertex.y * scaleY;

        // 应用旋转（绕原点）
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const rotatedX = x * cos - y * sin;
        const rotatedY = x * sin + y * cos;

        // 应用平移
        const finalX = rotatedX + groupPos.x;
        const finalY = rotatedY + groupPos.y;

        // 转换回逻辑坐标
        return canvasToLogicalPoint({ x: finalX, y: finalY });
      });

      onTransform(transformedVertices);

      // 重置 group 变换
      group.position({ x: 0, y: 0 });
      group.rotation(0);
      group.scale({ x: 1, y: 1 });
    };

    // 处理选择
    const handleSelect = (e: KonvaEventObject<MouseEvent | TouchEvent>): void => {
      onSelect?.();
      e.cancelBubble = true;
    };

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

    // 生成多边形顶点数组（用于Konva的Line组件作为多边形）
    const polygonPoints: number[] = [];
    for (let i = 0; i < canvasVertices.length; i++) {
      const vertex = canvasVertices[i];
      polygonPoints.push(vertex.x, vertex.y);
    }

    return (
      <Group
        ref={groupRef}
        draggable={isSelected}
        onDragEnd={handleGroupTransform}
        onTransformEnd={handleGroupTransform}
        onClick={handleSelect}
        onTap={handleSelect}
      >
        {/* 绘制多边形边框 */}
        <Line
          points={polygonPoints}
          stroke={rgbaToString(color)}
          strokeWidth={2}
          lineJoin="round"
          lineCap="round"
          closed={true}
        />

        {/* 绘制多边形填充像素 */}
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

        {/* 单独绘制绘制各条线像素 */}
        {vertices.map((start, i) => {
          const end = vertices[(i + 1) % vertices.length];
          const linePixelsInfo = bresenhamLine(start, end, color);
          return linePixelsInfo.map((pixel, index) => (
            <Rect
              x={pixel.x}
              y={pixel.y}
              width={pixel.width}
              height={pixel.height}
              fill={rgbaToString({ ...pixel.color, a: 0.6 * (pixel.color.a ?? 1) })}
              key={`${i}-line-pixel-${index}`}
            />
          ));
        })}

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
            draggable={onVertexChange !== undefined && !isSelected}
            onMouseEnter={() => {
              if (onVertexChange && !isSelected) {
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
  }
);

PolygonRenderer.displayName = "PolygonRenderer";

export default PolygonRenderer;
