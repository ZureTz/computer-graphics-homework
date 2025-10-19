import { Group, Line, Rect, Circle } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";

import {
  Point,
  logicalToCanvasPoint,
  canvasToLogicalPoint,
  canvasUnitLength
} from "@renderer/utils/canvas";
import { bresenhamLine, ddaLine, wuxiaolinLine } from "@renderer/utils/lines";
import { RGBAColor, rgbaToString } from "@renderer/utils/color";
import { PixelInfo } from "@renderer/utils/pixels";

const LineRenderer = ({
  start,
  end,
  color,
  algorithm = "bresenham",
  onStartChange,
  onEndChange
}: {
  start: Point;
  end: Point;
  color: RGBAColor;
  algorithm?: "bresenham" | "dda" | "wu";
  onStartChange?: (newStart: Point) => void;
  onEndChange?: (newEnd: Point) => void;
}): React.JSX.Element => {
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

  return (
    <Group>
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
};

export default LineRenderer;
