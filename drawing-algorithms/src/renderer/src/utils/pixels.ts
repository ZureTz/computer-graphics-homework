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

// Remove duplicate pixels based on their (x, y) coordinates
export function removeDuplicatePixels(pixels: PixelInfo[]): PixelInfo[] {
  const uniquePixelsMap: Record<string, PixelInfo> = {};
  for (const pixel of pixels) {
    const key = `${pixel.x},${pixel.y}`;
    uniquePixelsMap[key] = pixel;
  }
  return Object.values(uniquePixelsMap);
}
