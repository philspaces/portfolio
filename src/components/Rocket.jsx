import { useAnimations, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import rocket from "../assets/3d/cosmonaut_on_a_rocket.glb";
import CanvasLoader from "./CanvasLoader.jsx";

const Rocket = ({ scale, position }) => {
  const rocketRef = useRef();
  const { scene, animations } = useGLTF(rocket);
  const { actions } = useAnimations(animations, rocketRef);

  useEffect(() => {
    actions["Take 001"].play();
  }, [actions]);

  return (
    <mesh
      ref={rocketRef}
      position={position}
      scale={scale}
      rotation={[0, 0.5, 0.5]}
    >
      <primitive object={scene} />
    </mesh>
  );
};

const RocketCanvas = ({ scrollContainer }) => {
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [scale, setScale] = useState([0.005, 0.005, 0.005]);
  const [position, setPosition] = useState([0.2, -0.7, 0]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = scrollContainer.current.scrollTop;
      const rotationXValue = scrollTop * -0.0006;
      const rotationYValue = scrollTop * -0.00075;
      setRotationX(rotationXValue);
      setRotationY(rotationYValue);
    };

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScale([0.005, 0.005, 0.005]);
      } else if (window.innerWidth < 1024) {
        setScale([0.005, 0.005, 0.005]);
      } else if (window.innerWidth < 1280) {
        setScale([0.005, 0.005, 0.005]);
      } else if (window.innerWidth < 1536) {
        setScale([0.005, 0.005, 0.005]);
      } else {
        setScale([0.007, 0.007, 0.007]);
      }
    };

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollContainer]);

  return (
    <Canvas
      className={`w-full h-screen bg-transparent z-10`}
      camera={{ near: 0.1, far: 1000 }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <directionalLight position={[1, 1, 1]} intensity={2} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 5, 10]} intensity={2} />
        <spotLight
          position={[0, 50, 10]}
          angle={0.15}
          penumbra={1}
          intensity={2}
        />
        <hemisphereLight
          skyColor="#b1e1ff"
          groundColor="#000000"
          intensity={1}
        />

        <Rocket
          rotationX={rotationX}
          rotationY={rotationY}
          scale={scale}
          position={position}
        />
      </Suspense>
    </Canvas>
  );
};

export default RocketCanvas;
