import { Point } from "./canvas";
import { RGBAColor } from "./color";
import { PixelInfo, getPixel } from "./pixels";

// Bresenham's line algorithm (-1 <= slope <= 1)
function bresenhamLineLow(start: Point, end: Point, color: RGBAColor): PixelInfo[] {
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
function bresenhamLineHigh(start: Point, end: Point, color: RGBAColor): PixelInfo[] {
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
export function bresenhamLine(start: Point, end: Point, color: RGBAColor): PixelInfo[] {
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

// Draw a line using DDA line algorithm from (x0, y0) to (x1, y1)
export function ddaLine(start: Point, end: Point, color: RGBAColor): PixelInfo[] {
  const { dx, dy } = { dx: end.x - start.x, dy: end.y - start.y };

  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  const { xIncrement, yIncrement } = { xIncrement: dx / steps, yIncrement: dy / steps };

  const pixels: PixelInfo[] = [];
  let currentX = start.x;
  let currentY = start.y;
  for (let i = 0; i <= steps; i++) {
    pixels.push(getPixel({ x: Math.round(currentX), y: Math.round(currentY) }, color));
    currentX += xIncrement;
    currentY += yIncrement;
  }
  return pixels;
}

// Wu Xiaolin line algorithm from (x0, y0) to (x1, y1)
export function wuxiaolinLine(start: Point, end: Point, color: RGBAColor): PixelInfo[] {
  // Helper function: fractional part of x
  const fractionalPart = (x: number): number => {
    return x - Math.floor(x);
  };

  // Helper function: reverse fractional part
  const remainingFractionalPart = (x: number): number => {
    return 1 - fractionalPart(x);
  };

  // Helper function: plot pixel with brightness (alpha)
  const pixels: PixelInfo[] = [];
  const plot = (x: number, y: number, brightness: number): void => {
    pixels.push(getPixel({ x, y }, { ...color, a: brightness * (color.a ?? 1) }));
  };

  // Make copies to avoid mutating original points
  let x0 = start.x;
  let y0 = start.y;
  let x1 = end.x;
  let y1 = end.y;

  // Check if line is steep (more vertical than horizontal)
  const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);

  // If steep, swap x and y coordinates
  if (steep) {
    [x0, y0] = [y0, x0];
    [x1, y1] = [y1, x1];
  }

  // Make sure line goes left to right
  if (x0 > x1) {
    [x0, x1] = [x1, x0];
    [y0, y1] = [y1, y0];
  }

  const dx = x1 - x0;
  const dy = y1 - y0;
  const gradient = dx === 0 ? 1.0 : dy / dx;

  // Handle first endpoint
  let xEnd = Math.round(x0);
  let yEnd = y0 + gradient * (xEnd - x0);
  let xGap = remainingFractionalPart(x0 + 0.5);
  const xPixel1 = xEnd; // will be used in main loop
  const yPixel1 = Math.floor(yEnd);

  if (steep) {
    plot(yPixel1, xPixel1, remainingFractionalPart(yEnd) * xGap);
    plot(yPixel1 + 1, xPixel1, fractionalPart(yEnd) * xGap);
  } else {
    plot(xPixel1, yPixel1, remainingFractionalPart(yEnd) * xGap);
    plot(xPixel1, yPixel1 + 1, fractionalPart(yEnd) * xGap);
  }

  // First y-intersection for the main loop
  let intersectionY = yEnd + gradient;

  // Handle second endpoint
  xEnd = Math.round(x1);
  yEnd = y1 + gradient * (xEnd - x1);
  xGap = fractionalPart(x1 + 0.5);
  const xPixel2 = xEnd; // will be used in main loop
  const yPixel2 = Math.floor(yEnd);

  if (steep) {
    plot(yPixel2, xPixel2, remainingFractionalPart(yEnd) * xGap);
    plot(yPixel2 + 1, xPixel2, fractionalPart(yEnd) * xGap);
  } else {
    plot(xPixel2, yPixel2, remainingFractionalPart(yEnd) * xGap);
    plot(xPixel2, yPixel2 + 1, fractionalPart(yEnd) * xGap);
  }

  // Main loop
  if (steep) {
    for (let x = xPixel1 + 1; x < xPixel2; x++) {
      plot(Math.floor(intersectionY), x, remainingFractionalPart(intersectionY));
      plot(Math.floor(intersectionY) + 1, x, fractionalPart(intersectionY));
      intersectionY = intersectionY + gradient;
    }
  } else {
    for (let x = xPixel1 + 1; x < xPixel2; x++) {
      plot(x, Math.floor(intersectionY), remainingFractionalPart(intersectionY));
      plot(x, Math.floor(intersectionY) + 1, fractionalPart(intersectionY));
      intersectionY = intersectionY + gradient;
    }
  }

  return pixels;
}
