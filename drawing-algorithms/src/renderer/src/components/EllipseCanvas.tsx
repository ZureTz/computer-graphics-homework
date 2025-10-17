import useImage from "use-image";
import { Stage, Layer, Image } from "react-konva";

import grid from "@renderer/assets/grid-40.svg";
import { canvasLength } from "@renderer/utils/canvas";

const EllipseCanvas = (): React.JSX.Element => {
  const [gridImage] = useImage(grid);

  return (
    <Stage width={canvasLength} height={canvasLength} className="mx-auto">
      <Layer>
        <Image image={gridImage} x={0} y={0} width={canvasLength} height={canvasLength} />
      </Layer>
    </Stage>
  );
};

export default EllipseCanvas;
