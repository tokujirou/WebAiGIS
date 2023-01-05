import "./App.css";
import { BufferGeometry, BufferGeometryLoader, Camera, Material } from "three";
import loadJson from "./loadJson";
import { useEffect, useState } from "react";
import { ColorMap } from "./types/loader";
import Select from "react-select";
import { AsteroidCanvas } from "./components/AsteroidCanvas";
import { UrlGenerateButton } from "./components/UrlGenerateButton";
import { useLocation } from "react-router-dom";

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
  const [asteroidName, setAsteroidName] = useState<string | null>(null);
  const [mapdataKind, setMapdataKind] = useState<string | null>(null);
  const [unit, setUnit] = useState<string | null>(null);

  const search = useLocation().search;
  const params = new URLSearchParams(search);
  const selectedMapDataPoint = params.get("selectedMapData");
  const [selectedMapData, setSelectedMapData] = useState<number | null>(
    selectedMapDataPoint ? Number(selectedMapDataPoint) : null
  );

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
      (geometry) =>
        loadJson(
          geometry,
          setGeometry,
          setMaterial,
          setAsteroidName,
          setMapdataKind,
          setUnit,
          colorMap
        )
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
      <UrlGenerateButton camera={camera} selectedMapData={selectedMapData} />
      {selectedMapData && (
        <div className="selected-map-data">
          {asteroidName} {mapdataKind}
          <br />
          selected point: {selectedMapData} {unit}
        </div>
      )}
    </div>
  );
}
