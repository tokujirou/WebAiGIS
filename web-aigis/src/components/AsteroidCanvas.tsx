import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { FC, useEffect, useRef } from "react";
import { BufferGeometry, Camera, Material, Mesh } from "three";
import ryuguAcceleration from "../../public/ryuguAcceleration.json";
import { useLocation } from "react-router-dom";

export const AsteroidCanvas: FC<{
  geometry: BufferGeometry | null;
  material: Material | null;
  setSelectedMapData: (selectedMapData: number) => void;
  setCamera: (camera: Camera) => void;
}> = ({ geometry, material, setSelectedMapData, setCamera }) => {
  const ref = useRef<Mesh>(null);

  return (
    <Canvas camera={{ fov: 0.13, near: 0.1, far: 1000 }}>
      <CameraController setCamera={setCamera} />
      {geometry && material && (
        <mesh
          ref={ref}
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
      <ambientLight intensity={0.5} />
    </Canvas>
  );
};

const CameraController: FC<{ setCamera: (camera: Camera) => void }> = ({
  setCamera,
}) => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  setCamera(camera);
  const search = useLocation().search;
  const params = new URLSearchParams(search);
  const x = params.get("x");
  const y = params.get("y");
  const z = params.get("z");

  useEffect(() => {
    camera.position.set(0, 0, 1000);
    if (x || y || z) {
      camera.position.set(Number(x), Number(y), Number(z));
    }
  }, [x, y, z]);

  return <OrbitControls camera={camera} domElement={domElement} />;
};
