import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { FC, useEffect, useRef, useState } from "react";
import { BufferGeometry, Material, Mesh } from "three";
import ryuguAcceleration from "../../public/ryuguAcceleration.json";

export const AsteroidCanvas: FC<{
  geometry: BufferGeometry | null;
  material: Material | null;
  setSelectedMapData: (selectedMapData: number) => void;
}> = ({ geometry, material, setSelectedMapData }) => {
  const ref = useRef<Mesh>(null);

  return (
    <Canvas camera={{ fov: 0.13, near: 0.1, far: 1000 }}>
      <CameraController />
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
      <directionalLight color="white" position={[0, 0, 10]} />
      <directionalLight color="white" position={[0, 0, -10]} />
    </Canvas>
  );
};

const CameraController: FC = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 1000);
  }, []);

  return <OrbitControls camera={camera} domElement={domElement} />;
};
