export const canvasLength = 600;
export const canvasGridSize = 40;

export const canvasUnitLength = canvasLength / canvasGridSize;
export const canvasUnitLengthHalf = canvasUnitLength / 2;

export type Point = { x: number; y: number };

// Transform a point from basic 40x40 coordinate system (x-right y-up) to canvas coordinate system
export function logicalToCanvasPoint(p: Point): Point {
  return {
    x: (p.x + canvasGridSize / 2) * canvasUnitLength,
    y: (canvasGridSize / 2 - p.y) * canvasUnitLength
  };
}

// Transform a point from canvas coordinate system to basic 40x40 coordinate system (x-right y-up)
export function canvasToLogicalPoint(p: Point): Point {
  return {
    x: Math.round(p.x / canvasUnitLength - canvasGridSize / 2),
    y: Math.round(canvasGridSize / 2 - p.y / canvasUnitLength)
  };
}
