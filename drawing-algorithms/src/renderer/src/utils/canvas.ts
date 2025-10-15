export const canvasLength = 600;
export const canvas40UnitLength = canvasLength / 40;
export const canvas20UnitLength = canvasLength / 20;

export type Point = { x: number; y: number };

// TODO: correct the following conversion functions

// Transform a point from basic 20x20 coordinate system (x-right y-up) to canvas coordinate system
// export function basic20ToCanvasPoint(p: Point): Point {
//   return {
//     x: (p.x + 20) * canvas20UnitLength,
//     y: (20 - p.y) * canvas20UnitLength
//   };
// }
// // Transform a point from canvas coordinate system to basic 20x20 coordinate system (x-right y-up)
// export function canvasToBasic20Point(p: Point): Point {
//   return {
//     x: p.x / canvas20UnitLength - 20,
//     y: 20 - p.y / canvas20UnitLength
//   };
// }

// Transform a point from basic 40x40 coordinate system (x-right y-up) to canvas coordinate system
export function basic40ToCanvasPoint(p: Point): Point {
  return {
    x: (p.x + 40) * canvas40UnitLength,
    y: (40 - p.y) * canvas40UnitLength
  };
}

// Transform a point from canvas coordinate system to basic 40x40 coordinate system (x-right y-up)
export function canvasToBasic40Point(p: Point): Point {
  return {
    x: p.x / canvas40UnitLength - 40,
    y: 40 - p.y / canvas40UnitLength
  };
}
