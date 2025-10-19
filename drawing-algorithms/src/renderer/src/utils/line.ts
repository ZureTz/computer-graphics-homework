import { Point } from "./canvas";
import { RGBAColor } from "./color";
import { PixelInfo, getPixel } from "./pixels";

/**
 * Bresenham 低斜率直线算法（-1 <= 斜率 <= 1）
 * 该版本以 x 递增，计算对应的 y 值
 * @param start 线段起点
 * @param end 线段终点
 * @param color RGBA 格式的颜色
 * @returns 渲染像素信息数组
 */
function bresenhamLineLow(start: Point, end: Point, color: RGBAColor): PixelInfo[] {
  // 计算水平和垂直距离
  const { dx, dy } = { dx: end.x - start.x, dy: Math.abs(end.y - start.y) };
  // 判断 y 是递增还是递减
  const yIncrement = start.y < end.y ? 1 : -1;

  // 判别参数，决定何时 y 递增
  let D = 2 * dy - dx;
  let currentY = start.y;

  const pixels: PixelInfo[] = [];
  // 遍历每个 x 坐标
  for (let currentX = start.x; currentX <= end.x; currentX++) {
    pixels.push(getPixel({ x: currentX, y: currentY }, color));
    // 判别参数大于0时，斜对角移动
    if (D > 0) {
      currentY += yIncrement;
      D += 2 * (dy - dx);
      continue;
    }
    // 否则水平方向移动
    D += 2 * dy;
  }
  return pixels;
}

/**
 * Bresenham 高斜率直线算法（斜率 < -1 或 > 1）
 * 该版本以 y 递增，计算对应的 x 值
 * @param start 线段起点
 * @param end 线段终点
 * @param color RGBA 格式的颜色
 * @returns 渲染像素信息数组
 */
function bresenhamLineHigh(start: Point, end: Point, color: RGBAColor): PixelInfo[] {
  // 计算水平和垂直距离
  const { dx, dy } = { dx: Math.abs(end.x - start.x), dy: end.y - start.y };
  // 判断 x 是递增还是递减
  const xIncrement = start.x < end.x ? 1 : -1;

  // 判别参数，决定何时 x 递增
  let D = 2 * dx - dy;
  let currentX = start.x;

  const pixels: PixelInfo[] = [];
  // 遍历每个 y 坐标
  for (let currentY = start.y; currentY <= end.y; currentY++) {
    pixels.push(getPixel({ x: currentX, y: currentY }, color));
    // 判别参数大于0时，斜对角移动
    if (D > 0) {
      currentX += xIncrement;
      D += 2 * (dx - dy);
      continue;
    }
    // 否则竖直方向移动
    D += 2 * dx;
  }
  return pixels;
}

/**
 * 使用 Bresenham 算法绘制直线
 * 该算法只用整数运算，非常高效。
 * 会根据斜率自动选择低斜率或高斜率版本。
 * @param start 线段起点 (x0, y0)
 * @param end 线段终点 (x1, y1)
 * @param color RGBA 格式的颜色
 * @returns 渲染像素信息数组
 */
export function bresenhamLine(start: Point, end: Point, color: RGBAColor): PixelInfo[] {
  // 判断是否为低斜率（更接近水平）
  if (Math.abs(end.y - start.y) < Math.abs(end.x - start.x)) {
    // Ensure we draw from left to right
    if (start.x > end.x) {
      return bresenhamLineLow(end, start, color);
    }
    return bresenhamLineLow(start, end, color);
  }

  // 高斜率（更接近竖直）
  // 保证从下到上绘制
  if (start.y > end.y) {
    return bresenhamLineHigh(end, start, color);
  }
  return bresenhamLineHigh(start, end, color);
}

/**
 * 使用 DDA（数字微分分析器）算法绘制直线
 * 该算法用浮点数插值，原理简单但速度比 Bresenham 慢。
 * @param start 线段起点 (x0, y0)
 * @param end 线段终点 (x1, y1)
 * @param color RGBA 格式的颜色
 * @returns 渲染像素信息数组
 */
export function ddaLine(start: Point, end: Point, color: RGBAColor): PixelInfo[] {
  // 计算 x 和 y 的差值
  const { dx, dy } = { dx: end.x - start.x, dy: end.y - start.y };

  // 步数取 dx 和 dy 的较大值
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  // 每步的增量
  const { xIncrement, yIncrement } = { xIncrement: dx / steps, yIncrement: dy / steps };

  const pixels: PixelInfo[] = [];
  let currentX = start.x;
  let currentY = start.y;
  // 逐步插值
  for (let i = 0; i <= steps; i++) {
    // 四舍五入到最近的像素点
    pixels.push(getPixel({ x: Math.round(currentX), y: Math.round(currentY) }, color));
    currentX += xIncrement;
    currentY += yIncrement;
  }
  return pixels;
}

