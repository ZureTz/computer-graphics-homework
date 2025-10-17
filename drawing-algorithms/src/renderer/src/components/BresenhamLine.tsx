import { Group, Line, Rect, Circle } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";

import {
  Point,
  logicalToCanvasPoint,
  canvasToLogicalPoint,
  canvasUnitLength
} from "@renderer/utils/canvas";
import { bresenhamLine } from "@renderer/utils/lines";
import { ColorRGB, rgbToString, rgbToTransparentColor } from "@renderer/utils/color";

const BresenhamLine = ({
  start,
  end,
  color,
  onStartChange,
  onEndChange
}: {
  start: Point;
  end: Point;
  color: ColorRGB;
  onStartChange?: (newStart: Point) => void;
  onEndChange?: (newEnd: Point) => void;
}): React.JSX.Element => {
  const { convertedStart, convertedEnd } = {
    convertedStart: logicalToCanvasPoint(start),
    convertedEnd: logicalToCanvasPoint(end)
  };
  const bresenhamLinePixelsInfo = bresenhamLine(start, end, color);

  const handleStartDrag = (e: KonvaEventObject<DragEvent>): void => {
    if (!onStartChange) return;
    const newPos = e.target.position();
    const logicalPos = canvasToLogicalPoint(newPos);
    onStartChange({
      x: Math.round(logicalPos.x),
      y: Math.round(logicalPos.y)
    });
  };

  const handleStartDragEnd = (e: KonvaEventObject<DragEvent>): void => {
    if (!onStartChange) return;
    const newPos = e.target.position();
    const logicalPos = canvasToLogicalPoint(newPos);
    const roundedPos = {
      x: Math.round(logicalPos.x),
      y: Math.round(logicalPos.y)
    };
    onStartChange(roundedPos);
    // 确保拖拽点准确对齐到网格
    const finalCanvasPos = logicalToCanvasPoint(roundedPos);
    e.target.position(finalCanvasPos);
  };

  const handleEndDrag = (e: KonvaEventObject<DragEvent>): void => {
    if (!onEndChange) return;
    const newPos = e.target.position();
    const logicalPos = canvasToLogicalPoint(newPos);
    onEndChange({
      x: Math.round(logicalPos.x),
      y: Math.round(logicalPos.y)
    });
  };

  const handleEndDragEnd = (e: KonvaEventObject<DragEvent>): void => {
    if (!onEndChange) return;
    const newPos = e.target.position();
    const logicalPos = canvasToLogicalPoint(newPos);
    const roundedPos = {
      x: Math.round(logicalPos.x),
      y: Math.round(logicalPos.y)
    };
    onEndChange(roundedPos);
    // 确保拖拽点准确对齐到网格
    const finalCanvasPos = logicalToCanvasPoint(roundedPos);
    e.target.position(finalCanvasPos);
  };

  return (
    <Group>
      {/* Actual line drawn by the canvas */}
      <Line
        points={[convertedStart.x, convertedStart.y, convertedEnd.x, convertedEnd.y]}
        stroke={rgbToString(color)}
        strokeWidth={3}
        lineCap="round"
        lineJoin="round"
      />
      {/* Pixel of the lines */}
      {bresenhamLinePixelsInfo.map((pixel, index) => (
        <Rect
          x={pixel.x}
          y={pixel.y}
          width={pixel.width}
          height={pixel.height}
          fill={rgbToTransparentColor(pixel.color, 0.5)}
          key={index}
        />
      ))}
      {/* Draggable start point */}
      {onStartChange && (
        <Circle
          x={convertedStart.x}
          y={convertedStart.y}
          radius={canvasUnitLength * 0.6}
          fill={rgbToString(color)}
          stroke="white"
          strokeWidth={2}
          draggable
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
          fill={rgbToString(color)}
          stroke="white"
          strokeWidth={2}
          draggable
          onDragMove={handleEndDrag}
          onDragEnd={handleEndDragEnd}
        />
      )}
    </Group>
  );
};

export default BresenhamLine;
