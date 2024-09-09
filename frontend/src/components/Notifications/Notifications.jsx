import React, { useState, useEffect,useRef } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import { useNavigate } from "react-router-dom";
import "./style.css";
import Divider from "@mui/material/Divider";
import * as UsersNotificationApi from "../../api/usersNotification.api";

function Notification({
  fetchAllNotification,
  userId,
  setDisplayList,
  displayList,
  position,
  right,
  top,
  totalUnreadMessage,
  setTotalUnreadMessage,
  setFetchAllNotification,
}) {

  const toastRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toastRef.current && !toastRef.current.contains(event.target)) {
        setDisplayList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toastRef, setDisplayList]);


  const calculateTimeDifference = (createdAt) => {
    const currentTime = new Date();
    const createdAtTime = new Date(createdAt);
    const differenceInMilliseconds = currentTime - createdAtTime;
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    if (differenceInSeconds < 60) {
      return "just now";
    }
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    if (differenceInMinutes < 60) {
      return `${differenceInMinutes} minute${
        differenceInMinutes > 1 ? "s" : ""
      } ago`;
    }
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    if (differenceInHours < 24) {
      return `${differenceInHours} hour${differenceInHours > 1 ? "s" : ""} ago`;
    }
    const differenceInDays = Math.floor(differenceInHours / 24);
    if (differenceInDays < 7) {
      return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
    }
    const differenceInWeeks = Math.floor(differenceInDays / 7);
    if (differenceInWeeks < 4) {
      return `${differenceInWeeks} week${differenceInWeeks > 1 ? "s" : ""} ago`;
    }
    const differenceInMonths = Math.floor(differenceInDays / 30);
    return `${differenceInMonths} month${
      differenceInMonths > 1 ? "s" : ""
    } ago`;
  };

  const handleClickBtn = async (message) => {
    switch (message.type) {
      case "comments":
        navigate("/updates");
        break;
      case "assignedTo":
        navigate(`/workOrder/details/${message.notifiedTo.workOrderId}`);
        break;
      default:
        navigate(`/workOrder/details/${message.notifiedTo.workOrderId}`);
        break;
    }
    setDisplayList(false);
  };
  

  return (
    <Row style={{ position: position, right: right, top: top }}>
      <Col className="display-list-css"  ref={toastRef}>
        <Toast onClose={()=>setDisplayList(false)} show={displayList} animation={false}>
          <Toast.Header style={{ background: "#284FA3" }}>
            <strong className="me-auto">Notifications</strong>
          </Toast.Header>
          {fetchAllNotification && fetchAllNotification.length > 0 ? (
            <div className="toast-body-scroll">
              {fetchAllNotification.map((message) => (
                <Toast.Body key={message.id} className="toast-body">
                    <div className="notification-div">
                      <div className="text-name">
                        {message.type === "comments" && "New update given by "}
                        {message.type === "assignedTo" && "Ticket assigned by "}
                        <span style={{ color: "black" }}>
                          {message.commentBy.firstname}
                        </span>
                        {message.type === "mention" && (
                          <span style={{ color: "black" }}>
                            {" "}
                            mentioned you in a comment.
                          </span>
                        )}
                      </div>
                      {message.type === "mention" && message?.notifiedTo?.message && message?.notifiedTo?.workOrderId &&  (
                          <div className="task-details">
                              <span>Task number : {message?.notifiedTo?.workOrderId}</span>
                              <span>Comment : {message?.notifiedTo?.message}</span>
                          </div>
                        )}
                      <small>
                        {calculateTimeDifference(message.createdAt)}
                      </small>
                    </div>
                    <div className="d-flex w-100 justify-content-end">
                      <Button
                        className="float-right text-capitalize"
                        onClick={() => handleClickBtn(message)}
                        variant="primary"
                        style={{
                          background: "rgb(240, 114, 39)",
                          color: "white",
                          border: "none",
                        }}
                      >
                        View
                      </Button>
                    </div>
                    <Divider
                      style={{ background: "black", marginTop: "5px" }}
                    />
                </Toast.Body>
              ))}
            </div>
          ) : (
            <Toast.Body>No Message</Toast.Body>
          )}
        </Toast>
      </Col>
    </Row>
  );
}

export default Notification;
