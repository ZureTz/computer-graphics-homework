import { forwardRef, useImperativeHandle, useRef } from "react";
import type Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Circle, Group, Rect } from "react-konva";

import {
  canvasToLogicalPoint,
  canvasUnitLength,
  logicalToCanvasPoint,
  Point
} from "@renderer/utils/canvas";
import { RGBAColor, rgbaToString } from "@renderer/utils/color";
import { midpointCircle } from "@renderer/utils/circle";

type CircleRendererProps = {
  center: Point;
  radius: number;
  color: RGBAColor;
  onCenterChange?: (newCenter: Point) => void;
  onSelect?: () => void;
  onTransform?: (newCenter: Point, newRadius: number) => void;
  isSelected?: boolean;
};

const CircleRenderer = forwardRef<Konva.Group, CircleRendererProps>(
  ({ center, radius, color, onCenterChange, onSelect, onTransform, isSelected = false }, ref) => {
    const canvasCircleCenter = logicalToCanvasPoint(center);
    const circlePixelInfo = midpointCircle(center, radius, color);
    const groupRef = useRef<Konva.Group>(null);
    const circleRef = useRef<Konva.Circle>(null);

    useImperativeHandle(ref, () => groupRef.current as Konva.Group);

    const resetGroupTransform = (): void => {
      if (!groupRef.current) return;
      groupRef.current.rotation(0);
      groupRef.current.scale({ x: 1, y: 1 });
      groupRef.current.position({ x: 0, y: 0 });
      groupRef.current.skewX(0);
      groupRef.current.skewY(0);
      groupRef.current.offset({ x: 0, y: 0 });
    };

    const handleCircleDragMove = (e: KonvaEventObject<DragEvent>): void => {
      if (!onCenterChange) return;
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
    };

    const handleGroupTransform = (): void => {
      if (!onTransform || !circleRef.current) {
        resetGroupTransform();
        return;
      }

      const circleAbsPos = circleRef.current.getAbsolutePosition();
      const logicalCenter = canvasToLogicalPoint(circleAbsPos);
      const scaleX = groupRef.current?.scaleX() ?? 1;
      const scaleY = groupRef.current?.scaleY() ?? 1;
      const uniformScale = Math.max(Math.abs(scaleX), Math.abs(scaleY)) || 1;
      const nextRadius = Math.max(1, Math.round(radius * uniformScale));
      onTransform(logicalCenter, nextRadius);
      resetGroupTransform();
    };

    const handleSelect = (e: KonvaEventObject<MouseEvent | TouchEvent>): void => {
      onSelect?.();
      e.cancelBubble = true;
    };

    return (
      <Group
        ref={groupRef}
        name="circle-shape"
        onClick={handleSelect}
        onTap={handleSelect}
        onMouseDown={handleSelect}
        onTouchStart={handleSelect}
        onTransformEnd={handleGroupTransform}
        onDragEnd={handleGroupTransform}
        draggable={Boolean(onTransform) && isSelected}
      >
        <Circle
          ref={circleRef}
          x={canvasCircleCenter.x}
          y={canvasCircleCenter.y}
          radius={radius * canvasUnitLength}
          fill={rgbaToString({ ...color, a: 0.3 })}
          stroke={rgbaToString(color)}
          strokeWidth={3}
          draggable={Boolean(onCenterChange)}
          onMouseEnter={() => (document.body.style.cursor = onCenterChange ? "move" : "default")}
          onMouseLeave={() => (document.body.style.cursor = "default")}
          onDragMove={handleCircleDragMove}
          onDragEnd={handleCircleDragEnd}
        />

        {/* Center marker remains visible for reference */}
        <Circle
          x={canvasCircleCenter.x}
          y={canvasCircleCenter.y}
          radius={canvasUnitLength * 0.3}
          fill={rgbaToString(color)}
          stroke="white"
          strokeWidth={1}
        />

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
      </Group>
    );
  }
);

CircleRenderer.displayName = "CircleRenderer";

export default CircleRenderer;
