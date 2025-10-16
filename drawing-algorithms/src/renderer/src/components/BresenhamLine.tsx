import { Group, Rect } from "react-konva";

import { Point } from "@renderer/utils/canvas";
import { bresenhamLine } from "@renderer/utils/lines";

const BresenhamLine = ({
  start,
  end,
  color
}: {
  start: Point;
  end: Point;
  color: string;
}): React.JSX.Element => {
  const bresenhamLinePixelsInfo = bresenhamLine(start, end, color);
  return (
    <Group>
      {bresenhamLinePixelsInfo.map((pixel, index) => (
        <Rect
          x={pixel.x}
          y={pixel.y}
          width={pixel.width}
          height={pixel.height}
          fill={pixel.color}
          key={index}
        />
      ))}
    </Group>
  );
};

export default BresenhamLine;
