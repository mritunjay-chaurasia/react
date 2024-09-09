import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./LandingPage.css";
import { Card, Container, Row, Col } from "react-bootstrap";
import Logo from "../../assets/images/astorai-logo.png";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { USER_TOKEN } from "../../constants";

function LandingPage() {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [input, setInput] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const message = [
    "Login screen with sign/signup forget password option",
    "Payment capturing screen",
    "Sales Dashboard",
    "Landing page of a SAAS company",
  ];

  useEffect(() => {
    const user = localStorage.getItem(USER_TOKEN);
    if (user) {
      setIsLoggedIn(true);
    }
  }, [localStorage.getItem(USER_TOKEN)]);

  useEffect(()=>{
    if(input && input.length > 5){
      setIsDisabled(false)
    }else{
      setIsDisabled(true)
    }
  },[input])

  // const handleEnter = (e) => {
  //   if (e.keyCode === 13 && e.shiftKey === false) {
  //     e.preventDefault();
  //     if(input && input.length > 5){
  //       if(isLoggedIn) navigate('/wireFrames', { state: { data: input }})
  //       else navigate('/login', { state: { data: input }});
  //     };
  //   };
  // };
  const handleEnter = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      if(input && input.length > 5){
        if(isLoggedIn) navigate(`/wireFrames?q=${input}`)
        else navigate(`/login?q=${input}`);
      };
    };
  };

  const handleGenerateBtn = (input) => {
     if(isLoggedIn) navigate(`/wireFrames?q=${input}`)
     else navigate(`/login?q=${input}`);
  }


  return (
    <>
      <Container fluid className="main-container">
        <Row className="d-flex flex-row align-items-center justify-content-between first-section">
          <Col sm={6} md={6} lg={6}>
            <Row className="inside-header-div">
              <img className="logo" alt="logo" src={Logo} />
            </Row>
          </Col>
          <Col sm={6} md={6} lg={6} className="d-flex flex-row-reverse gap-3">
            {!isLoggedIn ? (
                           <>
                           <Link to="/login">
                             <button className="btn-style">Login</button>
                           </Link>
                           <Link to="/register">
                             <button className="btn-style">Sign up</button>
                           </Link>
                         </>
            ) : (
              <></>

            )}
          </Col>
        </Row>
        <Row className="d-flex flex-column align-items-center flex-wrap justify-content-center second-section">
          <Row className="d-inline flex-column text-center third-section">
            <span>Design made simple</span>
          </Row>
          <Row className="inside-second-section">
            <span style={{ color: "black" }}>Type Your Vision,</span>
            <span className="second-section-label">
              Let AI Craft The Wireframe
            </span>
            {/* <span className="second-section-label2">The Wireframe</span> */}
          </Row>
          <Row className="third-section mb-5">
            <span>Easy. Effortless. Effective</span>
          </Row>
          <Row className="p-0">
            <Row
              className="d-flex flex-column w-100 align-items-center text-area-field"
              style={{ padding: "0 100px" }}
            >
              <Row
                className={`d-flex w-100 align-items-center forth-section   ${
                  isClicked ? "textArea-parent-div" : ""
                }`}
                onMouseLeave={() => {
                  setIsClicked(false);
                }}
                onClick={() => {
                  setIsClicked(true);
                }}
              >
                <Col sm={10} md={10} lg={10}>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleEnter}
                    type="text"
                    className="inside-textArea"
                    placeholder="Design a profile card that displays an individual's name, username, and profile picture on the left side, with contact buttons for phone and email on the right."
                  ></textarea>
                </Col>
                <Col sm={2} md={2} lg={2}>
                     <button type="button" onClick={()=>handleGenerateBtn(input)} className={`text-button ${isDisabled ? "disabled-button" : "enabled-button"}`} disabled={isDisabled}>
                        <Row className="d-inline text-center align-items-center h-100 justify-content-center">
                          <span>Generate</span>
                        </Row>
                      </button>
                  {/* {isLoggedIn ? (
                    <Link to="/wireFrames" state={{ data: input }}>
                      <button type="button" className={`text-button ${isDisabled ? "disabled-button" : "enabled-button"}`} disabled={isDisabled}>
                        <Row className="d-inline text-center align-items-center h-100 justify-content-center">
                          <span>Generate</span>
                        </Row>
                      </button>
                    </Link>
                  ) : (
                    <Link to="/login" state={{ data: input }}>
                      <button type="button" className={`text-button ${isDisabled ? "disabled-button" : "enabled-button"}`} disabled={isDisabled}>
                        <Row className="d-inline text-center align-items-center h-100 justify-content-center">
                          <span>Generate</span>
                        </Row>
                      </button>
                    </Link>
                  )} */}
                </Col>
              </Row>
            </Row>
            <Row className="fifth-section">
              {message &&
                message.length > 0 &&
                message.map((item, index) => (
                  <Col
                    key={index}
                    sm={3}
                    md={3}
                    lg={3}
                    className="card-col h-100"
                    data-value={item}
                  >
                       <Card className="hover-bg-grey inside-card-div" onClick={()=>handleGenerateBtn(item)}>
                          <Card.Body className="d-flex justify-content-between p-1 align-items-center">
                            <Card.Text className="m-0">{item}</Card.Text>
                            <Tooltip
                              title="Click to send"
                              arrow={true}
                              placement="top"
                            >
                              <ArrowUpwardIcon
                                className="arrowUpwardIcon"
                                style={{ fontSize: "15px" }}
                              />
                            </Tooltip>
                          </Card.Body>
                        </Card>
                    {/* {isLoggedIn ? (
                      <Link to="/wireFrames" state={{ data: item }}>
                        <Card className="hover-bg-grey inside-card-div">
                          <Card.Body className="d-flex justify-content-between p-1 align-items-center">
                            <Card.Text className="m-0">{item}</Card.Text>
                            <Tooltip
                              title="Click to send"
                              arrow={true}
                              placement="top"
                            >
                              <ArrowUpwardIcon
                                className="arrowUpwardIcon"
                                style={{ fontSize: "15px" }}
                              />
                            </Tooltip>
                          </Card.Body>
                        </Card>
                      </Link>
                    ) : (
                      <Link to="/login" state={{ data: item }}>
                        <Card className="hover-bg-grey inside-card-div">
                          <Card.Body className="d-flex justify-content-between p-1 align-items-center">
                            <Card.Text className="m-0">{item}</Card.Text>
                            <Tooltip
                              title="Click to send"
                              arrow={true}
                              placement="top"
                            >
                              <ArrowUpwardIcon
                                className="arrowUpwardIcon"
                                style={{ fontSize: "15px" }}
                              />
                            </Tooltip>
                          </Card.Body>
                        </Card>
                      </Link>
                    )} */}
                  </Col>
                ))}
            </Row>
          </Row>
        </Row>
      </Container>
      <div></div>
    </>
  );
}

export default LandingPage;
