import "./App.css";
import { Canvas } from "@react-three/fiber";
import { BufferGeometry, BufferGeometryLoader, Material } from "three";
import loadJson from "./loadJson";
import { useEffect, useState } from "react";

export function App() {
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);
  const [material, setMaterial] = useState<Material | null>(null);
  const loader = new BufferGeometryLoader();
  useEffect(() => {
    if (import.meta.env.PROD) {
      loader.load("../test.json", (geometry) =>
        loadJson(geometry, setGeometry, setMaterial)
      );
    }
    if (import.meta.env.DEV) {
      loader.load("../public/test.json", (geometry) =>
        loadJson(geometry, setGeometry, setMaterial)
      );
    }
  }, []);

  return (
    <div id="canvas-container">
      <Canvas camera={{ fov: 20, near: 0.1, far: 1000, position: [5, 5, 0] }}>
        {geometry && material && (
          <mesh
            castShadow
            receiveShadow
            geometry={geometry}
            material={material}
          />
        )}
        <ambientLight intensity={0.1} />
        <directionalLight color="white" position={[0, 0, 5]} />
      </Canvas>
    </div>
  );
}
