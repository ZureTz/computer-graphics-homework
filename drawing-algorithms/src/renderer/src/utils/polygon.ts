import { Point } from "./canvas";
import { PixelInfo, getPixel } from "./pixels";
import { RGBAColor } from "./color";

/**
 * 边表中的边结构
 */
type Edge = {
  yMax: number; // 边的上端点y坐标
  x: number; // 边与当前扫描线交点的x坐标
  dx: number; // 斜率的倒数 (∆x/∆y)
};

/**
 * 扫描线填充算法
 *
 * 算法步骤：
 * 1. 建立边表ET（Edge Table），存储每条扫描线上的边信息
 * 2. 建立活动边表AET（Active Edge Table），存储与当前扫描线相交的边
 * 3. 从下往上扫描：
 *    - 将ET中当前扫描线的边加入AET
 *    - AET中的边两两配对填充像素
 *    - 删除AET中已到达上端点的边
 *    - 更新AET中边的x坐标
 *
 * @param vertices 多边形的顶点数组（逻辑坐标系）
 * @param color 填充颜色
 * @returns 需要绘制的像素信息数组
 */
export function scanlinePolygon(vertices: Point[], color: RGBAColor): PixelInfo[] {
  const pixels: PixelInfo[] = [];

  // 顶点数少于3个，无法构成多边形
  if (vertices.length < 3) {
    return pixels;
  }

  // 1. 计算多边形的最高点和最低点的y坐标
  let minY = vertices[0].y;
  let maxY = vertices[0].y;
  for (const vertex of vertices) {
    if (vertex.y < minY) minY = vertex.y;
    if (vertex.y > maxY) maxY = vertex.y;
  }

  // 2. 初始化边表ET和活动边表AET
  // ET是一个Map，key为y坐标，value为该y坐标处的边数组
  const ET: Map<number, Edge[]> = new Map();
  for (let y = minY; y <= maxY; y++) {
    ET.set(y, []);
  }
  // AET存储当前扫描线与多边形边的交点
  const AET: Edge[] = [];

  // 3. 建立边表ET
  const n = vertices.length;
  for (let i = 0; i < n; i++) {
    // 获取当前边的两个端点（点1和点2）及其相邻点（点0和点3）
    // 点0-点1-点2-点3 是连续的4个顶点
    const p0 = vertices[(i - 1 + n) % n]; // 点1的前一个点
    const p1 = vertices[i]; // 当前边的第一个端点
    const p2 = vertices[(i + 1) % n]; // 当前边的第二个端点
    const p3 = vertices[(i + 2) % n]; // 点2的后一个点

    // 忽略水平边（y坐标相同的边不参与填充）
    if (p1.y === p2.y) {
      continue;
    }

    // 计算边的参数
    const ymin = Math.min(p1.y, p2.y); // 下端点y坐标
    const ymax = Math.max(p1.y, p2.y); // 上端点y坐标
    let x = p1.y > p2.y ? p2.x : p1.x; // 下端点x坐标
    const dx = (p1.x - p2.x) / (p1.y - p2.y); // 斜率的倒数

    // 处理奇点（顶点）问题
    // 奇点：扫描线经过多边形顶点时，该顶点会被计算两次，导致填充错误
    // 解决方法：如果顶点是局部极值点（y坐标单调递减的转折点），则将其y坐标+1
    let adjustedYMin = ymin;

    // 情况1：p0->p1->p2 中，p1是局部最低点（y坐标单调递减）
    if (p1.y < p2.y && p1.y > p0.y) {
      adjustedYMin = ymin + 1;
      x += dx;
    }
    // 情况2：p1->p2->p3 中，p2是局部最低点（y坐标单调递减）
    else if (p2.y < p1.y && p2.y > p3.y) {
      adjustedYMin = ymin + 1;
      x += dx;
    }

    // 创建新边并插入边表ET
    const edge: Edge = {
      yMax: ymax,
      x: x,
      dx: dx
    };

    const edgeList = ET.get(adjustedYMin);
    if (edgeList) {
      edgeList.push(edge);
    }
  }

  // 4. 扫描线从下往上扫描
  for (let y = minY; y <= maxY; y++) {
    // 4.1 将ET中当前扫描线的所有边加入AET
    const newEdges = ET.get(y);
    if (newEdges && newEdges.length > 0) {
      AET.push(...newEdges);

      // 对AET按x坐标排序（若x相等则按dx排序）
      AET.sort((a, b) => {
        if (Math.abs(a.x - b.x) < 1e-6) {
          return a.dx - b.dx;
        }
        return a.x - b.x;
      });
    }

    // 4.2 AET中的边两两配对并填充像素
    for (let i = 0; i < AET.length - 1; i += 2) {
      const x1 = Math.round(AET[i].x);
      const x2 = Math.round(AET[i + 1].x);

      // 填充从x1到x2之间的所有像素
      for (let x = x1; x <= x2; x++) {
        pixels.push(getPixel({ x, y }, color));
      }
    }

    // 4.3 删除AET中满足 y == yMax 的边（已到达上端点的边）
    for (let i = AET.length - 1; i >= 0; i--) {
      if (AET[i].yMax === y) {
        AET.splice(i, 1);
      }
    }

    // 4.4 更新AET中所有边的x坐标：x = x + dx
    for (const edge of AET) {
      edge.x += edge.dx;
    }
  }

  return pixels;
}
