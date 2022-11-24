import "./App.css";
import { Canvas } from "@react-three/fiber";
import { BufferGeometry, BufferGeometryLoader, Material, Mesh } from "three";
import loadJson from "./loadJson";
import { useEffect, useRef, useState } from "react";
import { ColorMap } from "./types/loader";
import Select from "react-select";
import ryuguAcceleration from "../public/ryuguAcceleration.json";

const ryuguDataOptions = [
  {
    value: "ryuguAcceleration",
    label: "Ryugu Acceleration",
  },
  {
    value: "ryuguGeopotentialHeight",
    label: "Ryugu Geopotential Height",
  },
  {
    value: "ryuguGravitationalSlope",
    label: "Ryugu Gravitational Slope",
  },
];

export function App() {
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);
  const [material, setMaterial] = useState<Material | null>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [colorMap, setColorMap] = useState<ColorMap>(ColorMap.Rainbow);
  const [dataOption, setDataOption] = useState(ryuguDataOptions[0]);
  const [selectedMapData, setSelectedMapData] = useState<number | null>(null);
  const ref = useRef<Mesh>(null);
  const loader = new BufferGeometryLoader();
  useEffect(() => {
    loader.load(
      import.meta.env.PROD
        ? `../${dataOption.value}.json`
        : `../public/${dataOption.value}.json`,
      (geometry) => loadJson(geometry, setGeometry, setMaterial, colorMap)
    );
  }, [colorMap, dataOption]);

  const reverseColorMap =
    colorMap === ColorMap.Rainbow ? ColorMap.Grayscale : ColorMap.Rainbow;

  return (
    <div id="canvas-container">
      <Canvas
        camera={{ fov: 20, near: 0.1, far: 1000, position: [5, 5, 0] }}
        onPointerDown={() => setIsPointerDown(true)}
        onPointerUp={() => setIsPointerDown(false)}
        onPointerMove={(e) => {
          if (isPointerDown) {
            ref.current?.rotateZ(e.movementY * 0.01);
            ref.current?.rotateY(e.movementX * 0.01);
          }
        }}
      >
        {geometry && material && (
          <mesh
            ref={ref}
            castShadow
            receiveShadow
            geometry={geometry}
            material={material}
            onClick={(e) => {
              e.faceIndex &&
                setSelectedMapData(
                  (ryuguAcceleration as any).data.attributes.pressure.array[
                    e.faceIndex
                  ]
                );
            }}
          />
        )}
        <ambientLight intensity={0.1} />
        <directionalLight color="white" position={[0, 0, 5]} />
      </Canvas>

      <button
        onClick={() => setColorMap(reverseColorMap)}
        className="color-map-button"
      >
        change color
      </button>
      <Select
        className="data-selector"
        options={ryuguDataOptions}
        value={dataOption}
        onChange={(option) => option && setDataOption(option)}
      />
      {selectedMapData && (
        <div className="selected-map-data">
          Ryugu Acceleration
          <br />
          selected point: {selectedMapData} m/sec^2
        </div>
      )}
    </div>
  );
}
