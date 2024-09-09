import React, { useState, useEffect, useRef } from "react";
// import WireframeElement from './WireframeElement';
// import axios from 'axios';
// import html2canvas from 'html2canvas';
import "./WireframeRenderer.css";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import BackgroundImage from '../../../assets/images/checkbg.gif'
import WireframeLoader from '../../../assets/loaders/wireframe_loader.json'
import Lottie from 'react-lottie';

const WireframeRenderer = ({
  jsxData,
  loadingWireFrame,
}) => {
  // const [selectedElement, setSelectedElement] = useState(null);
  let previousAnnotations = localStorage.getItem("userSessionAnnotations");

  const [selectedOption, setSelectedOption] = useState("png");


  const [annotations, setAnnotations] = useState(
    previousAnnotations ? JSON.parse(previousAnnotations) : []
  );
  const iframeRef = useRef(null);


  useEffect(() => {
    localStorage.setItem("userSessionAnnotations", JSON.stringify(annotations));
  }, [annotations]);

  const customizeIframeContent = (event) => {
    const doc = event.target.contentDocument;

    // Create a new style element
    const style = document.createElement('style');
    style.innerHTML = '* { box-sizing: border-box; }';

    // Append the style element to the document head
    doc.head.appendChild(style);

    const applyStyles = (element, styles, elementName = 'body') => {
      const targetElement = elementName === 'html' ? element.documentElement : element.body;
      Object.assign(targetElement.style, styles);
    };

    // Apply global style
    applyStyles(doc, {
      boxSizing: "border-box"
    }, '*');

    // Style the html tag
    applyStyles(doc, {
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: 0
    }, 'html');

    // Style the body tag
    applyStyles(doc, {
      height: "100%",
      width: "100%",
      margin: "0",
      // display: "flex",
      // justifyContent: "center",
      // alignItems: "center",
      border: "none",
      overflow: "auto",
    });
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: WireframeLoader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };


  return (
    <div className="wireframe-div-container">
      {loadingWireFrame ? (
        <div
          className="wireframe-content-load"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          {/* <CircularProgress /> */}
          <Lottie
            options={defaultOptions}
            height={400}
            width={400}
          />
          {/* <iframe src="https://lottie.host/embed/69830c33-3743-41a3-9b6f-7826b0bc386e/JZwhMb22bE.json"></iframe>
          <iframe src="https://lottie.host/embed/a4873048-382e-4ff7-8f9f-5339d1e7763a/Vd7HETf83F.json" width="50%" height="50%"></iframe> */}
          {/* <p style={{fontFamily: "cursive"}}>Sit tight! Aster AI is crafting your wireframe.</p> */}
        </div>
      ) : (
        <>
        {console.log("jsxData>>>>>>>>>>>>>>>>>>>",jsxData)}
          <div className="wireframe-content">
            {
              jsxData && jsxData.length > 0 && (
                <iframe
                  id="your-iframe-id"
                  title="jsxData"
                  ref={iframeRef}
                  onLoad={customizeIframeContent}
                  style={{ width: "100%", height: "100%", border: "none",}}
                  srcDoc={`<div id="element-to-export" style="width: 100%; height: auto; min-height: 100%; padding: 0px;">${jsxData}</div>`}
                />
              )
            }
          </div>
        </>
      )}
    </div>
  );
};

export default WireframeRenderer;
