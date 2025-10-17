import useImage from "use-image";
import { Stage, Layer, Image, Circle } from "react-konva";

import grid from "@renderer/assets/grid-40.svg";
import {
  canvasLength,
  canvasUnitLength,
  logicalToCanvasPoint,
  Point
} from "@renderer/utils/canvas";

const CircleCanvas = (): React.JSX.Element => {
  const [gridImage] = useImage(grid);
  const circleCenter: Point = { x: 1, y: 1 };
  const convertedCircleCenter = logicalToCanvasPoint(circleCenter);

  return (
    <Stage width={canvasLength} height={canvasLength} className="mx-auto">
      <Layer>
        <Image image={gridImage} x={0} y={0} width={canvasLength} height={canvasLength} />
        <Circle
          x={convertedCircleCenter.x}
          y={convertedCircleCenter.y}
          radius={canvasUnitLength * 5}
          fill="rgba(255, 0, 0, 0.5)"
          draggable
        />
      </Layer>
    </Stage>
  );
};

export default CircleCanvas;
