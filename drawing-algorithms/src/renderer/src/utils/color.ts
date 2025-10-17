export type RGBAColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export function rgbToString(color: RGBAColor): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}
