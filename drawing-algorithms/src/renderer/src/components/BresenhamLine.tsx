import { Group, Line, Rect } from "react-konva";

import { Point, logicalToCanvasPoint } from "@renderer/utils/canvas";
import { bresenhamLine } from "@renderer/utils/lines";
import { ColorRGB, rgbToString, rgbToTransparentColor } from "@renderer/utils/color";

const BresenhamLine = ({
  start,
  end,
  color
}: {
  start: Point;
  end: Point;
  color: ColorRGB;
}): React.JSX.Element => {
  const { convertedStart, convertedEnd } = {
    convertedStart: logicalToCanvasPoint(start),
    convertedEnd: logicalToCanvasPoint(end)
  };
  const bresenhamLinePixelsInfo = bresenhamLine(start, end, color);

  return (
    <Group>
      {/* Actual line drawn by the canvas */}
      <Line
        points={[convertedStart.x, convertedStart.y, convertedEnd.x, convertedEnd.y]}
        stroke={rgbToString(color)}
        strokeWidth={3}
        lineCap="round"
        lineJoin="round"
      />
      {/* Pixel of the lines */}
      {bresenhamLinePixelsInfo.map((pixel, index) => (
        <Rect
          x={pixel.x}
          y={pixel.y}
          width={pixel.width}
          height={pixel.height}
          fill={rgbToTransparentColor(pixel.color, 0.5)}
          key={index}
        />
      ))}
    </Group>
  );
};

export default BresenhamLine;
