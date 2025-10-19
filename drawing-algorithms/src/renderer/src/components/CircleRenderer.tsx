import { KonvaEventObject } from "konva/lib/Node";
import { Arrow, Circle, Group, Line, Rect } from "react-konva";

import {
  canvasToLogicalPoint,
  canvasUnitLength,
  logicalToCanvasPoint,
  Point
} from "@renderer/utils/canvas";
import { RGBAColor, rgbaToString } from "@renderer/utils/color";
import { useState } from "react";
import { midpointCircle } from "@renderer/utils/circle";

const CircleRenderer = ({
  center,
  radius,
  color,
  onCenterChange,
  onRadiusChange
}: {
  center: Point;
  radius: number;
  color: RGBAColor;
  onCenterChange?: (newCenter: Point) => void;
  onRadiusChange?: (newRadius: number) => void;
}): React.JSX.Element => {
  const canvasCircleCenter = logicalToCanvasPoint(center);
  const circlePixelInfo = midpointCircle(center, radius, color);
  const [isCircleDragging, setIsCircleDragging] = useState<boolean>(false);

  const handleCircleDragMove = (e: KonvaEventObject<DragEvent>): void => {
    if (!onCenterChange) return;
    // 设置正在拖拽的状态，阻止当前圆心渲染
    if (!isCircleDragging) setIsCircleDragging(true);

    // 实时更新圆心位置
    const newPos = e.target.position();
    const logicalPos = canvasToLogicalPoint(newPos);
    onCenterChange(logicalPos);
  };

  const handleCircleDragEnd = (e: KonvaEventObject<DragEvent>): void => {
    if (!onCenterChange) return;
    const newPos = e.target.position();
    const logicalPos = canvasToLogicalPoint(newPos);
    onCenterChange(logicalPos);
    // 将圆的中心对准网格
    const finalCanvasPos = logicalToCanvasPoint(logicalPos);
    e.target.position(finalCanvasPos);
    // 结束拖拽
    setIsCircleDragging(false);
  };

  const handleRadiusDragMove = (e: KonvaEventObject<DragEvent>): void => {
    if (!onRadiusChange) return;

    const newPos = e.target.position();
    const dx = newPos.x - canvasCircleCenter.x;
    const newRadius = Math.max(1, Math.round(dx / canvasUnitLength));
    onRadiusChange(newRadius);
  };

  const handleRadiusDragEnd = (e: KonvaEventObject<DragEvent>): void => {
    if (!onRadiusChange) return;

    const newPos = e.target.position();
    const dx = newPos.x - canvasCircleCenter.x;
    const newRadius = Math.max(1, Math.round(dx / canvasUnitLength));
    onRadiusChange(newRadius);

    // 将箭头对准圆的边缘
    e.target.position({
      x: canvasCircleCenter.x + newRadius * canvasUnitLength,
      y: canvasCircleCenter.y
    });
  };

  return (
    <Group>
      {/* Draggable circle */}
      {onCenterChange && onRadiusChange && (
        <>
          <Circle
            x={canvasCircleCenter.x}
            y={canvasCircleCenter.y}
            radius={radius * canvasUnitLength}
            fill={rgbaToString({ ...color, a: 0.3 })}
            stroke={rgbaToString(color)}
            strokeWidth={3}
            draggable
            onMouseEnter={() => (document.body.style.cursor = "move")}
            onMouseLeave={() => (document.body.style.cursor = "default")}
            onDragMove={handleCircleDragMove}
            onDragEnd={handleCircleDragEnd}
          />

          {/* Draggable arrow to adjust radius */}
          {!isCircleDragging && (
            <>
              <Arrow
                x={canvasCircleCenter.x}
                y={canvasCircleCenter.y}
                points={[0, 0, 0, 1.2 * radius * canvasUnitLength]}
                pointerLength={5}
                pointerWidth={5}
                stroke={rgbaToString({ ...color, a: 0.5 })}
                strokeWidth={3}
              />
              <Arrow
                x={canvasCircleCenter.x + radius * canvasUnitLength}
                y={canvasCircleCenter.y}
                points={[0, 0, 0, 1.2 * radius * canvasUnitLength]}
                pointerLength={5}
                pointerWidth={5}
                stroke={rgbaToString({ ...color, a: 0.5 })}
                strokeWidth={3}
                draggable
                onMouseOver={() => (document.body.style.cursor = "ew-resize")}
                onMouseOut={() => (document.body.style.cursor = "default")}
                onDragMove={handleRadiusDragMove}
                onDragEnd={handleRadiusDragEnd}
              />
              <Line
                x={canvasCircleCenter.x}
                y={canvasCircleCenter.y + 1.2 * radius * canvasUnitLength}
                points={[0, 0, radius * canvasUnitLength, 0]}
                stroke={rgbaToString({ ...color, a: 0.5 })}
                strokeWidth={2}
                dash={[10, 5]}
              />
              {/* Center of the circle (shows only when not dragging) */}
              <Circle
                x={canvasCircleCenter.x}
                y={canvasCircleCenter.y}
                radius={canvasUnitLength * 0.3}
                fill={rgbaToString(color)}
                stroke="white"
                strokeWidth={1}
              />
            </>
          )}

          {/* Drawn pixels */}
          {circlePixelInfo.map((pixel, index) => (
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

export default CircleRenderer;
