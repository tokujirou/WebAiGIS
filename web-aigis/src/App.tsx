import "./App.css";
import { BufferGeometry, BufferGeometryLoader, Camera, Material } from "three";
import loadJson from "./loadJson";
import { useEffect, useState } from "react";
import { ColorMap } from "./types/loader";
import Select from "react-select";
import { AsteroidCanvas } from "./components/AsteroidCanvas";
import { UrlGenerateButton } from "./components/UrlGenerateButton";

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
  const [selectedMapData, setSelectedMapData] = useState<number | null>(null);

  const [colorMap, setColorMap] = useState<ColorMap>(ColorMap.Rainbow);
  const [dataOption, setDataOption] = useState(ryuguDataOptions[0]);
  const [camera, setCamera] = useState<Camera | null>(null);

  const loader = new BufferGeometryLoader();

  useEffect(() => {
    // カラーマップまたは選択されているデータが変更されたら、ロードをし直す。
    loader.load(
      import.meta.env.PROD
        ? `../${dataOption.value}.json`
        : `../public/${dataOption.value}.json`,
      (geometry) => loadJson(geometry, setGeometry, setMaterial, colorMap)
    );
  }, [colorMap, dataOption]);

  return (
    <div id="canvas-container">
      <AsteroidCanvas
        geometry={geometry}
        material={material}
        setSelectedMapData={setSelectedMapData}
        setCamera={setCamera}
      />
      <button
        onClick={() =>
          setColorMap((prev) =>
            prev === ColorMap.Rainbow ? ColorMap.Grayscale : ColorMap.Rainbow
          )
        }
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
      <UrlGenerateButton camera={camera} />
      {selectedMapData && (
        <div className="selected-map-data">
          {dataOption?.label}
          <br />
          selected point: {selectedMapData} m/sec^2
        </div>
      )}
    </div>
  );
}
