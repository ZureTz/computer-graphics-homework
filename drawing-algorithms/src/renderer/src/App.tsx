import { Stage, Layer, Circle, Image } from "react-konva";
import useImage from "use-image";

import grid40 from "./assets/grid40.svg";
import Versions from "./components/Versions";
import { Point, basic40ToCanvasPoint, canvas40UnitLength, canvasLength } from "./utils/canvas";

function App(): React.JSX.Element {
  const [grid40Image] = useImage(grid40);
  const circleCenter: Point = { x: 1, y: 1 };
  const convertedCircleCenter = basic40ToCanvasPoint(circleCenter);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 space-y-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <Stage width={canvasLength} height={canvasLength} className="mx-auto">
          <Layer>
            <Image image={grid40Image} x={0} y={0} width={canvasLength} height={canvasLength} />
            <Circle
              x={convertedCircleCenter.x}
              y={convertedCircleCenter.y}
              radius={canvas40UnitLength * 5}
              fill="rgba(255, 0, 0, 0.5)"
              draggable
            />
          </Layer>
        </Stage>
      </div>
      <Versions />
    </div>
  );
}

export default App;
