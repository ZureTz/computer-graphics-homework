export function formatColor(color: string): string {
  if (!(color.length === 7 && color[0] === "#")) {
    return color;
  }

  return `rgb(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)})`;
}
