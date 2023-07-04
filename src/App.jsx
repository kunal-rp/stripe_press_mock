import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import useAnimationHelper from "./util/useAnimationHelper.js";

function Book(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  return (
    <mesh {...props} ref={mesh}>
      <boxGeometry args={[5, 1, 1]} />
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
}

const BOOKS = [
  {
    name: "book1",
  },
  {
    name: "book2",
  },
  {
    name: "book3",
  },
  {
    name: "book4",
  },
  {
    name: "book5",
  },
  {
    name: "book6",
  },
  {
    name: "book7",
  },
  {
    name: "book8",
  },
];

function Scene(props) {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <Books {...props} />
    </Canvas>
  );
}

function Books(props) {
  const { camera } = useThree();

  useEffect(() => {
    if (props.activeSection) {
      var maxHeightDelta = BOOKS.length * 2;
      camera.position.set(0, -16 * props.percentageScroll, +5);
    }
  }, [props.percentageScroll]);

  return (
    <>
      {BOOKS.map((book, index) => (
        <Book position={[0, index * -2, 0]} />
      ))}{" "}
    </>
  );
}

// filler size in 'vh'
const SECTION_POSITIONS = [
  {
    name: "books",
    fillerSize: 500,
    element: <Scene />,
  },
  {
    name: "gif",
    element: <div style={{ background: "green", height: "100vh" }} />,
  },
  {
    name: "footer",
    element: <div style={{ background: "gray", height: "100vh" }} />,
  },
];

function vhToPixels(vh) {
  return Math.round(window.innerHeight / (100 / vh));
}

// calculate starting pixel y position & pixel size of secitons
// sections default to 100vh if filler size not provided
function convertSections() {
  return SECTION_POSITIONS.map((section, index) => {
    section.fillerSize = section.fillerSize ?? 100;
    section.startingPixel = SECTION_POSITIONS.slice(0, index)
      .map((section) => section.fillerSize)
      .reduce((acc, val) => acc + vhToPixels(val), 0);
    section.fillerPizelSize = vhToPixels(section.fillerSize);
    return section;
  });
}

function Section(props) {
  const containerRef = useRef();

  const [activeSection, percentageScroll, setStartPix, setSize] =
    useAnimationHelper();

  useEffect(() => {
    setStartPix(props.startingPixel);
    setSize(props.fillerPizelSize);
  }, [percentageScroll]);

  return (
    <div className="container" ref={containerRef}>
      <div className="content">
        {" "}
        {React.cloneElement(props.element, {
          containerRef: containerRef,
          activeSection: activeSection,
          percentageScroll: percentageScroll,
        })}
      </div>
      <div className="filler" style={{ height: props.fillerSize + "vh" }} />
    </div>
  );
}

export default function App(props) {
  return (
    <div>
      {convertSections().map((section) => (
        <Section
          name={section.name}
          fillerSize={section.fillerSize}
          element={section.element}
          startingPixel={section.startingPixel}
          fillerPizelSize={section.fillerPizelSize}
        />
      ))}
    </div>
  );
}
