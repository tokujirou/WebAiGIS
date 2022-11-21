import "./App.css";
import { Canvas } from "@react-three/fiber";
import { BufferGeometry, BufferGeometryLoader, Material, Mesh } from "three";
import loadJson from "./loadJson";
import { useEffect, useRef, useState } from "react";

export function App() {
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);
  const [material, setMaterial] = useState<Material | null>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const ref = useRef<Mesh>(null);
  const loader = new BufferGeometryLoader();
  useEffect(() => {
    loader.load(
      import.meta.env.PROD ? "../test.json" : "../public/test.json",
      (geometry) => loadJson(geometry, setGeometry, setMaterial)
    );
  }, []);

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
          />
        )}
        <ambientLight intensity={0.1} />
        <directionalLight color="white" position={[0, 0, 5]} />
      </Canvas>
    </div>
  );
}
