import { forwardRef, useImperativeHandle, useRef } from "react";
import type Konva from "konva";
import { Group, Line, Rect, Circle } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";

import {
  Point,
  logicalToCanvasPoint,
  canvasToLogicalPoint,
  canvasUnitLength
} from "@renderer/utils/canvas";
import { bresenhamLine, ddaLine, wuxiaolinLine } from "@renderer/utils/line";
import { RGBAColor, rgbaToString } from "@renderer/utils/color";
import { PixelInfo } from "@renderer/utils/pixels";

type LineRendererProps = {
  start: Point;
  end: Point;
  color: RGBAColor;
  algorithm?: "bresenham" | "dda" | "wu";
  onStartChange?: (newStart: Point) => void;
  onEndChange?: (newEnd: Point) => void;
  onSelect?: () => void;
  onTransform?: (newStart: Point, newEnd: Point) => void;
  isSelected?: boolean;
};

const LineRenderer = forwardRef<Konva.Group, LineRendererProps>(
  (
    {
      start,
      end,
      color,
      algorithm = "bresenham",
      onStartChange,
      onEndChange,
      onSelect,
      onTransform,
      isSelected = false
    },
    ref
  ) => {
    const groupRef = useRef<Konva.Group>(null);
    const startCircleRef = useRef<Konva.Circle>(null);
    const endCircleRef = useRef<Konva.Circle>(null);

    useImperativeHandle(ref, () => groupRef.current as Konva.Group);

    const { convertedStart, convertedEnd } = {
      convertedStart: logicalToCanvasPoint(start),
      convertedEnd: logicalToCanvasPoint(end)
    };

    // Use the selected algorithm
    let linePixelsInfo: PixelInfo[] = [];
    switch (algorithm) {
      case "bresenham":
        linePixelsInfo = bresenhamLine(start, end, color);
        break;
      case "dda":
        linePixelsInfo = ddaLine(start, end, color);
        break;
      case "wu":
        linePixelsInfo = wuxiaolinLine(start, end, color);
        break;
      default:
        linePixelsInfo = bresenhamLine(start, end, color);
        break;
    }

    const handleStartDrag = (e: KonvaEventObject<DragEvent>): void => {
      if (!onStartChange) return;
      const newPos = e.target.position();
      const logicalPos = canvasToLogicalPoint(newPos);
      onStartChange(logicalPos);
    };

    const handleStartDragEnd = (e: KonvaEventObject<DragEvent>): void => {
      if (!onStartChange) return;
      const newPos = e.target.position();
      const logicalPos = canvasToLogicalPoint(newPos);
      onStartChange(logicalPos);
      // 确保拖拽点准确对齐到网格
      const finalCanvasPos = logicalToCanvasPoint(logicalPos);
      e.target.position(finalCanvasPos);
    };

    const handleEndDrag = (e: KonvaEventObject<DragEvent>): void => {
      if (!onEndChange) return;
      const newPos = e.target.position();
      const logicalPos = canvasToLogicalPoint(newPos);
      onEndChange(logicalPos);
    };

    const handleEndDragEnd = (e: KonvaEventObject<DragEvent>): void => {
      if (!onEndChange) return;
      const newPos = e.target.position();
      const logicalPos = canvasToLogicalPoint(newPos);
      onEndChange(logicalPos);
      // 确保拖拽点准确对齐到网格
      const finalCanvasPos = logicalToCanvasPoint(logicalPos);
      e.target.position(finalCanvasPos);
    };

    const resetGroupTransform = (): void => {
      if (!groupRef.current) return;
      groupRef.current.rotation(0);
      groupRef.current.scale({ x: 1, y: 1 });
      groupRef.current.position({ x: 0, y: 0 });
      groupRef.current.skewX(0);
      groupRef.current.skewY(0);
      groupRef.current.offset({ x: 0, y: 0 });
    };

    const handleGroupTransform = (): void => {
      if (!onTransform) {
        resetGroupTransform();
        return;
      }

      const startAbs = startCircleRef.current?.getAbsolutePosition() ?? convertedStart;
      const endAbs = endCircleRef.current?.getAbsolutePosition() ?? convertedEnd;
      const logicalStart = canvasToLogicalPoint(startAbs);
      const logicalEnd = canvasToLogicalPoint(endAbs);
      onTransform(logicalStart, logicalEnd);
      resetGroupTransform();
    };

    const handleSelect = (e: KonvaEventObject<MouseEvent | TouchEvent>): void => {
      onSelect?.();
      e.cancelBubble = true;
    };

    return (
      <Group
        ref={groupRef}
        name="line-shape"
        onClick={handleSelect}
        onTap={handleSelect}
        onMouseDown={handleSelect}
        onTouchStart={handleSelect}
        onTransformEnd={handleGroupTransform}
        onDragEnd={handleGroupTransform}
        draggable={Boolean(onTransform) && isSelected}
      >
        {/* Actual line drawn by the canvas */}
        <Line
          points={[convertedStart.x, convertedStart.y, convertedEnd.x, convertedEnd.y]}
          stroke={rgbaToString(color)}
          strokeWidth={3}
          lineCap="round"
          lineJoin="round"
        />
        {/* Pixel of the lines */}
        {linePixelsInfo.map((pixel, index) => (
          <Rect
            x={pixel.x}
            y={pixel.y}
            width={pixel.width}
            height={pixel.height}
            fill={rgbaToString({ ...pixel.color, a: 0.6 * (pixel.color.a ?? 1) })}
            key={index}
          />
        ))}
        {/* Draggable start point */}
        {onStartChange && (
          <Circle
            ref={startCircleRef}
            x={convertedStart.x}
            y={convertedStart.y}
            radius={canvasUnitLength * 0.6}
            fill={rgbaToString(color)}
            stroke="white"
            strokeWidth={2}
            draggable
            onMouseEnter={() => (document.body.style.cursor = "move")}
            onMouseLeave={() => (document.body.style.cursor = "default")}
            onDragMove={handleStartDrag}
            onDragEnd={handleStartDragEnd}
          />
        )}
        {/* Draggable end point */}
        {onEndChange && (
          <Circle
            ref={endCircleRef}
            x={convertedEnd.x}
            y={convertedEnd.y}
            radius={canvasUnitLength * 0.6}
            fill={rgbaToString(color)}
            stroke="white"
            strokeWidth={2}
            draggable
            onMouseEnter={() => (document.body.style.cursor = "move")}
            onMouseLeave={() => (document.body.style.cursor = "default")}
            onDragMove={handleEndDrag}
            onDragEnd={handleEndDragEnd}
          />
        )}
      </Group>
    );
  }
);

LineRenderer.displayName = "LineRenderer";

export default LineRenderer;
