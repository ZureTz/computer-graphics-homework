import { Point } from "./canvas";
import { RGBAColor } from "./color";
import { getPixel, PixelInfo, removeDuplicatePixels } from "./pixels";
import {
  negateVec2,
  newVec2FromPoints,
  reflectVec2AroundX,
  reflectVec2AroundY,
  rotateVec2,
  Vec2
} from "./vec2";

/**
 * 获取圆上一个点的8个对称点
 * 利用圆的八对称性，从一个点生成其他7个对称点
 * 对称性包括：关于X轴、Y轴、原点对称，以及旋转90度后的对称
 * @param center 圆心坐标
 * @param offset 从圆心到基准点的偏移向量
 * @returns 包含8个对称点的数组
 */
function getSymmetricCirclePoints(center: Point, offset: Vec2): Point[] {
  // 计算基准点坐标
  const basePoint = { x: center.x + offset.x, y: center.y + offset.y };

  // 从圆心到基准点的向量
  const baseVector = newVec2FromPoints(center, basePoint);
  // 关于X轴对称（上下翻转）
  const xReflected = reflectVec2AroundX(baseVector);
  // 关于Y轴对称（左右翻转）
  const yReflected = reflectVec2AroundY(baseVector);
  // 关于原点对称（180度旋转）
  const negated = negateVec2(baseVector);

  // 基准向量旋转90度
  const rotated90 = rotateVec2(baseVector, Math.PI / 2);
  // 旋转后的向量关于X轴对称
  const rotated90XReflected = reflectVec2AroundX(rotated90);
  // 旋转后的向量关于Y轴对称
  const rotated90YReflected = reflectVec2AroundY(rotated90);
  // 旋转后的向量关于原点对称
  const rotated90Negated = negateVec2(rotated90);

  return [
    // 原始点及其三个镜像（关于X轴、Y轴、原点）
    basePoint,
    { x: center.x + xReflected.x, y: center.y + xReflected.y },
    { x: center.x + yReflected.x, y: center.y + yReflected.y },
    { x: center.x + negated.x, y: center.y + negated.y },

    // 旋转90度后的点及其三个镜像
    { x: center.x + rotated90.x, y: center.y + rotated90.y },
    {
      x: center.x + rotated90XReflected.x,
      y: center.y + rotated90XReflected.y
    },
    {
      x: center.x + rotated90YReflected.x,
      y: center.y + rotated90YReflected.y
    },
    {
      x: center.x + rotated90Negated.x,
      y: center.y + rotated90Negated.y
    }
  ];
}

/**
 * 使用中点画圆算法（Midpoint Circle Algorithm）绘制圆
 * 也称为 Jesko 圆算法，使用增量计算和八对称性来高效绘制圆
 * 该算法只使用整数运算，从第一象限的八分之一弧开始，利用对称性生成完整的圆
 * @param center 圆心坐标
 * @param radius 圆的半径
 * @param color RGBA 格式的颜色
 * @returns 渲染像素信息数组
 */
export function midpointCircle(center: Point, radius: number, color: RGBAColor): PixelInfo[] {
  // 初始化判别参数 d = 1 - r，这里使用 d/8 优化计算
  // 判别参数用于决定下一个像素是向右还是向右下移动
  let decision = radius / 16;

  // 从圆的最右边点开始 (radius, 0)
  let { x, y } = { x: radius, y: 0 };
  const pixels: PixelInfo[] = [];

  // 只需计算第一象限的1/8圆弧（45度内），其余通过对称性获得
  // 循环条件：当 x >= y 时，还在第一个八分之一圆内
  while (x >= y) {
    // 获取当前点(x, y)的8个对称点并绘制
    const symmetricPoints = getSymmetricCirclePoints(center, { x, y });
    for (const point of symmetricPoints) {
      pixels.push(getPixel(point, color));
    }

    // y 坐标递增（向上移动）
    y++;
    // 更新判别参数
    decision += y;
    const nextDecision = decision - x;

    // 如果判别参数 >= 0，说明中点在圆内或圆上
    // 需要选择右下方的像素，即 x 递减
    if (nextDecision >= 0) {
      decision = nextDecision;
      x--;
    }
    // 否则选择正右方的像素，x 保持不变
  }

  // 由于某些点可能重复（如45度点），需要去重
  return removeDuplicatePixels(pixels);
}
