import React, { useState,useRef,useEffect } from "react";
import {
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import { useSelector } from "react-redux";
import * as UserProjectApi from '../../api/userProject.api';
const ToggleButtonModal = ({
  openModal,
  setOpenModal,
  position,
  top,
  right,
  toggle,
  setToggle
}) => {
  const { selectedProject } = useSelector((state) => state.orgDetails);
  const handleClose = () => setOpenModal(false);
  const toastRef = useRef(null);
  const handleToggle = async() =>{
    if(selectedProject && selectedProject.id){
      const data = {
        userProjectId : selectedProject.id,
        hideReleasedStatus: !toggle
      }
      await UserProjectApi.updateUserProject(data);
      setToggle(!toggle)
   
    }
  }


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toastRef.current && !toastRef.current.contains(event.target)) {
        setOpenModal(false);
      }
    };

    if (openModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModal]);

  return (
    <Row style={{ position: position, right: right, top: top }}>
      <Col className="display-list-css">
        <Toast ref={toastRef} onClose={handleClose} show={openModal} animation={false}>
          <Toast.Body>
            <Box>
              <FormControlLabel
                control={<Switch checked={toggle} onChange={handleToggle} />}
                label="Hide completed tasks"
              />
            </Box>
          </Toast.Body>
        </Toast>
      </Col>
    </Row>
  );
};

export default ToggleButtonModal;
