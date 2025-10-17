export type ColorRGB = {
  r: number;
  g: number;
  b: number;
};

export function rgbToString(color: ColorRGB): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function rgbToTransparentColor(color: ColorRGB, alpha: number): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}
