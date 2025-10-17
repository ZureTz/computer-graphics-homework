import useImage from "use-image";
import { Stage, Layer, Image } from "react-konva";

import grid from "@renderer/assets/grid-40.svg";
import { canvasLength } from "@renderer/utils/canvas";

const PolygonCanvas = (): React.JSX.Element => {
  const [gridImage] = useImage(grid);

  return (
    <div className="flex gap-6 items-start">
      {/* Control Panel */}
      <div className="flex flex-col gap-4 p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm min-w-[220px]">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-gray-800 mb-1">多边形填充算法</h2>
          <p className="text-xs text-gray-600">使用扫描线算法填充多边形</p>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <h3 className="font-semibold text-sm text-green-700 mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            顶点数量
          </h3>
          <input
            type="number"
            value={0}
            disabled
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50"
          />
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <h3 className="font-semibold text-sm text-green-700 mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            操作说明
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            点击画布添加顶点，形成多边形。右键点击完成绘制。
          </p>
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

export default PolygonCanvas;
