import { RgbColor, HsvColor } from "react-colorful";

const toHex = (n: number): string => n.toString(16).padStart(2, "0");
export function convertRgbToHex(color: RgbColor): string {
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`.toUpperCase();
}

export function convertHexToRgb(color: string): RgbColor {
  if (!(color.length === 7 && color[0] === "#")) {
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: parseInt(color.slice(1, 3), 16),
    g: parseInt(color.slice(3, 5), 16),
    b: parseInt(color.slice(5, 7), 16)
  };
}

export function convertRgbToHsv(color: RgbColor): HsvColor {
  const { r_ratio, g_ratio, b_ratio } = {
    r_ratio: color.r / 255,
    g_ratio: color.g / 255,
    b_ratio: color.b / 255
  };

  const { c_max, c_min } = {
    c_max: Math.max(r_ratio, g_ratio, b_ratio),
    c_min: Math.min(r_ratio, g_ratio, b_ratio)
  };

  const delta = c_max - c_min;

  // Hue calculation
  let hue = 0;
  if (delta !== 0) {
    switch (c_max) {
      case r_ratio:
        hue = ((g_ratio - b_ratio) / delta) % 6;
        break;
      case g_ratio:
        hue = (b_ratio - r_ratio) / delta + 2;
        break;
      case b_ratio:
        hue = (r_ratio - g_ratio) / delta + 4;
        break;
    }
  }

  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;

  // Saturation calculation
  const saturation = c_max === 0 ? 0 : delta / c_max;

  // Value calculation
  const value = c_max;

  return { h: hue, s: saturation * 100, v: value * 100 };
}

export function convertHsvToRgb(color: HsvColor): RgbColor {
  const { h, s, v } = {
    h: color.h,
    s: color.s / 100,
    v: color.v / 100
  };

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let { r_prime, g_prime, b_prime } = { r_prime: 0, g_prime: 0, b_prime: 0 };

  if (0 <= h && h < 60) {
    r_prime = c;
    g_prime = x;
    b_prime = 0;
  } else if (60 <= h && h < 120) {
    r_prime = x;
    g_prime = c;
    b_prime = 0;
  } else if (120 <= h && h < 180) {
    r_prime = 0;
    g_prime = c;
    b_prime = x;
  } else if (180 <= h && h < 240) {
    r_prime = 0;
    g_prime = x;
    b_prime = c;
  } else if (240 <= h && h < 300) {
    r_prime = x;
    g_prime = 0;
    b_prime = c;
  } else if (300 <= h && h <= 360) {
    r_prime = c;
    g_prime = 0;
    b_prime = x;
  }

  return {
    r: Math.round((r_prime + m) * 255),
    g: Math.round((g_prime + m) * 255),
    b: Math.round((b_prime + m) * 255)
  };
}

// Color string validation and parsing functions
export function parseRgbString(rgbString: string): RgbColor | null {
  const match = rgbString.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (!match) return null;

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) return null;

  return { r, g, b };
}

export function parseHsvString(hsvString: string): HsvColor | null {
  const match = hsvString.match(/^hsv\(\s*(\d+)°?\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i);
  if (!match) return null;

  const h = parseInt(match[1], 10);
  const s = parseInt(match[2], 10);
  const v = parseInt(match[3], 10);

  if (h < 0 || h > 360 || s < 0 || s > 100 || v < 0 || v > 100) return null;

  return { h, s, v };
}

export function parseHexString(hexString: string): RgbColor | null {
  const normalizedHex = hexString.trim().toUpperCase();
  if (!/^#[0-9A-F]{6}$/.test(normalizedHex)) return null;

  return convertHexToRgb(normalizedHex);
}
