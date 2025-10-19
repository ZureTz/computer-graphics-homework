import { Point } from "./canvas";

// 2D Vector type
export type Vec2 = {
  x: number;
  y: number;
};

// Create a new vector from two points (end - start)
export function newVec2FromPoints(start: Point, end: Point): Vec2 {
  return { x: end.x - start.x, y: end.y - start.y };
}

// Add two vectors
export function addVec2(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

// Subtract vector b from vector a
export function subtractVec2(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

// Scale vector by a scalar
export function scaleVec2(v: Vec2, scalar: number): Vec2 {
  return { x: v.x * scalar, y: v.y * scalar };
}

// Dot product of two vectors
export function dotVec2(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}

// Get squared length of vector (avoids sqrt for efficiency)
export function lengthSquaredVec2(v: Vec2): number {
  return v.x * v.x + v.y * v.y;
}

// Get length (magnitude) of vector
export function lengthVec2(v: Vec2): number {
  return Math.sqrt(lengthSquaredVec2(v));
}

// Get normalized vector (unit length)
export function normalizeVec2(v: Vec2): Vec2 {
  const len = lengthVec2(v);
  if (len <= 1e-6) {
    return { x: 0, y: 0 };
  }
  return { x: v.x / len, y: v.y / len };
}

// Counterclockwise rotation for positive angleRad
export function rotateVec2(v: Vec2, angleRad: number): Vec2 {
  const { sinAngle, cosAngle } = {
    sinAngle: Math.sin(angleRad),
    cosAngle: Math.cos(angleRad)
  };

  return {
    x: v.x * cosAngle - v.y * sinAngle,
    y: v.x * sinAngle + v.y * cosAngle
  };
}

// Reflect vector v around x axis
export function reflectVec2AroundX(v: Vec2): Vec2 {
  return { x: v.x, y: -v.y };
}

// Reflect vector v around y axis
export function reflectVec2AroundY(v: Vec2): Vec2 {
  return { x: -v.x, y: v.y };
}

// Negate vector
export function negateVec2(v: Vec2): Vec2 {
  return { x: -v.x, y: -v.y };
}
