import { useState } from "react";
import useImage from "use-image";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage, Layer, Circle, Image, Rect } from "react-konva";

import grid from "@renderer/assets/grid-40.svg";
import {
  Point,
  logicalToCanvasPoint,
  canvasUnitLength,
  canvasLength,
  canvasToLogicalPoint
} from "@renderer/utils/canvas";
import BresenhamLine from "./BresenhamLine";

const PixelCanvas = (): React.JSX.Element => {
  const [gridImage] = useImage(grid);
  const circleCenter: Point = { x: 1, y: 1 };
  const convertedCircleCenter = logicalToCanvasPoint(circleCenter);

  const [pixels, setPixels] = useState<Point[]>([]);
  const handleCanvasClick = (e: KonvaEventObject<MouseEvent>): void => {
    const stage = e.target.getStage();
    if (!stage) {
      return;
    }
    const pos = stage.getPointerPosition();
    if (!pos) {
      return;
    }

    const logicalPoint = canvasToLogicalPoint({ x: pos.x, y: pos.y });

    setPixels((prevPixels) => [...prevPixels, logicalPoint]);
  };

  return (
    <Stage
      width={canvasLength}
      height={canvasLength}
      className="mx-auto"
      onMouseDown={handleCanvasClick}
    >
      <Layer>
        <Image image={gridImage} x={0} y={0} width={canvasLength} height={canvasLength} />
        {pixels.map((p, i) => {
          const canvasPoint = logicalToCanvasPoint(p);
          return (
            <Rect
              key={i}
              x={canvasPoint.x - canvasUnitLength / 2}
              y={canvasPoint.y - canvasUnitLength / 2}
              width={canvasUnitLength}
              height={canvasUnitLength}
              fill="rgba(173, 216, 230, 0.7)"
            />
          );
        })}
        <Circle
          x={convertedCircleCenter.x}
          y={convertedCircleCenter.y}
          radius={canvasUnitLength * 5}
          fill="rgba(255, 0, 0, 0.5)"
          draggable
        />

        {/* -1 <= slope <= 1 */}

        {/* startX < endX */}
        <BresenhamLine start={{ x: -15, y: -10 }} end={{ x: 10, y: 12 }} color="blue" />
        {/* startX > endX */}
        <BresenhamLine start={{ x: 18, y: 5 }} end={{ x: -12, y: -5 }} color="green" />

        {/* slope < -1 or slope > 1 */}
        {/* startY < endY */}
        <BresenhamLine start={{ x: -10, y: -15 }} end={{ x: 12, y: 10 }} color="purple" />
        {/* startY > endY */}
        <BresenhamLine start={{ x: 15, y: 18 }} end={{ x: -5, y: -12 }} color="orange" />

        {/* 负斜率示例 */}
        {/* -1 < slope < 0 */}
        <BresenhamLine start={{ x: -15, y: 15 }} end={{ x: 10, y: 5 }} color="red" />
        {/* slope < -1 */}
        <BresenhamLine start={{ x: -18, y: 10 }} end={{ x: -8, y: -15 }} color="black" />
      </Layer>
    </Stage>
  );
};

export default PixelCanvas;
