import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (mesh.current.rotation.x += delta));
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

function Books(props) {
  return (
    <Canvas
      style={{ width: "100vw", height: "100vh", background: props.color }}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
}

function ProgressIndicator(props) {
  const [per, setPer] = useState(0);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      var containerRect = props.containerRef.current.getBoundingClientRect();

      console.log(containerRect.top + window.scrollY);
      var winScroll = document.documentElement.scrollTop - containerRect.top;
      var height = containerRect.height;
      var scrolled = (winScroll / height) * 100;
      setPer(scrolled);
    });
  }, []);
  return <>{per}</>;
}

const SECTION_POSITIONS = [
  {
    fillerSize: "200vh",
    element: <Books color={"red"} />,
  },
  {
    element: <div style={{ background: "green", height: "10vh" }} />,
  },
  {
    fillerSize: "200vh",
    element: <Books color={"blue"} />,
  },
  {
    element: <div style={{ background: "green", height: "10vh" }} />,
  },
  {
    fillerSize: "200vh",
    element: <Books color={"yellow"} />,
  },
];

function Section(props) {
  const containerRef = useRef();

  return (
    <div className="container" ref={containerRef}>
      <div className="content">
        {" "}
        {React.cloneElement(props.element, {
          containerRef: containerRef,
        })}
      </div>
      <div className="filler" style={{ height: props.fillerSize ?? "0px" }} />
    </div>
  );
}

export default function App(props) {
  const containerRef1 = useRef();
  const containerRef2 = useRef();
  const containerRef3 = useRef();

  return (
    <div>
      {SECTION_POSITIONS.map((section) => (
        <Section fillerSize={section.fillerSize} element={section.element} />
      ))}
    </div>
  );
}
