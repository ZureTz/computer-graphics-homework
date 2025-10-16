export const canvasLength = 600;
export const canvas40UnitLength = canvasLength / 40;
export const canvas20UnitLength = canvasLength / 20;

export type Point = { x: number; y: number };

// Transform a point from basic 20x20 coordinate system (x-right y-up) to canvas coordinate system
export function logicalToCanvas20Point(p: Point): Point {
  return {
    x: (p.x + 10) * canvas20UnitLength,
    y: (10 - p.y) * canvas20UnitLength
  };
}
// Transform a point from canvas coordinate system to basic 20x20 coordinate system (x-right y-up)
export function canvas20ToLogicalPoint(p: Point): Point {
  return {
    x: p.x / canvas20UnitLength - 10,
    y: 10 - p.y / canvas20UnitLength
  };
}

// Transform a point from basic 40x40 coordinate system (x-right y-up) to canvas coordinate system
export function logicalToCanvas40Point(p: Point): Point {
  return {
    x: (p.x + 20) * canvas40UnitLength,
    y: (20 - p.y) * canvas40UnitLength
  };
}

// Transform a point from canvas coordinate system to basic 40x40 coordinate system (x-right y-up)
export function canvas40ToLogicalPoint(p: Point): Point {
  return {
    x: p.x / canvas40UnitLength - 20,
    y: 20 - p.y / canvas40UnitLength
  };
}
