import { Point } from "./canvas";
import { RGBAColor } from "./color";
import { getPixel, PixelInfo, removeDuplicatePixels } from "./pixels";
import {
  negateVec2,
  newVec2FromPoints,
  reflectVec2AroundX,
  reflectVec2AroundY,
  Vec2
} from "./vec2";

/**
 * 获取椭圆上一个点的4个对称点
 * 利用椭圆的四对称性，从一个点生成其他3个对称点
 * 对称性包括：关于X轴、Y轴、原点对称
 * @param center 椭圆中心坐标
 * @param offset 从中心到基准点的偏移向量
 * @returns 包含4个对称点的数组
 */
function getSymmetricEllipsePoints(center: Point, offset: Vec2): Point[] {
  // 计算基准点坐标
  const basePoint = { x: center.x + offset.x, y: center.y + offset.y };

  // 从中心到基准点的向量
  const baseVector = newVec2FromPoints(center, basePoint);
  // 关于X轴对称（上下翻转）
  const xReflected = reflectVec2AroundX(baseVector);
  // 关于Y轴对称（左右翻转）
  const yReflected = reflectVec2AroundY(baseVector);
  // 关于原点对称（180度旋转）
  const negated = negateVec2(baseVector);

  return [
    // 原始点及其三个镜像（关于X轴、Y轴、原点）
    basePoint,
    { x: center.x + xReflected.x, y: center.y + xReflected.y },
    { x: center.x + yReflected.x, y: center.y + yReflected.y },
    { x: center.x + negated.x, y: center.y + negated.y }
  ];
}

/**
 * 使用中点画椭圆算法（Midpoint Ellipse Algorithm）绘制椭圆
 * 该算法将椭圆第一象限分为两个区域，分别处理斜率大于和小于-1的情况
 * 利用椭圆的四对称性，只需计算第一象限的像素点
 * @param center 椭圆中心坐标
 * @param radiusX 椭圆长轴半径（X方向）
 * @param radiusY 椭圆短轴半径（Y方向）
 * @param color RGBA 格式的颜色
 * @returns 渲染像素信息数组
 */
export function midpointEllipse(
  center: Point,
  radiusX: number,
  radiusY: number,
  color: RGBAColor
): PixelInfo[] {
  const pixels: PixelInfo[] = [];

  // 从椭圆顶部开始 (0, radiusY)
  let x = 0;
  let y = radiusY;

  // ===== 区域1：斜率绝对值 < 1 的部分 =====
  // 初始化判别参数 p1
  let decision1 = radiusY * radiusY - radiusX * radiusX * radiusY + 0.25 * radiusX * radiusX;

  // 计算增量，用于更新判别参数
  let dx = 2 * radiusY * radiusY * x;
  let dy = 2 * radiusX * radiusX * y;

  // 在区域1中，当 dx < dy 时继续（斜率绝对值 < 1）
  while (dx < dy) {
    // 绘制当前点的4个对称点
    const symmetricPoints = getSymmetricEllipsePoints(center, { x, y });
    for (const point of symmetricPoints) {
      pixels.push(getPixel(point, color));
    }

    // 根据判别参数决定下一个点的位置
    if (decision1 < 0) {
      // 中点在椭圆内部，选择右边的点 (x+1, y)
      x = x + 1;
      dx = dx + 2 * radiusY * radiusY;
      decision1 = decision1 + dx + radiusY * radiusY;
    } else {
      // 中点在椭圆外部，选择右下方的点 (x+1, y-1)
      x = x + 1;
      y = y - 1;
      dx = dx + 2 * radiusY * radiusY;
      dy = dy - 2 * radiusX * radiusX;
      decision1 = decision1 + dx - dy + radiusY * radiusY;
    }
  }

  // ===== 区域2：斜率绝对值 > 1 的部分 =====
  // 初始化判别参数 p2
  let decision2 =
    radiusY * radiusY * (x + 0.5) * (x + 0.5) +
    radiusX * radiusX * (y - 1) * (y - 1) -
    radiusX * radiusX * radiusY * radiusY;

  // 在区域2中，从当前y值一直到y=0
  while (y >= 0) {
    // 绘制当前点的4个对称点
    const symmetricPoints = getSymmetricEllipsePoints(center, { x, y });
    for (const point of symmetricPoints) {
      pixels.push(getPixel(point, color));
    }

    // 根据判别参数决定下一个点的位置
    if (decision2 > 0) {
      // 中点在椭圆外部，选择下方的点 (x, y-1)
      y = y - 1;
      dy = dy - 2 * radiusX * radiusX;
      decision2 = decision2 - dy + radiusX * radiusX;
    } else {
      // 中点在椭圆内部，选择右下方的点 (x+1, y-1)
      x = x + 1;
      y = y - 1;
      dx = dx + 2 * radiusY * radiusY;
      dy = dy - 2 * radiusX * radiusX;
      decision2 = decision2 + dx - dy + radiusX * radiusX;
    }
  }

  // 由于某些点可能重复（如45度点），需要去重
  return removeDuplicatePixels(pixels);
}
