import { Point, logicalToCanvasPoint, canvasUnitLength, canvasUnitLengthHalf } from "./canvas";

export type PixelInfo = {
  x: number;
  y: number;
  color: string;
  width: number;
  height: number;
};

// Get a pixel element from a logical point and color
export function getPixel(p: Point, color: string): PixelInfo {
  const actualPoint = logicalToCanvasPoint(p);
  return {
    x: actualPoint.x - canvasUnitLengthHalf,
    y: actualPoint.y - canvasUnitLengthHalf,
    color,
    width: canvasUnitLength,
    height: canvasUnitLength
  };
}