/**
 * 使用吴小林抗锯齿直线算法绘制直线
 * 该算法通过调整像素透明度实现平滑抗锯齿效果，速度较慢但视觉质量更高。
 * @param start 线段起点 (x0, y0)
 * @param end 线段终点 (x1, y1)
 * @param color RGBA 格式的颜色
 * @returns 含抗锯齿效果的像素信息数组
 */
export function wuxiaolinLine(start: Point, end: Point, color: RGBAColor): PixelInfo[] {
  /**
   * 获取一个数的小数部分
   * @param x 输入数字
   * @returns 小数部分 (0 到 1)
   */
  const fractionalPart = (x: number): number => {
    return x - Math.floor(x);
  };

  /**
   * 获取剩余小数部分 (1 - 小数部分)
   * 用于计算更靠近直线像素的透明度
   * @param x 输入数字
   * @returns 1 减去小数部分
   */
  const remainingFractionalPart = (x: number): number => {
    return 1 - fractionalPart(x);
  };

  /**
   * 绘制带指定亮度（透明度）的像素（用于抗锯齿）
   * @param x 像素的 X 坐标
   * @param y 像素的 Y 坐标
   * @param brightness 亮度/透明度 (0 到 1)
   */
  const pixels: PixelInfo[] = [];
  const plot = (x: number, y: number, brightness: number): void => {
    pixels.push(getPixel({ x, y }, { ...color, a: brightness * (color.a ?? 1) }));
  };

  // 拷贝点，避免修改原始数据
  let x0 = start.x;
  let y0 = start.y;
  let x1 = end.x;
  let y1 = end.y;

  // 判断是否为陡峭直线（更接近竖直）
  const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);

  // 如果是陡峭直线，交换 x 和 y，简化计算
  if (steep) {
    [x0, y0] = [y0, x0];
    [x1, y1] = [y1, x1];
  }

  // 保证从左到右绘制
  if (x0 > x1) {
    [x0, x1] = [x1, x0];
    [y0, y1] = [y1, y0];
  }

  // 计算直线参数
  const dx = x1 - x0;
  const dy = y1 - y0;
  // 处理垂直线（dx = 0）时，梯度设为 1
  const gradient = dx === 0 ? 1.0 : dy / dx;

  // ===== 处理第一个端点 =====
  let xEnd = Math.round(x0);
  let yEnd = y0 + gradient * (xEnd - x0);
  // 计算端点的覆盖因子（抗锯齿）
  let xGap = remainingFractionalPart(x0 + 0.5);
  const xPixel1 = xEnd; // 主循环第一个像素的 x 坐标
  const yPixel1 = Math.floor(yEnd);

  // 绘制第一个端点的两个像素（抗锯齿）
  if (steep) {
    plot(yPixel1, xPixel1, remainingFractionalPart(yEnd) * xGap);
    plot(yPixel1 + 1, xPixel1, fractionalPart(yEnd) * xGap);
  } else {
    plot(xPixel1, yPixel1, remainingFractionalPart(yEnd) * xGap);
    plot(xPixel1, yPixel1 + 1, fractionalPart(yEnd) * xGap);
  }

  // 计算主循环的第一个 y 交点
  let intersectionY = yEnd + gradient;

  // ===== 处理第二个端点 =====
  xEnd = Math.round(x1);
  yEnd = y1 + gradient * (xEnd - x1);
  xGap = fractionalPart(x1 + 0.5);
  const xPixel2 = xEnd; // 主循环最后一个像素的 x 坐标
  const yPixel2 = Math.floor(yEnd);

  // 绘制第二个端点的两个像素（抗锯齿）
  if (steep) {
    plot(yPixel2, xPixel2, remainingFractionalPart(yEnd) * xGap);
    plot(yPixel2 + 1, xPixel2, fractionalPart(yEnd) * xGap);
  } else {
    plot(xPixel2, yPixel2, remainingFractionalPart(yEnd) * xGap);
    plot(xPixel2, yPixel2 + 1, fractionalPart(yEnd) * xGap);
  }

  // ===== 主循环：绘制端点之间的像素 =====
  if (steep) {
    // 陡峭直线，遍历 y 坐标
    for (let x = xPixel1 + 1; x < xPixel2; x++) {
      // 每个 x 坐标绘制两个像素，带抗锯齿亮度
      plot(Math.floor(intersectionY), x, remainingFractionalPart(intersectionY));
      plot(Math.floor(intersectionY) + 1, x, fractionalPart(intersectionY));
      intersectionY = intersectionY + gradient;
    }
  } else {
    // 平缓直线，遍历 x 坐标
    for (let x = xPixel1 + 1; x < xPixel2; x++) {
      // 每个 x 坐标绘制两个像素，带抗锯齿亮度
      plot(x, Math.floor(intersectionY), remainingFractionalPart(intersectionY));
      plot(x, Math.floor(intersectionY) + 1, fractionalPart(intersectionY));
      intersectionY = intersectionY + gradient;
    }
  }

  return pixels;
}
