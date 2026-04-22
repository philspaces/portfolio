import { useAnimations, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import rocket from "../assets/3d/cosmonaut_on_a_rocket.glb";
import CanvasLoader from "./CanvasLoader.jsx";

const RocketModel = ({ scale, position, rotation }) => {
  const { scene, animations } = useGLTF(rocket);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const { actions } = useAnimations(animations, clonedScene);

  useEffect(() => {
    const firstAction = Object.values(actions).find(Boolean);
    firstAction?.play();
  }, [actions]);

  return (
    <primitive object={clonedScene} position={position} scale={scale} rotation={rotation} />
  );
};

const RocketCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <Canvas className="h-full w-full bg-transparent" camera={{ position: [0, 0, 4.5], fov: 35, near: 0.1, far: 1000 }}>
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 3]} intensity={2.4} />
        <pointLight position={[-3, 2, 3]} intensity={1.2} />
        <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={0.9} />
        <RocketModel
          scale={isMobile ? [0.0045, 0.0045, 0.0045] : [0.0062, 0.0062, 0.0062]}
          position={isMobile ? [0, -0.9, 0] : [1.2, -0.55, 0]}
          rotation={[-0.15, 0.7, 0.25]}
        />
      </Suspense>
    </Canvas>
  );
};

useGLTF.preload(rocket);

export default RocketCanvas;
