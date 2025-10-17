import { Point } from "./canvas";
import { ColorRGB } from "./color";
import { PixelInfo, getPixel } from "./pixels";

// Bresenham's line algorithm (-1 <= slope <= 1)
function bresenhamLineLow(start: Point, end: Point, color: ColorRGB): PixelInfo[] {
  const { dx, dy } = { dx: end.x - start.x, dy: Math.abs(end.y - start.y) };
  const yIncrement = start.y < end.y ? 1 : -1;

  let D = 2 * dy - dx;
  let currentY = start.y;

  const pixels: PixelInfo[] = [];
  for (let currentX = start.x; currentX <= end.x; currentX++) {
    pixels.push(getPixel({ x: currentX, y: currentY }, color));
    if (D > 0) {
      currentY += yIncrement;
      D += 2 * (dy - dx);
      continue;
    }
    D += 2 * dy;
  }
  return pixels;
}

// Bresenham's line algorithm (slope < -1 or slope > 1)
function bresenhamLineHigh(start: Point, end: Point, color: ColorRGB): PixelInfo[] {
  const { dx, dy } = { dx: Math.abs(end.x - start.x), dy: end.y - start.y };
  const xIncrement = start.x < end.x ? 1 : -1;

  let D = 2 * dx - dy;
  let currentX = start.x;

  const pixels: PixelInfo[] = [];
  for (let currentY = start.y; currentY <= end.y; currentY++) {
    pixels.push(getPixel({ x: currentX, y: currentY }, color));
    if (D > 0) {
      currentX += xIncrement;
      D += 2 * (dx - dy);
      continue;
    }
    D += 2 * dx;
  }
  return pixels;
}

// Draw a line using Bresenham's line algorithm from (x0, y0) to (x1, y1)
export function bresenhamLine(start: Point, end: Point, color: ColorRGB): PixelInfo[] {
  if (Math.abs(end.y - start.y) < Math.abs(end.x - start.x)) {
    if (start.x > end.x) {
      return bresenhamLineLow(end, start, color);
    }
    return bresenhamLineLow(start, end, color);
  }

  // Otherwise, the slope is < -1 or > 1
  if (start.y > end.y) {
    return bresenhamLineHigh(end, start, color);
  }
  return bresenhamLineHigh(start, end, color);
}
