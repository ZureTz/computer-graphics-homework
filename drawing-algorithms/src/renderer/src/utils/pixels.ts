import { Point, logicalToCanvasPoint, canvasUnitLength, canvasUnitLengthHalf } from "./canvas";
import { RGBAColor } from "./color";

export type PixelInfo = {
  x: number;
  y: number;
  color: RGBAColor;
  width: number;
  height: number;
};

// Get a pixel element from a logical point and color
export function getPixel(p: Point, color: RGBAColor): PixelInfo {
  const actualPoint = logicalToCanvasPoint(p);
  return {
    x: actualPoint.x - canvasUnitLengthHalf,
    y: actualPoint.y - canvasUnitLengthHalf,
    color,
    width: canvasUnitLength,
    height: canvasUnitLength
  };
}
