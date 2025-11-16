import { forwardRef, useImperativeHandle, useRef } from "react";
import type Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Circle, Ellipse, Group, Rect } from "react-konva";

import {
  canvasToLogicalPoint,
  canvasUnitLength,
  logicalToCanvasPoint,
  Point
} from "@renderer/utils/canvas";
import { RGBAColor, rgbaToString } from "@renderer/utils/color";
import { midpointEllipse } from "@renderer/utils/ellipse";

type EllipseRendererProps = {
  center: Point;
  radiusX: number;
  radiusY: number;
  rotationRad?: number;
  color: RGBAColor;
  onCenterChange?: (newCenter: Point) => void;
  onSelect?: () => void;
  onTransform?: (
    newCenter: Point,
    newRadiusX: number,
    newRadiusY: number,
    newRotationRad: number
  ) => void;
  isSelected?: boolean;
};

const EllipseRenderer = forwardRef<Konva.Group, EllipseRendererProps>(
  (
    {
      center,
      radiusX,
      radiusY,
      rotationRad = 0,
      color,
      onCenterChange,
      onSelect,
      onTransform,
      isSelected = false
    },
    ref
  ) => {
    const canvasEllipseCenter = logicalToCanvasPoint(center);
    const rotationDeg = (rotationRad * 180) / Math.PI;
    const ellipsePixelInfo = midpointEllipse(center, radiusX, radiusY, color, rotationRad);
    const groupRef = useRef<Konva.Group>(null);

    useImperativeHandle(ref, () => groupRef.current as Konva.Group);

    const handleGroupDragMove = (e: KonvaEventObject<DragEvent>): void => {
      if (!onCenterChange) return;
      const logicalPos = canvasToLogicalPoint(e.target.position());
      onCenterChange(logicalPos);
    };

    const handleGroupTransform = (): void => {
      if (!onTransform || !groupRef.current) {
        return;
      }

      const groupAbsPos = groupRef.current.getAbsolutePosition();
      const logicalCenter = canvasToLogicalPoint(groupAbsPos);
      const groupScaleX = Math.abs(groupRef.current.scaleX() ?? 1);
      const groupScaleY = Math.abs(groupRef.current.scaleY() ?? 1);
      const currentRotationDeg = groupRef.current.rotation() ?? 0;
      const deltaRotationDeg = currentRotationDeg - rotationDeg;
      const nextRadiusX = Math.max(1, Math.round(radiusX * groupScaleX));
      const nextRadiusY = Math.max(1, Math.round(radiusY * groupScaleY));
      const nextRotation = rotationRad + (deltaRotationDeg * Math.PI) / 180;

      onTransform(logicalCenter, nextRadiusX, nextRadiusY, nextRotation);

      const finalCanvasCenter = logicalToCanvasPoint(logicalCenter);
      groupRef.current.position(finalCanvasCenter);
      groupRef.current.rotation((nextRotation * 180) / Math.PI);
      groupRef.current.scale({ x: 1, y: 1 });
      groupRef.current.skewX(0);
      groupRef.current.skewY(0);
    };

    const handleSelect = (e: KonvaEventObject<MouseEvent | TouchEvent>): void => {
      onSelect?.();
      e.cancelBubble = true;
    };

    return (
      <>
        <Group
          ref={groupRef}
          name="ellipse-shape"
          x={canvasEllipseCenter.x}
          y={canvasEllipseCenter.y}
          rotation={rotationDeg}
          onClick={handleSelect}
          onTap={handleSelect}
          onMouseDown={handleSelect}
          onTouchStart={handleSelect}
          onTransformEnd={handleGroupTransform}
          onDragEnd={handleGroupTransform}
          onDragMove={handleGroupDragMove}
          draggable={Boolean(onCenterChange) || (Boolean(onTransform) && isSelected)}
        >
          <Ellipse
            x={0}
            y={0}
            radiusX={radiusX * canvasUnitLength}
            radiusY={radiusY * canvasUnitLength}
            fill={rgbaToString({ ...color, a: 0.3 })}
            stroke={rgbaToString(color)}
            strokeWidth={3}
            listening={Boolean(onCenterChange)}
            onMouseEnter={() => (document.body.style.cursor = onCenterChange ? "move" : "default")}
            onMouseLeave={() => (document.body.style.cursor = "default")}
          />

          <Circle
            x={0}
            y={0}
            radius={canvasUnitLength * 0.3}
            fill={rgbaToString(color)}
            stroke="white"
            strokeWidth={1}
          />
        </Group>

        {ellipsePixelInfo.map((pixel, index) => (
          <Rect
            key={index}
            x={pixel.x}
            y={pixel.y}
            width={pixel.width}
            height={pixel.height}
            fill={rgbaToString({ ...color, a: 0.8 * (pixel.color.a ?? 1) })}
            listening={false}
          />
        ))}
      </>
    );
  }
);

EllipseRenderer.displayName = "EllipseRenderer";

export default EllipseRenderer;
