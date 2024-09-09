import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatBox from '../../components/ChatBox/ChatBox';
import './chatDetails.css';
import { useSelector } from 'react-redux';

function ChatDetails() {
  const { state } = useLocation();
  const [userChatData] = useState(state);
  const [previewChatArr, setPreviewChatArr] = useState([]);
  const { usertype } = useSelector(state => state.user.userInfo);


  function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  }

  const convertDateTimeFormat = (dateValue) => {
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = new Date(dateValue).toLocaleDateString('en-US', options);
    let dateAndMonth = formattedDate.split(",")[1]
    dateAndMonth = dateAndMonth.trim();
    let month = dateAndMonth.split(" ")[0]
    let date = dateAndMonth.split(" ")[1]
    let year = formattedDate.split(",")[2]
    return `${date} ${month} ${year}, ${new Date(dateValue).toLocaleTimeString()}`
  }
  console.log('user chat data:::::: ', userChatData);
  useEffect(() => {
    (() => {
      let data = { ...userChatData.usertype }
      let tempChatData = [];
      for (let i = 0; i < data.user.length; i++) {
        let aiMsg = data.finalResponse[i].message
        let aiMsgTime = data.finalResponse[i].time
        let userMsg = data.user[i].message
        let userMsgTime = data.user[i].time
        console.log('Ai Msg============ ', data.finalResponse[i].message);
        tempChatData.push({ isAi: false, message: userMsg, id: generateUniqueId(), msgTime: new Date(userMsgTime) });
        //showing ai msg in chat history chat details

        if (aiMsg?.gpt_code_update_query_response && aiMsg.gpt_code_update_query_response.length > 0) {
            tempChatData.push({
              isAi: true,
              message: aiMsg,
              id: generateUniqueId(),
              msgTime: new Date(aiMsgTime),
            });
        }
        if (Array.isArray(aiMsg?.gpt_question_query_response)) {
          aiMsg.gpt_question_query_response.forEach(elem => {
            tempChatData.push({
              isAi: true,
              message: { ...aiMsg, gpt_question_query_response: elem },
              id: generateUniqueId(),
              msgTime: new Date(aiMsgTime),
            });
          })
        } else {
          tempChatData.push({
            isAi: true,
            message: { ...aiMsg, gpt_question_query_response: aiMsg.gpt_question_query_response },
            id: generateUniqueId(),
            msgTime: new Date(aiMsgTime),
          });
        }
      }
      setPreviewChatArr(tempChatData);
    })()
  }, [userChatData.usertype])

  return (
    <div className='chatDetailsPage'>
      <div className='chatDetailsContainer'>
        <div className='chatDetailsHeader'>
          <div className='chatDetailHead'>
            <span>Session ID</span>
            <span>{userChatData.sessionId}</span>
          </div>
          <div className='chatDetailHead'>
            <span>Date and time</span>
            <span>{convertDateTimeFormat(userChatData.createdAt)}</span>
          </div>
          <div className='chatDetailHead'>
            <span>{usertype === "superadmin" ? "User Name" : "Visitor name"}</span>
            <span>{usertype === "superadmin" ? userChatData.ownerdetails.name : userChatData?.userDetails?.name ? userChatData.userDetails.name : '---'}</span>
          </div>
          <div className='chatDetailHead'>
            <span>{usertype === "superadmin" ? "User email" : "Visitor email"}</span>
            <span>{usertype === "superadmin" ? userChatData.ownerdetails.emailid : userChatData?.userDetails?.email ? userChatData.userDetails.email : '---'}</span>
          </div>
          {/* <div className='chatDetailHead'>
            <span>{usertype === "superadmin" ? "User Phone No" : "Visitor Phone No"}</span>
            <span>{usertype === "superadmin" ? userChatData.ownerdetails.phoneno : userChatData?.userDetails?.phone ? userChatData.userDetails.phone : '---'}</span>
          </div> */}
        </div>
        <div className='chatDetailsBody'>
          {console.log("PreviewChatArr in Chatdetails:::", previewChatArr)}
          <ChatBox componentFrom={"chatDetails"} previewChatArr={previewChatArr} viewingSessionId={userChatData.sessionId} />
        </div>
      </div>
    </div>
  )
}

export default ChatDetails