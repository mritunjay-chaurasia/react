import React, { useState, useEffect } from 'react';
import { Button as ButtonAntd } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import ForumIcon from '@mui/icons-material/Forum';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Preview from '../Preview';
import EditIcon from '@mui/icons-material/Edit';
import { BACKEND_URL } from '../../../constants';
import Tooltip from '@mui/material/Tooltip';
import { pickTextColorBasedOnBgColorSimple } from '../ChatBoxCustomization';


const PreviewButton = ({ orgThemeSetting, prechatSurveySetting, selectedFile }) => {
  const [iconChange, setIconChange] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [hover, setHover] = useState(false); // state for hover
  const [midpoint, setMidpoint] = useState(0); // state for midpoint

  const styles = {
    header: {
      color: "#000",
      backgroundColor: orgThemeSetting?.chatHeader?.bgColor ? orgThemeSetting?.chatHeader?.bgColor : "#284FA3",
      width: "380px",
      height: `${isVisible ? "636px" : 0}`,
      position: 'relative',
      bottom: -5,
      right: -40,
      borderRadius: '15px',
    },
    icon: {
      color: orgThemeSetting?.chatButton?.color ? orgThemeSetting.chatButton.color : '#000',
      fontSize: '28px',
      margin: '0px',
      padding: '5px',
      transition: "transform 1s ease",
    },
    button: {
      backgroundColor: orgThemeSetting?.chatButton?.bgColor ? orgThemeSetting.chatButton.bgColor : '#284FA3',
      border: 'none',
      width: '60px',
      height: '60px',
      zIndex: '3',
      boxShadow: "2px 2px 6px 4px rgba(0, 0, 0, 0.4)",
    }

  }


  useEffect(() => {
    const div = document.getElementById("preview-slider");

    if (isVisible) {
      // Show the div by setting its height to its scrollHeight
      div.style.height = "636px";
      div.style.width = "380px";
      div.style.boxShadow = '1px 1px 20px 1px #888888';;
    } else {
      // Hide the div by setting its height to 0
      div.style.height = "0px";
      div.style.boxShadow = 'none';
    }
  }, [isVisible]);

  useEffect(() => {
    if (hover) setMidpoint(60);
    else setMidpoint(0);
  }, [hover])

  const handleOpenChatBox = () => {
    setIsVisible(true);
    setIconChange(true);
  }
  const handleCloseChatBox = () => {
    setIsVisible(false);
    setIconChange(false);
  }

  /**
  * This function handles the close button of user review slider & sets item in localStorage after checking if Don't show again is checked or not.
  * @params : none
  * @response : Hides the modal
  * @author : Kartar & Milan
  */

  return (
    <>
      <div className='d-flex justify-content-center align-items-center'>
        <div className='d-flex justify-content-end align-items-end p-4' style={{ minHeight: "690px" }}>
          <div className={`previewSlidingDiv previewTransition`} id="preview-slider" style={styles.header}>
            <div id='head' className={`previewTransition d-flex justify-content-between align-items-center p-2`} style={{ width: "100%", height: '75px' }}>
              <h1 className='geek-logo' style={{ color: orgThemeSetting?.chatHeader?.textColor ? orgThemeSetting.chatHeader.textColor : "#fff", fontFamily: orgThemeSetting?.chatHeader?.fontStyle }} >{orgThemeSetting?.chatHeader?.text ? orgThemeSetting.chatHeader.text : "ChatToAction"}</h1>
              {orgThemeSetting?.chatHeader?.logo && <img src={`${selectedFile ? URL.createObjectURL(selectedFile) : orgThemeSetting?.chatHeader?.image ? `${BACKEND_URL}/images/${orgThemeSetting?.chatHeader?.image}` : "logo"}`} alt='orglogo' style={{ maxHeight: '60%', marginLeft: "20px" }} />}
              <div style={{ display: "flex", alignItems: 'center' }}>
                <Tooltip title="Minimize">
                  <KeyboardArrowDownIcon onClick={handleCloseChatBox} className='downarrow-to-close-chat' style={{ fontSize: 28, color: pickTextColorBasedOnBgColorSimple(orgThemeSetting?.chatHeader?.bgColor) }} />
                </Tooltip>
              </div>
            </div>
            <Preview
              orgThemeSetting={orgThemeSetting}
              prechatSurveySetting={prechatSurveySetting}
              selectedFile={selectedFile}
            />

          </div>
          <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
            <ButtonAntd
              type="primary"
              shape="circle"
              icon={
                iconChange ? (
                  <SendOutlined style={styles.icon} />
                ) : (
                  <ForumIcon style={{ ...styles.icon, fontSize: 38 }}
                    onClick={handleOpenChatBox}
                  />
                )
              }
              size="large"
              style={styles.button}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={!iconChange ? handleOpenChatBox : null}
            />
            <ButtonAntd
              type="primary"
              shape="circle"
              icon={
                iconChange ? (
                  <SendOutlined style={{ ...styles.icon, color: orgThemeSetting?.chatButton?.bgColor }} />
                ) : (
                  <EditIcon style={{ ...styles.icon, color: orgThemeSetting?.chatButton?.bgColor, fontSize: '38px' }}
                    onClick={handleOpenChatBox}
                  />
                )
              }
              size="large"
              style={{
                ...styles.button,
                position: "absolute",
                overflow: 'hidden',
                boxShadow: "none",
                width: midpoint,
                height: midpoint,
                padding: 0,
                minWidth: 0,
                backgroundColor: orgThemeSetting?.chatButton?.color
              }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={!iconChange ? handleOpenChatBox : null}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewButton