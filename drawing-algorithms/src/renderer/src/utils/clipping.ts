import { Point, Rectangle } from "./canvas";

// Liang-Barsky 裁剪算法实现
export function liangBarskyClipping(
  clippingRect: Rectangle,
  start: Point,
  end: Point
): Point[] | null {
  const { x: xmin, y: ymin, width, height } = clippingRect;
  const xmax = xmin + width;
  const ymax = ymin + height;

  const { x: x1, y: y1 } = start;
  const { x: x2, y: y2 } = end;

  // 定义 p 和 q 参数
  const p1 = -(x2 - x1);
  const p2 = -p1;
  const p3 = -(y2 - y1);
  const p4 = -p3;

  const q1 = x1 - xmin;
  const q2 = xmax - x1;
  const q3 = y1 - ymin;
  const q4 = ymax - y1;

  const exitParams: number[] = [1];
  const entryParams: number[] = [0];

  // 检查线段是否平行于裁剪窗口边界且在外部
  if (
    (p1 === 0 && q1 < 0) ||
    (p2 === 0 && q2 < 0) ||
    (p3 === 0 && q3 < 0) ||
    (p4 === 0 && q4 < 0)
  ) {
    // 线段平行于裁剪窗口且在外部
    return null;
  }

  // 处理 x 方向
  if (p1 !== 0) {
    const r1 = q1 / p1;
    const r2 = q2 / p2;
    if (p1 < 0) {
      entryParams.push(r1);
      exitParams.push(r2);
    } else {
      entryParams.push(r2);
      exitParams.push(r1);
    }
  }

  // 处理 y 方向
  if (p3 !== 0) {
    const r3 = q3 / p3;
    const r4 = q4 / p4;
    if (p3 < 0) {
      entryParams.push(r3);
      exitParams.push(r4);
    } else {
      entryParams.push(r4);
      exitParams.push(r3);
    }
  }

  // 计算 u1 (最大的入点参数) 和 u2 (最小的出点参数)
  const u1 = Math.max(...entryParams);
  const u2 = Math.min(...exitParams);

  // 如果 u1 > u2，线段完全在裁剪窗口外
  if (u1 > u2) {
    return null;
  }

  // 计算裁剪后的端点
  const clippedX1 = x1 + (x2 - x1) * u1;
  const clippedY1 = y1 + (y2 - y1) * u1;
  const clippedX2 = x1 + (x2 - x1) * u2;
  const clippedY2 = y1 + (y2 - y1) * u2;

  return [
    { x: clippedX1, y: clippedY1 },
    { x: clippedX2, y: clippedY2 }
  ];
}

// Sutherland-Hodgman 多边形裁剪算法
export function sutherlandHodgmanClipping(subjectPolygon: Point[], clipPolygon: Point[]): Point[] {
  if (subjectPolygon.length === 0 || clipPolygon.length === 0) {
    return [];
  }

  let outputList = [...subjectPolygon];

  // 对裁剪多边形的每条边进行裁剪
  for (let i = 0; i < clipPolygon.length; i++) {
    const clipEdgeStart = clipPolygon[i];
    const clipEdgeEnd = clipPolygon[(i + 1) % clipPolygon.length];

    const inputList = outputList;
    outputList = [];

    if (inputList.length === 0) {
      break;
    }

    // 遍历输入多边形的每个顶点
    for (let j = 0; j < inputList.length; j++) {
      const currentPoint = inputList[j];
      const prevPoint = inputList[(j - 1 + inputList.length) % inputList.length];

      // 判断点是否在边的内侧（左侧）
      const currentInside = isPointInsideEdge(currentPoint, clipEdgeStart, clipEdgeEnd);
      const prevInside = isPointInsideEdge(prevPoint, clipEdgeStart, clipEdgeEnd);

      if (currentInside) {
        if (!prevInside) {
          // 从外部进入内部，添加交点
          const intersection = computeIntersection(
            prevPoint,
            currentPoint,
            clipEdgeStart,
            clipEdgeEnd
          );
          if (intersection) {
            outputList.push(intersection);
          }
        }
        // 当前点在内部，添加当前点
        outputList.push(currentPoint);
      } else if (prevInside) {
        // 从内部进入外部，添加交点
        const intersection = computeIntersection(
          prevPoint,
          currentPoint,
          clipEdgeStart,
          clipEdgeEnd
        );
        if (intersection) {
          outputList.push(intersection);
        }
      }
    }
  }

  return outputList;
}

// 判断点是否在边的内侧（左侧）
// 使用叉积判断：如果点在边的左侧，则认为在内侧
function isPointInsideEdge(point: Point, edgeStart: Point, edgeEnd: Point): boolean {
  // 计算叉积：(edgeEnd - edgeStart) × (point - edgeStart)
  const edge = { x: edgeEnd.x - edgeStart.x, y: edgeEnd.y - edgeStart.y };
  const toPoint = { x: point.x - edgeStart.x, y: point.y - edgeStart.y };
  const crossProduct = edge.x * toPoint.y - edge.y * toPoint.x;

  // 叉积 >= 0 表示点在边的左侧或边上（内侧）
  return crossProduct >= 0;
}

// 计算线段与边的交点
function computeIntersection(
  lineStart: Point,
  lineEnd: Point,
  edgeStart: Point,
  edgeEnd: Point
): Point | null {
  const x1 = lineStart.x;
  const y1 = lineStart.y;
  const x2 = lineEnd.x;
  const y2 = lineEnd.y;
  const x3 = edgeStart.x;
  const y3 = edgeStart.y;
  const x4 = edgeEnd.x;
  const y4 = edgeEnd.y;

  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  // 平行或共线
  if (Math.abs(denominator) < 1e-10) {
    return null;
  }

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;

  // 计算交点
  const intersectionX = x1 + t * (x2 - x1);
  const intersectionY = y1 + t * (y2 - y1);

  return { x: intersectionX, y: intersectionY };
}
