import useImage from "use-image";
import { Stage, Layer, Image } from "react-konva";

import grid from "@renderer/assets/grid-40.svg";
import { canvasLength } from "@renderer/utils/canvas";

const EllipseCanvas = (): React.JSX.Element => {
  const [gridImage] = useImage(grid);

  return (
    <div className="flex gap-6 items-start">
      {/* Control Panel */}
      <div className="flex flex-col gap-4 p-5 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200 shadow-sm min-w-[220px]">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-gray-800 mb-1">中点画椭圆算法</h2>
          <p className="text-xs text-gray-600">使用中点画椭圆算法绘制椭圆</p>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <h3 className="font-semibold text-sm text-purple-700 mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            椭圆中心
          </h3>
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <label className="text-xs font-medium text-gray-600 w-5">X:</label>
              <input
                type="number"
                value={0}
                disabled
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div className="flex gap-2 items-center">
              <label className="text-xs font-medium text-gray-600 w-5">Y:</label>
              <input
                type="number"
                value={0}
                disabled
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <h3 className="font-semibold text-sm text-purple-700 mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            长短轴
          </h3>
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <label className="text-xs font-medium text-gray-600 w-5">a:</label>
              <input
                type="number"
                value={8}
                disabled
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div className="flex gap-2 items-center">
              <label className="text-xs font-medium text-gray-600 w-5">b:</label>
              <input
                type="number"
                value={5}
                disabled
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
        <Stage width={canvasLength} height={canvasLength}>
          <Layer>
            <Image image={gridImage} x={0} y={0} width={canvasLength} height={canvasLength} />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default EllipseCanvas;
