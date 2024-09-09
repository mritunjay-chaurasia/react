import React, { useState, useEffect,useRef } from "react";
import { useLocation } from 'react-router-dom';
import "./MultipleWireframeScreen.css";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import { Container, Row, Col, Button, Card, Modal } from "react-bootstrap";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import * as WireFramesApi from '../../../api/multipleWireframe.api';
import { showNotification } from "../../../utils/notification";
const MultipleWireframeScreen = ({
  show,
  setShow,
  setMessages,
  setFetchAllWireframeData,
  fetchAllWireframeData,
  onWireframeUpdate,
  setShowDefaultText,
  messages,
  projectId,
  setSelectedId,
  selectedId,
  setTotalWireframeLength,
  totalWireframeLength,
}) => {
  const location = useLocation();
  // const dataFromLandingPageRef = useRef(location.state?.data);
  const queryParameters = new URLSearchParams(window.location.search)
  const parametersData = queryParameters.has("q") ? queryParameters.get("q") : "";
    useEffect(() => {
      (async()=>{
        if(projectId && projectId !== undefined && !parametersData){
          const response = await WireFramesApi.getAllWireFramesData({projectId:projectId});
          if(response?.wireframeDataExists === false){
            const temp = {
              projectId:projectId,
              messages:messages
            }
            const result = await WireFramesApi.addWireframeScreen({data:[temp],projectId:projectId});
            setFetchAllWireframeData(result?.allData);
            setTotalWireframeLength(result?.length);
            setSelectedId(result?.allData[0]?.id)
          }else{
            setFetchAllWireframeData(response?.wireFrame)
            setTotalWireframeLength(response?.count);
          }
          let wireFrameData = response?.wireFrame
          setTotalWireframeLength(response?.count);
          if(wireFrameData && wireFrameData.length > 0 && !selectedId){
            const minIdObject = wireFrameData.reduce((min, obj) => obj.id < min.id ? obj : min, wireFrameData[0]);
            console.log("Object with minimum id:", minIdObject);
            if(minIdObject){
              setSelectedId(minIdObject.id)
              if(minIdObject && minIdObject.userSessionWireFrame && minIdObject.userSessionWireFrame.length > 0){
                onWireframeUpdate(minIdObject.userSessionWireFrame)
                setShowDefaultText(false)
                setMessages(minIdObject.messages);
              } 
            }
          }
        }
      })()
    }, [projectId]);

  // This function is utilized to remove all screen.
  const onResetAll = async() =>{
    setShow(false)
    const result = await WireFramesApi.removeAllWireframe({projectId:projectId});
    if(result && result.success){
      onWireframeUpdate({})
      const temp = {
        projectId:projectId,
        messages:[{
          sender: "bot",
          text: "Aster AI: Your wireframing powerhouse. Share your vision, let's build brilliance",
          time: new Date()
        }]
      }
      const result = await WireFramesApi.addWireframeScreen({data:[temp],projectId:projectId});
      if(result){
        setShowDefaultText(true)
        setMessages(result?.allData[0]?.messages)
        setFetchAllWireframeData(result?.allData);
        setTotalWireframeLength(result?.length);
        setSelectedId(result?.allData[0]?.id)
        setTotalWireframeLength("")
      }
    }
  }

// This function facilitates the addition of new screens, with a maximum limit of 10 screens.
  const createScreenBtn = async() => {
    if (totalWireframeLength < 10) {
      const temp = {
        projectId:projectId,
        messages:[{
          sender: "bot",
          text: "Aster AI: Your wireframing powerhouse. Share your vision, let's build brilliance",
          time: new Date()
        }]
      }
      const result = await WireFramesApi.addWireframeScreen({data:[temp],projectId:projectId});
      setFetchAllWireframeData(result?.allData)
      setTotalWireframeLength(result?.length);
    }else{
      showNotification('info', 'Maximum Screen Limit Reached');
    }
  };
  // This function is employed to remove a screen based on the user's selection.
  const removeWireFrameBtn = async(item) => {
    const remainingWireframeData  = await WireFramesApi.removeWireframeById({
      id:item?.id,
      projectId:item?.project
    })
    if(remainingWireframeData && remainingWireframeData.remainingData.length > 0){
      const minIdObject = remainingWireframeData.remainingData.reduce((min, obj) => obj.id < min.id ? obj : min, remainingWireframeData.remainingData[0]);
      if(minIdObject){
        setShowDefaultText(true)
        setSelectedId(minIdObject.id)
        if(minIdObject && minIdObject.userSessionWireFrame && minIdObject.userSessionWireFrame.length > 0){
          onWireframeUpdate(minIdObject.userSessionWireFrame)
          setShowDefaultText(false)
        } 
      }
    }
    setFetchAllWireframeData(remainingWireframeData.remainingData)
    setTotalWireframeLength(remainingWireframeData.remainingData?.length);
  };

// This function enables the selection of a screen based on the user's choice.
  const handleSelectedWireframe = (item) => {
    setShowDefaultText(true)
    setMessages(item.messages);
    setSelectedId(item.id)
    const wireFrameData = item?.userSessionWireFrame
    if(wireFrameData && wireFrameData.length > 0){
      onWireframeUpdate(wireFrameData)
      setShowDefaultText(false)
    }else{
      onWireframeUpdate({})
    } 
  };
  

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete all screens?</Modal.Body>
        <Modal.Footer>
          <Button className="text-capitalize" variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button className="text-capitalize" variant="primary" onClick={onResetAll}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Container className="multipleWireframeScreen">
        <div className="d-flex justify-content-between w-100 flex-row">
          <Tooltip
            title="Create Screen"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "common.white",
                  "& .MuiTooltip-arrow": {
                    color: "common.white",
                  },
                  color: "black",
                  boxShadow: "0 2px 8px #909090",
                },
              },
            }}
          >
            <button
              className="reloadButton"
              style={{ color: "#F07227" }}
              disabled={false}
              onClick={createScreenBtn}
            >
              <AddToQueueIcon />
            </button>
          </Tooltip>
          <Tooltip
            title="Delete All Screens"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "common.white",
                  "& .MuiTooltip-arrow": {
                    color: "common.white",
                  },
                  color: "black",
                  boxShadow: "0 2px 8px #909090",
                },
              },
            }}
          >
            <button
              className="reloadButton"
              style={{ color: "#F07227" }}
              disabled={false}
              onClick={() => setShow(true)}
            >
              <ReplayIcon />
            </button>
          </Tooltip>
        </div>
        <div style={{ width: "100%", border: "1px solid lightgrey" }}></div>
        <div className="d-flex flex-column h-100 mt-2">
          {fetchAllWireframeData &&
            fetchAllWireframeData.length > 0 &&
            [...fetchAllWireframeData]
              .sort((a, b) => a.id - b.id) // Sort based on the `id`
              .map((item, index) => (
                <div className="d-flex flex-row flex-row-relative" key={index}>
                  <Card
                    className={`my-1 card-custom ${item.id === selectedId ? 'card-selected' : ''}`}
                    onClick={() => handleSelectedWireframe(item)}
                  >
                    <Card.Body className="card-body-custom">
                      <span>{index+1}</span>
                      {
                        fetchAllWireframeData.length > 1 &&
                        <span onClick={(e) => { e.stopPropagation(); removeWireFrameBtn(item); }} className="icon-top-right">
                          <DeleteOutlineIcon fontSize="small"className="delete-icons"  />
                        </span>
                      }
                    </Card.Body>
                  </Card>
                </div>
              ))}
        </div>
      </Container>
    </>
  );
};
export default MultipleWireframeScreen;
