import React, { useState, useEffect } from 'react';
import ChatBox from './ChatBox'; // Adjust the import path as necessary
import WireframeRenderer from './WireframeRenderer'; // Adjust the import path as necessary
import ManualWireframeEditor from './ManualWireframeEditor'; // Placeholder - You'll need to create this component
import './App.css';
import { JSONToHTML } from 'html-to-json-parser'; // ES6
import MultipleWireframeScreen from './MultipleWireframeScreen'
import { useSelector } from "react-redux";
import { saveAs } from "file-saver";
import * as htmlToImage from "html-to-image";
import * as WireFramesApi from '../../../api/wireFrame.api';
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
function App() {
  const { selectedProject } = useSelector(state => state.orgDetails);
  const [chatHistory, setChatHistory] = useState([]); // Define chatHistory state
  const [wireframeData, setWireframeData] = useState({}); // Initial state for wireframeData
  const [isManualMode, setIsManualMode] = useState(false);
  const [loadingWireFrame, setLoadingWireFrame] = useState(false);
  const [showDefaultText, setShowDefaultText] = useState(true)
  const [checkedManualChanges, setCheckedManualChanges] = useState(false);
  const [projectId, setProjectId] = useState()
  const [messages, setMessages] = useState([{
    sender: "bot",
    text: "Aster AI: Your wireframing powerhouse. Share your vision, let's build brilliance",
    time: new Date()
  }]);
  const [jsxData, setJsxData] = useState();
  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [fetchAllWireframeData, setFetchAllWireframeData] = useState([]);
  const [totalWireframeLength, setTotalWireframeLength] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("png");
  const [isLoader, setIsLoader] = useState(true);
  const [anyChanges, setAnyChanges] = useState(false);



  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleChatSubmit = (chatInput) => {
    // Example: Update chatHistory state
    setChatHistory([...chatHistory, chatInput]);
    // Logic to update wireframe based on chat input
  };

  const onWireframeUpdate = (newWireframeData) => {
    setWireframeData(addIds(newWireframeData));
  };


  const toggleMode = () => {
    setIsManualMode(!isManualMode);
  };

  useEffect(() => {
    setProjectId(selectedProject?.id);

    setTimeout(() => {
      setIsLoader(false);
    }, 1000);
  }, [selectedProject]);

  useEffect(() => {
    if (wireframeData && wireframeData.length > 0) {
      (async () => {
        // let promises = wireframeData.map(async (element) => {
        //   return await JSONToHTML(element, true);
        // });
        // let dataToSet = await Promise.all(wireframeData);
        setJsxData(wireframeData);
      })();
    } else {
      setJsxData([]);
    }
  }, [wireframeData]);


  function addIds(data) {
    if (Array.isArray(data)) {
      return data.map(obj => addIds(obj));
    } else if (typeof data === 'object' && data !== null) {
      if (!data.attributes) {
        data.attributes = {};
      }
      data.attributes.id = generateRandomId();
      if (data.content) {
        data.content = addIds(data.content);
      }
    }
    return data;
  }

  function generateRandomId() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 10;
    let randomId = '';
    for (let i = 0; i < length; i++) {
      randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomId;
  }
  const convertAIMode = () => {
    if (isManualMode && !showDefaultText) {
      setCheckedManualChanges(true)
    } else {
      setIsManualMode(false)
      setSelectedId('')
      setAnyChanges(false)
    }
  }

  const downloadImageAsPerFormat = async() => {
    const iframe = document.getElementById('your-iframe-id');
    console.log(" iframeeeeeeeee ", iframe)
    if (iframe) {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      const node = iframeDocument.getElementById("element-to-export");

      // const node = document.getElementById("element-to-export");

      const exportImage = (dataUrl, extension) => {
        saveAs(dataUrl, `exported-element.${extension}`);
      };

      if (selectedOption === "svg") {

        const response1 = await WireFramesApi.html_to_image({"html_content":node.outerHTML,'type':'svg'})
        console.log("html>>>>>>>>>>>>  response1",response1)
        
        const blob = new Blob([response1], { type: 'image/svg+xml' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      if (selectedOption === "jpg") {
        console.log("html>>>>>>>>>>>> node",node.outerHTML)
        const response1 = await WireFramesApi.html_to_image({"html_content":node.outerHTML,'type':'jpg'})
        const binaryString = atob(response1); // Decode Base64 string to binary
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; ++i) {
            bytes[i] = binaryString.charCodeAt(i);
        }
    
        const blob = new Blob([bytes], { type: 'image/jpg' });
    
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
      if (selectedOption === "png") {
        console.log("html>>>>>>>>>>>> node",node.outerHTML)
        const response1 = await WireFramesApi.html_to_image({"html_content":node.outerHTML,'type':'png'})
        const binaryString = atob(response1); // Decode Base64 string to binary
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; ++i) {
            bytes[i] = binaryString.charCodeAt(i);
        }
    
        const blob = new Blob([bytes], { type: 'image/png' });
    
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    }
  };


  const downloadImageAsPerFormatManual = () => {
    const iframeContainer = document.getElementById("gjs");
    if (iframeContainer) {
        const iframe = iframeContainer.getElementsByTagName("iframe")[0];
        if (iframe) {
            const iframeContentDocument = iframe.contentDocument || iframe.contentWindow.document;
            const node = iframeContentDocument.getElementsByTagName("body")[0];

            const exportImage = (dataUrl, extension) => {
                saveAs(dataUrl, `exported-element.${extension}`);
            };

            if (selectedOption === "png") {
              htmlToImage.toPng(node)
              .then((dataUrl) => {
                exportImage(dataUrl, "png");
              })
              .catch((error) => {
                console.error('Error converting HTML to PNG:', error);
              });
            } else if (selectedOption === "jpg") {
                htmlToImage.toJpeg(node)
                .then((dataUrl) => {
                  exportImage(dataUrl, "jpg");
                })
                .catch((error) => {
                  console.error('Error converting HTML to JPG:', error);
                });
            } else if (selectedOption === "svg") {
                htmlToImage.toSvg(node)
                .then((dataUrl) => {
                  exportImage(dataUrl, "svg");
                })
                .catch((error) => {
                  console.error('Error converting HTML to SVG:', error);
                });
            }
        }
    }
}

  return (
    <>
      {isLoader ? (
        <div className="loader-container">
          <CircularProgress />
        </div>
      ) : (
      <div className='h-100 w-100 d-flex align-items-center flex-column justify-content-center p-3' style={{overflow: "hidden" }}>
        <div className='w-100 d-flex align-items-center mb-3' style={jsxData && jsxData.length > 0 ? {justifyContent: "space-between"} : {justifyContent: "center"}}>
          <div/>
          <div className="toggle-switch">
            <button
              className={`mode-button ${!isManualMode ? 'active' : ''}`}
              onClick={convertAIMode}
            >
              AI Mode
            </button>
            <button
              className={`mode-button ${isManualMode ? 'active' : ''}`}
              onClick={() => setIsManualMode(true)}
            >
              Manual Mode
            </button>
          </div>

          {jsxData && jsxData.length > 0 && (
            <div className="download-button-container">
              <Button
                variant="outlined"
                className='text-capitalize'
                style={{
                  // color: (isManualMode && !anyChanges) ? "lightgrey" : "#F07227",
                  // border: (isManualMode && !anyChanges) ? "1px solid lightgrey" : "1px solid #F07227",
                  color: "#F07227",
                  border: "1px solid #F07227",
                  margin: "0 20px",
                }}
                onClick={() => setShowDropdown(!showDropdown)}
                // disabled={isManualMode && !anyChanges}
              >
                Export
              </Button>

              {showDropdown && (
                <>
                  <FormControl style={{ width: "120px" }}>
                    <InputLabel id="demo-simple-select-label">Format</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedOption}
                      label="Format"
                      onChange={(e) => handleOptionSelect(e.target.value)}
                    >
                      <MenuItem value="png">PNG</MenuItem>
                      <MenuItem value="jpg">JPG</MenuItem>
                      <MenuItem value="svg">SVG</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    className='text-capitalize'
                    variant="outlined"
                    style={{
                      color: "#F07227",
                      border: "1px solid #F07227",
                      margin: "0 20px",
                    }}
                    onClick={isManualMode ? downloadImageAsPerFormatManual : downloadImageAsPerFormat}
                  >
                    Download
                  </Button>
                </>
              )}
            </div>)}
        </div>

        <div className="app-container" style={{ width: "100%", height: "calc(100% - 63px)" }}>
          {isManualMode ? (
            <ManualWireframeEditor
              jsxData={jsxData}
              jsonData={addIds(wireframeData)}
              wireframeData={wireframeData}
              setWireframeData={setWireframeData}
              toggleMode={toggleMode}
              checkedManualChanges={checkedManualChanges}
              setCheckedManualChanges={setCheckedManualChanges}
              setIsManualMode={setIsManualMode}
              projectId={projectId}
              selectedId={selectedId}
              setFetchAllWireframeData={setFetchAllWireframeData}
              setTotalWireframeLength={setTotalWireframeLength}
              onWireframeUpdate={onWireframeUpdate}
              setSelectedId={setSelectedId}
              wireFrameRendererHeight={document.getElementsByClassName("wireframe-div-container")[0]?.clientWidth}
              anyChanges={anyChanges}
              setAnyChanges={setAnyChanges}
            />
          ) : (
            <>
            <div>
              <div className="multiple-screen-container">
                <MultipleWireframeScreen
                  setShow={setShow}
                  show={show}
                  setMessages={setMessages}
                  setFetchAllWireframeData={setFetchAllWireframeData}
                  fetchAllWireframeData={fetchAllWireframeData}
                  onWireframeUpdate={onWireframeUpdate}
                  setShowDefaultText={setShowDefaultText}
                  projectId={projectId}
                  messages={messages}
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                  setTotalWireframeLength={setTotalWireframeLength}
                  totalWireframeLength={totalWireframeLength}
                />
              </div>
              </div>
              <div className='chat-box-div'>
                <div className="chatbox-container">
                  <ChatBox
                    wireframeData={wireframeData}
                    chatHistory={chatHistory}
                    onChatSubmit={handleChatSubmit}
                    onWireframeUpdate={onWireframeUpdate}
                    setLoadingWireFrame={setLoadingWireFrame}
                    messages={messages}
                    setMessages={setMessages}
                    setShowDefaultText={setShowDefaultText}
                    showDefaultText={showDefaultText}
                    setSelectedId={setSelectedId}
                    selectedId={selectedId}
                    projectId={projectId}
                    setFetchAllWireframeData={setFetchAllWireframeData}
                    fetchAllWireframeData={fetchAllWireframeData}
                    setTotalWireframeLength={setTotalWireframeLength}
                  />
                </div>
                <div className="wireframe-container">

                  <WireframeRenderer
                    jsxData={jsxData}
                    loadingWireFrame={loadingWireFrame}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      )}
    </>
  );
}

export default App;