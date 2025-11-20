import { useEffect, useRef, useState } from "react";
import useImage from "use-image";
import type Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage, Layer, Image, Transformer } from "react-konva";

import grid from "@renderer/assets/grid-40.svg";
import { canvasLength, Point } from "@renderer/utils/canvas";
import CircleRenderer from "./CircleRenderer";

const CircleCanvas = (): React.JSX.Element => {
  const [gridImage] = useImage(grid);
  const [circleCenter, setCircleCenter] = useState<Point>({ x: 0, y: 0 });
  const [radius, setRadius] = useState<number>(10);
  const [isSelected, setIsSelected] = useState(false);

  const circleGroupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const handleCenterChange = (newCenter: Point): void => {
    setCircleCenter(newCenter);
  };

  const handleInputChange = (type: "centerX" | "centerY" | "radius", value: string): void => {
    const numValue = parseInt(value) || 0;
    if (type === "centerX") {
      setCircleCenter((prev) => ({ ...prev, x: numValue }));
    } else if (type === "centerY") {
      setCircleCenter((prev) => ({ ...prev, y: numValue }));
    } else if (type === "radius") {
      setRadius(numValue);
    }
  };

  const handleTransform = (newCenter: Point, newRadius: number): void => {
    setCircleCenter(newCenter);
    setRadius(newRadius);
  };

  const handleStagePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>): void => {
    const stage = e.target.getStage();
    if (!stage) return;

    const clickedOnEmpty = e.target === stage;
    const clickedTransformerHandle = e.target.getParent()?.className === "Transformer";

    if (clickedOnEmpty && !clickedTransformerHandle) {
      setIsSelected(false);
    }
  };

  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;

    if (isSelected && circleGroupRef.current) {
      transformer.nodes([circleGroupRef.current]);
      transformer.getLayer()?.batchDraw();
      transformer.forceUpdate?.();
    } else {
      transformer.nodes([]);
    }
  }, [isSelected, circleCenter, radius]);

  return (
    <div className="flex gap-6 items-center h-full">
      {/* Control Panel */}
      <div
        className="flex flex-col gap-3 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-xl w-[240px] h-full overflow-y-auto custom-scrollbar"
        style={{ maxHeight: `${canvasLength}px` }}
      >
        <div className="mb-1">
          <h2 className="text-base font-bold text-white mb-0.5">中点画圆</h2>
          <p className="text-xs text-slate-400">Bresenham 圆算法</p>
        </div>

        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
          <h3 className="font-semibold text-xs text-red-300 mb-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full shadow-[0_0_5px_rgba(248,113,113,0.5)]"></span>
            圆心
          </h3>
          <div className="space-y-1.5">
            <div className="flex gap-1.5 items-center">
              <label className="text-xs font-medium text-slate-400 w-3">X</label>
              <input
                type="number"
                value={circleCenter.x}
                onChange={(e) => handleInputChange("centerX", e.target.value)}
                className="flex-1 px-2 py-1 text-xs bg-black/20 border border-white/10 text-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-1.5 items-center">
              <label className="text-xs font-medium text-slate-400 w-3">Y</label>
              <input
                type="number"
                value={circleCenter.y}
                onChange={(e) => handleInputChange("centerY", e.target.value)}
                className="flex-1 px-2 py-1 text-xs bg-black/20 border border-white/10 text-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
          <h3 className="font-semibold text-xs text-red-300 mb-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full shadow-[0_0_5px_rgba(248,113,113,0.5)]"></span>
            半径
          </h3>
          <input
            type="number"
            value={radius}
            onChange={(e) => handleInputChange("radius", e.target.value)}
            className="w-full px-2 py-1 text-xs bg-black/20 border border-white/10 text-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Canvas */}
      <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black/20 backdrop-blur-sm">
        <Stage
          width={canvasLength}
          height={canvasLength}
          onMouseDown={handleStagePointerDown}
          onTouchStart={handleStagePointerDown}
        >
          <Layer>
            <Image
              image={gridImage}
              x={0}
              y={0}
              width={canvasLength}
              height={canvasLength}
              listening={false}
            />
            <CircleRenderer
              ref={circleGroupRef}
              center={circleCenter}
              radius={radius}
              color={{ r: 220, g: 38, b: 38, a: 1 }}
              onCenterChange={handleCenterChange}
              onSelect={() => setIsSelected(true)}
              onTransform={handleTransform}
              isSelected={isSelected}
            />
            <Transformer
              ref={transformerRef}
              rotateEnabled={false}
              centeredScaling
              keepRatio
              enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default CircleCanvas;
