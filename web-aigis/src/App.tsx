import "./App.css";
import { BufferGeometry, BufferGeometryLoader, Camera, Material } from "three";
import loadJson from "./loadJson";
import { useEffect, useState } from "react";
import { ColorMap } from "./types/loader";
import Select from "react-select";
import { AsteroidCanvas } from "./components/AsteroidCanvas";
import { UrlGenerateButton } from "./components/UrlGenerateButton";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";

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
  const selectedDataOptionValue = params.get("selectedDataOption");
  const selectedMapDataPoint = params.get("selectedMapData");
  const paramsColorMap = params.get("colorMap");
  const [selectedMapData, setSelectedMapData] = useState<number | null>(
    selectedMapDataPoint ? Number(selectedMapDataPoint) : null
  );

  const [colorMap, setColorMap] = useState<ColorMap>(
    (paramsColorMap as ColorMap) ?? ColorMap.Rainbow
  );
  const [selectedDataOption, setSelectedDataOption] = useState(
    ryuguDataOptions.find(
      (option) => option.value === selectedDataOptionValue
    ) ?? ryuguDataOptions[0]
  );
  const [camera, setCamera] = useState<Camera | null>(null);

  const loader = new BufferGeometryLoader();

  useEffect(() => {
    // カラーマップまたは選択されているデータが変更されたら、ロードをし直す。
    loader.load(
      import.meta.env.PROD
        ? `../${selectedDataOption.value}.json`
        : `../public/${selectedDataOption.value}.json`,
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
  }, [colorMap, selectedDataOption]);

  return (
    <div id="canvas-container">
      <AsteroidCanvas
        geometry={geometry}
        material={material}
        setSelectedMapData={setSelectedMapData}
        setCamera={setCamera}
      />
      <Button
        variant="outlined"
        onClick={() =>
          setColorMap((prev) =>
            prev === ColorMap.Rainbow ? ColorMap.Grayscale : ColorMap.Rainbow
          )
        }
        style={{
          position: "absolute",
          left: 12,
          top: 12,
          color: "white",
          borderColor: "white",
        }}
      >
        change color
      </Button>
      <Select
        className="data-selector"
        options={ryuguDataOptions}
        value={selectedDataOption}
        onChange={(option) => option && setSelectedDataOption(option)}
      />
      <UrlGenerateButton
        camera={camera}
        colorMap={colorMap}
        selectedMapData={selectedMapData}
        selectedDataOption={selectedDataOption}
      />
      {selectedMapData && (
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            fontSize: 4,
            fontWeight: "bold",
            backgroundColor: "aliceblue",
            color: "black",
            verticalAlign: "center",
            borderRadius: 8,
            padding: "8px 12px",
          }}
        >
          Asteroid: {asteroidName}
          <br />
          Mapdata Type: {mapdataKind}
          <br />
          selected point: {selectedMapData} {unit}
        </div>
      )}
    </div>
  );
}
