import { KonvaEventObject } from "konva/lib/Node";
import { Arrow, Circle, Ellipse, Group, Line, Rect } from "react-konva";

import {
  canvasToLogicalPoint,
  canvasUnitLength,
  logicalToCanvasPoint,
  Point
} from "@renderer/utils/canvas";
import { RGBAColor, rgbaToString } from "@renderer/utils/color";
import { useState } from "react";
import { midpointEllipse } from "@renderer/utils/ellipse";

const EllipseRenderer = ({
  center,
  radiusX,
  radiusY,
  color,
  onCenterChange,
  onRadiusXChange,
  onRadiusYChange
}: {
  center: Point;
  radiusX: number;
  radiusY: number;
  color: RGBAColor;
  onCenterChange?: (newCenter: Point) => void;
  onRadiusXChange?: (newRadiusX: number) => void;
  onRadiusYChange?: (newRadiusY: number) => void;
}): React.JSX.Element => {
  const canvasEllipseCenter = logicalToCanvasPoint(center);
  // 使用中点椭圆算法计算像素点
  const ellipsePixelInfo = midpointEllipse(center, radiusX, radiusY, color);
  const [isEllipseDragging, setIsEllipseDragging] = useState<boolean>(false);

  // 处理椭圆整体拖动
  const handleEllipseDragMove = (e: KonvaEventObject<DragEvent>): void => {
    if (!onCenterChange) return;
    // 设置正在拖拽的状态，阻止当前中心渲染
    if (!isEllipseDragging) setIsEllipseDragging(true);

    // 实时更新中心位置
    const newPos = e.target.position();
    const logicalPos = canvasToLogicalPoint(newPos);
    onCenterChange(logicalPos);
  };

  const handleEllipseDragEnd = (e: KonvaEventObject<DragEvent>): void => {
    if (!onCenterChange) return;
    const newPos = e.target.position();
    const logicalPos = canvasToLogicalPoint(newPos);
    onCenterChange(logicalPos);
    // 将椭圆的中心对准网格
    const finalCanvasPos = logicalToCanvasPoint(logicalPos);
    e.target.position(finalCanvasPos);
    // 结束拖拽
    setIsEllipseDragging(false);
  };

  // 处理长轴（X轴）半径调整
  const handleRadiusXDragMove = (e: KonvaEventObject<DragEvent>): void => {
    if (!onRadiusXChange) return;

    const newPos = e.target.position();
    const dx = newPos.x - canvasEllipseCenter.x;
    const newRadiusX = Math.max(1, Math.round(dx / canvasUnitLength));
    onRadiusXChange(newRadiusX);
  };

  const handleRadiusXDragEnd = (e: KonvaEventObject<DragEvent>): void => {
    if (!onRadiusXChange) return;

    const newPos = e.target.position();
    const dx = newPos.x - canvasEllipseCenter.x;
    const newRadiusX = Math.max(1, Math.round(dx / canvasUnitLength));
    onRadiusXChange(newRadiusX);

    // 将箭头对准椭圆的边缘
    e.target.position({
      x: canvasEllipseCenter.x + newRadiusX * canvasUnitLength,
      y: canvasEllipseCenter.y
    });
  };

  // 处理短轴（Y轴）半径调整
  const handleRadiusYDragMove = (e: KonvaEventObject<DragEvent>): void => {
    if (!onRadiusYChange) return;

    const newPos = e.target.position();
    const dy = newPos.y - canvasEllipseCenter.y;
    const newRadiusY = Math.max(1, Math.round(dy / canvasUnitLength));
    onRadiusYChange(newRadiusY);
  };

  const handleRadiusYDragEnd = (e: KonvaEventObject<DragEvent>): void => {
    if (!onRadiusYChange) return;

    const newPos = e.target.position();
    const dy = newPos.y - canvasEllipseCenter.y;
    const newRadiusY = Math.max(1, Math.round(dy / canvasUnitLength));
    onRadiusYChange(newRadiusY);

    // 将箭头对准椭圆的边缘
    e.target.position({
      x: canvasEllipseCenter.x,
      y: canvasEllipseCenter.y + newRadiusY * canvasUnitLength
    });
  };

  return (
    <Group>
      {/* 可拖动的椭圆 */}
      {onCenterChange && onRadiusXChange && onRadiusYChange && (
        <>
          <Ellipse
            x={canvasEllipseCenter.x}
            y={canvasEllipseCenter.y}
            radiusX={radiusX * canvasUnitLength}
            radiusY={radiusY * canvasUnitLength}
            fill={rgbaToString({ ...color, a: 0.3 })}
            stroke={rgbaToString(color)}
            strokeWidth={3}
            draggable
            onMouseEnter={() => (document.body.style.cursor = "move")}
            onMouseLeave={() => (document.body.style.cursor = "default")}
            onDragMove={handleEllipseDragMove}
            onDragEnd={handleEllipseDragEnd}
          />

          {/* 长轴和短轴的可拖动箭头（仅在非拖拽状态显示） */}
          {!isEllipseDragging && (
            <>
              {/* 长轴（X轴）箭头 - 向上延伸 */}
              <Arrow
                x={canvasEllipseCenter.x}
                y={canvasEllipseCenter.y}
                points={[0, 0, 0, -1.2 * radiusY * canvasUnitLength]}
                pointerLength={5}
                pointerWidth={5}
                stroke={rgbaToString({ ...color, a: 0.5 })}
                strokeWidth={3}
              />
              {/* 长轴（X轴）可拖动箭头 - 向右延伸 */}
              <Arrow
                x={canvasEllipseCenter.x + radiusX * canvasUnitLength}
                y={canvasEllipseCenter.y}
                points={[0, 0, 0, -1.2 * radiusY * canvasUnitLength]}
                pointerLength={5}
                pointerWidth={5}
                stroke={rgbaToString({ ...color, a: 0.5 })}
                strokeWidth={3}
                draggable
                onMouseOver={() => (document.body.style.cursor = "ew-resize")}
                onMouseOut={() => (document.body.style.cursor = "default")}
                onDragMove={handleRadiusXDragMove}
                onDragEnd={handleRadiusXDragEnd}
              />
              {/* 长轴虚线 - 水平 */}
              <Line
                x={canvasEllipseCenter.x}
                y={canvasEllipseCenter.y - 1.2 * radiusY * canvasUnitLength}
                points={[0, 0, radiusX * canvasUnitLength, 0]}
                stroke={rgbaToString({ ...color, a: 0.5 })}
                strokeWidth={2}
                dash={[10, 5]}
              />

              {/* 短轴（Y轴）箭头 - 向左延伸 */}
              <Arrow
                x={canvasEllipseCenter.x}
                y={canvasEllipseCenter.y}
                points={[0, 0, -1.2 * radiusX * canvasUnitLength, 0]}
                pointerLength={5}
                pointerWidth={5}
                stroke={rgbaToString({ ...color, a: 0.5 })}
                strokeWidth={3}
              />
              {/* 短轴（Y轴）可拖动箭头 - 向下延伸 */}
              <Arrow
                x={canvasEllipseCenter.x}
                y={canvasEllipseCenter.y + radiusY * canvasUnitLength}
                points={[0, 0, -1.2 * radiusX * canvasUnitLength, 0]}
                pointerLength={5}
                pointerWidth={5}
                stroke={rgbaToString({ ...color, a: 0.5 })}
                strokeWidth={3}
                draggable
                onMouseOver={() => (document.body.style.cursor = "ns-resize")}
                onMouseOut={() => (document.body.style.cursor = "default")}
                onDragMove={handleRadiusYDragMove}
                onDragEnd={handleRadiusYDragEnd}
              />
              {/* 短轴虚线 - 垂直 */}
              <Line
                x={canvasEllipseCenter.x - 1.2 * radiusX * canvasUnitLength}
                y={canvasEllipseCenter.y}
                points={[0, 0, 0, radiusY * canvasUnitLength]}
                stroke={rgbaToString({ ...color, a: 0.5 })}
                strokeWidth={2}
                dash={[10, 5]}
              />

              {/* 椭圆中心点（仅在非拖拽时显示） */}
              <Circle
                x={canvasEllipseCenter.x}
                y={canvasEllipseCenter.y}
                radius={canvasUnitLength * 0.3}
                fill={rgbaToString(color)}
                stroke="white"
                strokeWidth={1}
              />
            </>
          )}

          {/* 绘制椭圆像素 */}
          {ellipsePixelInfo.map((pixel, index) => (
            <Rect
              key={index}
              x={pixel.x}
              y={pixel.y}
              width={pixel.width}
              height={pixel.height}
              fill={rgbaToString({ ...color, a: 0.8 * (pixel.color.a ?? 1) })}
            />
          ))}
        </>
      )}
    </Group>
  );
};

export default EllipseRenderer;
