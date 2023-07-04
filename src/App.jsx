import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import useAnimationHelper from "./util/useAnimationHelper.js";

import Logo from "../public/logo.svg";

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
    <Canvas style={{ width: "100vw", height: "100vh", background: "#281c1c" }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <Books {...props} />
    </Canvas>
  );
}

function Books(props) {
  const { camera } = useThree();

  const BOOK_DISTANCE = 1.5;

  useEffect(() => {
    if (props.activeSection) {
      var maxHeightDelta = BOOKS.length * BOOK_DISTANCE;
      camera.position.set(0, -maxHeightDelta * props.percentageScroll, +5);
    }
  }, [props.percentageScroll]);

  return (
    <>
      {BOOKS.map((book, index) => (
        <Book position={[0, index * -BOOK_DISTANCE, 0]} />
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
    element: (
      <div style={{ background: "white", height: "100vh", "z-index": 30 }} />
    ),
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
    section.fillerPixelSize = vhToPixels(section.fillerSize);
    return section;
  });
}

function Section(props) {
  const containerRef = useRef();

  const [activeSection, percentageScroll, setStartPix, setSize] =
    useAnimationHelper();

  useEffect(() => {
    setStartPix(props.startingPixel);
    setSize(props.fillerPixelSize);
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

function ProgressIndicator(props) {
  const [completeSections, setCompleteSections] = useState([]);

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  useEffect(() => {
    if (props.sections.length == 0) return;

    var accPixels = 0;

    setCompleteSections(
      BOOKS.map((book, index) => {
        book.sectionPixelSize =
          props.sections[0].fillerPixelSize / BOOKS.length;
        book.startingPixel = index * book.sectionPixelSize;
        return book;
      }).concat(
        props.sections.slice(1).map((section) => {
          section.sectionPixelSize = section.fillerPixelSize;
          return section;
        })
      )
    );
  }, [props.sections]);

  function setActiveSection() {
    var set = false;

    completeSections.forEach((section, index) => {
      if (
        document.documentElement.scrollTop <=
          section.startingPixel + section.sectionPixelSize &&
        !set
      ) {
        set = true;
        setActiveSectionIndex(index);
      }
    });
  }

  function forceActiveSection(index) {
    window.scrollTo(
      0,
      completeSections[index].startingPixel +
        completeSections[index].sectionPixelSize / 2
    );
  }

  useEffect(() => {
    window.addEventListener("scroll", setActiveSection);
    return () => window.removeEventListener("scroll", setActiveSection);
  }, [completeSections]);

  return (
    <div id="progressIndicator">
      <div id="sideBar">
        <img src={Logo} style={{ height: "5%" }} />
        <div id="sectionIndicatorContainer">
          {completeSections.map((section, index) => (
            <div
              className={
                "sectionIndicator " +
                (activeSectionIndex == index ? " full" : "")
              }
              onClick={() => forceActiveSection(index)}
            />
          ))}
        </div>
        <h1 id="help"> ? </h1>
      </div>
    </div>
  );
}

export default function App(props) {
  const [activeSection, setActiveSection] = useState(0);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    setSections(convertSections());
  }, []);

  return (
    <div>
      <ProgressIndicator sections={sections} />
      <div id="header">
        <h3>Stripe Press</h3>
        <h4 style={{ "font-style": "italic" }}>Ideas for progress</h4>
      </div>
      {sections.map((section) => (
        <Section
          name={section.name}
          fillerSize={section.fillerSize}
          element={section.element}
          startingPixel={section.startingPixel}
          fillerPixelSize={section.fillerPixelSize}
        />
      ))}
    </div>
  );
}
