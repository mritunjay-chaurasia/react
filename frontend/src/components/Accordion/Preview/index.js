import React, { useState } from "react";
import ChatSurvey from "../ChatSurvey";
import { pickTextColorBasedOnBgColorSimple } from "../ChatBoxCustomization";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot } from '@fortawesome/free-solid-svg-icons';

import "./index.css";

const ChatStrip = ({ isAi, text, id, orgThemeSetting, msgTime, selectedFile }) => {
  let time = msgTime.toTimeString().split('GMT')[0];
  time = time.split(":")[0] + ":" + time.split(":")[1]
  return (
    <>
      <div className={`mt-2 d-flex justify-content-${isAi ? 'start' : 'end'}`} style={{ paddingLeft: isAi ? '50px' : '', paddingRight: isAi ? '' : '20px' }}>
        <span style={{ fontSize: 14, color: pickTextColorBasedOnBgColorSimple(orgThemeSetting?.chatBackground?.bgColor) }}>{time}</span>
      </div>
      <div className={`${isAi ? 'previewAiChatStrip' : 'previewUserChatStrip'}`}>
        <div className={`${isAi ? 'previewAiChatBox' : 'previewUserChatBox'}`} style={{ backgroundColor: isAi ? orgThemeSetting?.aiChatStrip?.bgColor : orgThemeSetting?.myChatStrip?.bgColor }}>
          <span id={id} style={{ color: pickTextColorBasedOnBgColorSimple(isAi ? orgThemeSetting?.aiChatStrip?.bgColor : orgThemeSetting?.myChatStrip?.bgColor) }}>
            {text}
          </span>
        </div>
        {isAi &&
          (<div className="previewChatStripIcon" style={{ backgroundColor: orgThemeSetting?.aiChatStrip?.iconBg ? orgThemeSetting.aiChatStrip.iconBg : "" }}>
            <FontAwesomeIcon icon={faRobot} style={{ maxWidth: '100%', maxHeight: '100%', color: pickTextColorBasedOnBgColorSimple(orgThemeSetting?.aiChatStrip?.iconBg) }} />
          </div>)
        }
      </div>
    </>
  );
};

const Preview = ({ prechatSurveySetting, orgThemeSetting, selectedFile, handleSendMessage }) => {
  const [previewChatArray, setPreviewChatArray] = useState([{ isAi: false, id: '1', message: 'hi', msgTime: new Date() }, { isAi: true, id: 2, message: "Hii there !! I'm Bot. & It's a preview.", msgTime: new Date() }]);
  const [textAreaMessage, setTextAreaMessage] = useState("");

  function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  }

  const handleEnter = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (textAreaMessage === "" || textAreaMessage.trim() === "") return;

    let tempChatArray = [...previewChatArray];
    const uniqueId = generateUniqueId();
    tempChatArray.push({ isAi: false, message: textAreaMessage, id: uniqueId, msgTime: new Date() });
    const aiUniqueId = generateUniqueId();
    tempChatArray.push({
      isAi: true,
      message: "Hii there !! I'm Bot. & It's a preview.",
      id: aiUniqueId,
      msgTime: new Date()
    });
    setPreviewChatArray(tempChatArray);
    setTextAreaMessage("");
  };

  return (
    <>
      {prechatSurveySetting.display && (
        <ChatSurvey prechatSurveySetting={prechatSurveySetting} />
      )}

      <div id="previewBoxContainer">
        <div
          id="previewChatContainer"
          style={{ backgroundColor: orgThemeSetting?.chatBackground?.bgColor }}
        >
          <div style={{ textAlign: 'center', color: pickTextColorBasedOnBgColorSimple(orgThemeSetting?.chatBackground?.bgColor), marginTop: '5px' }}>
            <span style={{ padding: '3px', fontSize: '13px', border: `1px solid ${pickTextColorBasedOnBgColorSimple(orgThemeSetting?.chatBackground?.bgColor)}55`, borderRadius: '3px' }} >Today</span>
          </div>
          {previewChatArray && previewChatArray.length > 0 && previewChatArray.map((item) => (
            <ChatStrip
              key={item.id}
              isAi={item.isAi}
              text={item.message}
              id={item.id}
              msgTime={item.msgTime}
              orgThemeSetting={orgThemeSetting}
              selectedFile={selectedFile}
            />
          ))}
        </div>

        <form
          className="previewChatBoxForm"
          onSubmit={handleSubmit}
          style={{ backgroundColor: orgThemeSetting?.chatBackground?.bgColor }}
        >
          <textarea
            name="prompt"
            id="preview-prompt"
            rows="1"
            cols="1"
            placeholder={orgThemeSetting?.form?.text ? orgThemeSetting.form.text : "Type Your Message..."}
            onKeyDown={handleEnter}
            style={{
              backgroundColor: orgThemeSetting?.chatBackground?.bgColor,
              color: pickTextColorBasedOnBgColorSimple(orgThemeSetting?.chatBackground?.bgColor),
              resize: "none",
              marginBottom: '20px',
              borderTop: "1px solid lightgrey",
            }}
            value={textAreaMessage}
            onChange={(e) => setTextAreaMessage(e.target.value)}
          ></textarea>
        </form>
      </div>
    </>

  );
};

export default Preview;
