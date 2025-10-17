import useImage from "use-image";
import { Stage, Layer, Image } from "react-konva";

import grid from "@renderer/assets/grid-40.svg";
import { canvasLength } from "@renderer/utils/canvas";
import BresenhamLine from "./BresenhamLine";

const LineCanvas = (): React.JSX.Element => {
  const [gridImage] = useImage(grid);

  return (
    <Stage width={canvasLength} height={canvasLength} className="mx-auto">
      <Layer>
        <Image image={gridImage} x={0} y={0} width={canvasLength} height={canvasLength} />

        {/* -1 <= slope <= 1 */}

        {/* startX < endX */}
        <BresenhamLine
          start={{ x: -15, y: -10 }}
          end={{ x: 10, y: 12 }}
          color={{
            r: 0,
            g: 0,
            b: 255
          }}
        />
      </Layer>
    </Stage>
  );
};

export default LineCanvas;
