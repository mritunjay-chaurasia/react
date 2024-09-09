import React, { useState,useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ChatBox.css';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import * as WireFramesApi from '../../../api/wireFrame.api';
import { Card, Row, Col } from "react-bootstrap";
import * as WireFramesScreenApi from '../../../api/multipleWireframe.api';
import { showNotification } from "../../../utils/notification";
const ChatBox = ({wireframeData,selectedId, projectId, setFetchAllWireframeData, onWireframeUpdate, setLoadingWireFrame, setSelectedId, setMessages, messages, setShowDefaultText,showDefaultText,setTotalWireframeLength }) => {
    // const location = useLocation();
    // const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const parametersData = queryParameters.has("q") ? queryParameters.get("q") : "";
    const [input, setInput] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const [autoScroll, setAutoScroll] = useState(false);
    // const dataFromLandingPageRef = useRef(location.state?.data);
    const chatsMessageRef = useRef(null);
    const messageText = [
        "Login screen with sign/signup forget password option",
        "Payment capturing screen",
        "Sales Dashboard",
        "Landing page of a SAAS company",
      ];
    const sendMessage = async (e) => {
        e.preventDefault();
        const userMessage = selectedText ? selectedText: input.trim();
        if (!userMessage) return;
        // const apiEndpoint = isFirstQuery ? 'http://localhost:5000/wireframe-data' : 'http://localhost:5000/edit-wireframe-data';
        console.log("setting user message")
        let tempChats = [...messages]
        tempChats.push({ sender: 'user', text: userMessage, time: new Date() })
        setMessages(tempChats);
        updateWireframeData(selectedId, tempChats)

        console.log(tempChats)
        setInput('');
        setShowDefaultText(false)
        try {
            //const response = await axios.post('http://localhost:5000/message', { message: userMessage });
            // setMessages([...messages, { sender: 'bot', text: 'Wireframe updated succesfully' }]);
            let response1;
            console.log("wireframeData>>>>>>>>>>>>>>>>>>>>>>>>>>>>.",wireframeData)
            setLoadingWireFrame(true);
            console.log("setLoadingWireFrame set to true")
            if(messages && messages.length > 1) {
                response1 = await WireFramesApi.editWireframeData({ message: userMessage,elements: wireframeData})
            } else {
                response1 = await WireFramesApi.wireframeData({ message: userMessage })
            }
            
            // await axios.post(apiEndpoint, { message: userMessage }, { withCredentials: true });
            
            tempChats.push({ sender: 'bot', text: '✅ Success! Your wireframe has been generated.', time: new Date() })
            setMessages(tempChats)
            console.log('response1:', response1?.data);
            updateWireframeData(selectedId, tempChats, response1?.data)
            setSelectedText('');
  
        } catch (error) {
            console.error('Error sending message:', error);
            tempChats.push({ sender: 'bot', text: '🛑 Oops! Something went wrong. Please check the requirements you provided and try again. If the problem persists, reach out to us for support.', time: new Date() })
            setMessages(tempChats)
            updateWireframeData(selectedId, tempChats)
        }
        setLoadingWireFrame(false);
        setSelectedText('');
    };

    useEffect(()=>{
        if (chatsMessageRef.current) {
            chatsMessageRef.current.scrollTop = chatsMessageRef.current.scrollHeight;
        }
    },[input,autoScroll])

    // This useEffect runs when a message comes from the landing page.
      useEffect(() => {
        (async()=>{
            // console.log("parametersData>>>>>>>>>>>>>>>>>>>>   parametersData",parametersData)
          if(projectId && projectId !== undefined && parametersData){
            const response = await WireFramesScreenApi.getAllWireFramesData({projectId:projectId});
            // console.log("parametersData>>>>>>>>>>>>>>>>>>>>   response",response)
            let wireFrameData = response?.wireFrame
            // console.log("parametersData>>>>>>>>>>>>>>>>>>>>   wireFrameData",wireFrameData)
            setFetchAllWireframeData(wireFrameData);
            setTotalWireframeLength(response?.count);
            const filterWireframe = wireFrameData?.filter((obj)=> obj.userSessionWireFrame === null || (Array.isArray(obj.userSessionWireFrame) && obj.userSessionWireFrame.length === 0))
            if(filterWireframe && filterWireframe.length > 0){
                const ids = filterWireframe.map(obj => obj.id);
                const minId = Math.min(...ids);
                if(minId){
                  setSelectedId(minId)
                  fetchData(minId)
                }   
            }else{
                if (response.count < 10) {
                    const temp = {
                        projectId:projectId,
                        messages:messages
                    }
                    const allWireFrameData = await WireFramesScreenApi.addWireframeScreen({data:[temp],projectId:projectId});
                    let maxId = findMaxId(allWireFrameData?.allData)
                    setFetchAllWireframeData(allWireFrameData?.allData);
                    setTotalWireframeLength(allWireFrameData?.length);
                    setSelectedId(maxId)
                    fetchData(maxId)
               }else{
                   showNotification('info', 'Maximum Screen Limit Reached');
                   queryParameters.delete("q");
                   const newUrl = `${window.location.pathname}?${queryParameters.toString()}`;
                   window.history.replaceState({}, document.title, newUrl);
                if(wireFrameData && wireFrameData.length > 0){
                    const minIdObject = wireFrameData.reduce((min, obj) => obj.id < min.id ? obj : min, wireFrameData[0]);
                    if(minIdObject && minIdObject?.id){
                        setSelectedId(minIdObject?.id)
                        if(minIdObject && minIdObject.userSessionWireFrame && minIdObject.userSessionWireFrame.length > 0){
                            onWireframeUpdate(minIdObject.userSessionWireFrame)
                            setShowDefaultText(false)
                            setMessages(minIdObject.messages);
                          } 
                    }
                  }
               }
            }
          }
        })()
      }, [projectId,parametersData]);

        function findMaxId(arrayOfObjects) {
            let maxId = -Infinity; // Initialize maxId with a very small value
            for (let i = 0; i < arrayOfObjects.length; i++) {
                if (arrayOfObjects[i].id > maxId) {
                    maxId = arrayOfObjects[i].id;
                }
            }
            return maxId;
        }

      const fetchData = async (selectedID) => {
        const userMessage = parametersData;
        if (!userMessage) return;
        let tempChats = [...messages];
        tempChats.push({ sender: 'user', text: userMessage, time: new Date() });
        setMessages(tempChats);
        updateWireframeData(selectedID, tempChats)
        setInput('');
        setShowDefaultText(false);
        try {
            setLoadingWireFrame(true);
            let response1;
            if (messages && messages.length > 1) {
                response1 = await WireFramesApi.editWireframeData({ message: userMessage, elements: wireframeData });
            } else {
                response1 = await WireFramesApi.wireframeData({ message: userMessage });
            }

            tempChats.push({ sender: 'bot', text: '✅ Success! Your wireframe has been generated.', time: new Date() });
            setMessages(tempChats);
            updateWireframeData(selectedID, tempChats, response1?.data)
            setSelectedText('');
            queryParameters.delete("q");
            const newUrl = `${window.location.pathname}?${queryParameters.toString()}`;
            window.history.replaceState({}, document.title, newUrl);
            // dataFromLandingPageRef.current = null;
            // navigate(location.pathname, { state: {}, replace: true });
        } catch (error) {
            console.error('Error sending message:', error);
            tempChats.push({ sender: 'bot', text: '🛑 Oops! Something went wrong. Please check the requirements you provided and try again. If the problem persists, reach out to us for support.', time: new Date() });
            setMessages(tempChats);
            queryParameters.delete("q");
            const newUrl = `${window.location.pathname}?${queryParameters.toString()}`;
            window.history.replaceState({}, document.title, newUrl);
            // dataFromLandingPageRef.current = null;
            // navigate(location.pathname, { state: {}, replace: true });
            updateWireframeData(selectedID, tempChats)
            setSelectedText('');
        }
        setLoadingWireFrame(false);
    };

    // This function is used to update messages and wireframe data according to the selected screen.
    async function updateWireframeData(selectedId, tempChats, userSessionWireFrame) {
        if(selectedId && tempChats && userSessionWireFrame){
            const temp = {
                id:selectedId,
                projectId:projectId,
                messages:tempChats,
                userSessionWireFrame:userSessionWireFrame
              }
            const result = await WireFramesScreenApi.addWireframeScreen({data:[temp],projectId:projectId});
            if(result && result.allData &&  result.allData.length > 0){
                setFetchAllWireframeData(result.allData)
                setTotalWireframeLength(result?.length);
                const response = result.allData.filter(obj => obj.id === selectedId);
                onWireframeUpdate(response[0].userSessionWireFrame)
                setAutoScroll(true)
            }
        
        }
      }
    
    // This function resets the messages and wireframe data based on the selected screen.
    const onReset = async() => {
        if(selectedId){
            const temp = {
                id:selectedId,
                projectId:projectId,
                messages:[{
                    sender: "bot",
                    text: "Aster AI: Your wireframing powerhouse. Share your vision, let's build brilliance",
                    time: new Date()
                  }],
                userSessionWireFrame:""
              }
            const result = await WireFramesScreenApi.addWireframeScreen({data:[temp],projectId:projectId});
            if(result && result.allData &&  result.allData.length > 0){
                setShowDefaultText(true);
                setFetchAllWireframeData(result.allData)
                setTotalWireframeLength(result?.length);
                const response = result.allData.filter(obj => obj.id === selectedId);
                if(response){
                    setMessages(response[0].messages)
                    onWireframeUpdate(response[0].userSessionWireFrame)
                }
            }
        
        }
    }

    const handleClick = (e) => {
        const dataValue = e.currentTarget.dataset.value;
        if (dataValue) {
            sendMessage(e);
            setSelectedText(dataValue)
          console.log("Clicked with data:", dataValue);
        } else {
          console.error("Data attribute not found!");
        }
    };

    const convertdateFormat = (dateValue) => {
        const options = {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
        };
        const formattedDate = new Date(dateValue).toLocaleDateString(
            "en-US",
            options
        );
        let dateAndMonth = formattedDate.split(",")[1];
        dateAndMonth = dateAndMonth.trim();
        let month = dateAndMonth.split(" ")[0];
        let date = dateAndMonth.split(" ")[1];
        let year = formattedDate.split(",")[2];
        return `${date} ${month} ${year}`;
    };

    const getTime = (dateValue) => {
        const options = {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
            time: "short",
        };
        const formattedDate = new Date(dateValue).toLocaleTimeString(
            "en-US",
            options
        );
        // let dateAndMonth = formattedDate.split(",")[1];
        // dateAndMonth = dateAndMonth.trim();
        let time = formattedDate.split(",")[3];

        const [hour, mins] = time.split(":");
        const period = time.split(" ")[2];

        let hour24 = parseInt(hour);
        if (period === "PM" && hour24 !== 12) {
            hour24 += 12;
        } else if (period === "AM" && hour24 === 12) {
            hour24 = 0;
        }
        let time24 = hour24.toString().padStart(2, "0") + ":" + mins;

        return `${time24}`;
    };

    const handleEnter = (e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
          e.preventDefault();
          sendMessage(e);
        }
      };


    // Inside your ChatBox component's return statement
    return (
        <>
            {/* // <div className="chat-container">
        //     <button onClick={onReset}>Reset</button>
        //     <div id="chat-box">
        //         {messages.map((msg, index) => (
            //             <div key={index} className={`message ${msg.sender}`}>
            //                 {msg.text}
            //             </div>
            //         ))}
            //     </div>
            //     <form onSubmit={sendMessage}>
            //         <input
            //             type="text"
            //             value={input}
            //             onChange={(e) => setInput(e.target.value)}
            //             placeholder="Type your message here..."
            //         />
            //         <button type="submit">Send</button>
            //     </form>
            // </div> */}


            <div className="d-flex justify-content-center align-items-center h-100 w-100 ">
                {/* <div className="chatBoxContainer"> */}
                    <div className="chatBox">
                        <div style={{ display: "flex", flexDirection: "column", height: '60px' }}>
                            <div style={{ display: "flex", justifyContent: "flex-end", width: '100%' }}>
                                <Tooltip
                                    title="Reset Chat"
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
                                        onClick={onReset}
                                    >
                                        <ReplayIcon />
                                    </button>
                                </Tooltip>

                            </div>
                            <div style={{ width: '100%', border: '1px solid lightgrey' }}></div>
                        </div>
                        <div  ref={chatsMessageRef} className={`chatsContainer ${showDefaultText ? "default-message" : "chats-message"}`} id="rteAppChatsContainer"
                        //  style={showDefaultText ? { height: 'calc(100% - 270px)'} : { height: 'calc(100% - 124px)'}}
                         >
                            <div className="chatStripDateContainer" style={{marginBottom: "5px"}}><span>{convertdateFormat(new Date())}</span></div>
                            {messages.map((msg, index) => (
                                <div key={index} >
                                    {msg.sender === "user" && <>
                                        <div className="user-chat-strip">
                                            <div id="id-1707376031669-0.5a3c82d431128_message" className="user-chat-box" style={{ backgroundColor: 'rgb(40, 79, 163)' }}>
                                                <span id="id-1707376031669-0.5a3c82d431128" style={{ color: 'rgb(255, 255, 255)', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>{msg.text}</span><br />
                                            </div>
                                            <div className="user-chat-strip-icon" style={{ backgroundColor: 'rgb(40, 79, 163)', margin: '0px 15px' }}>
                                                <div className="MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault css-bzjj9t-MuiAvatar-root">M</div>
                                            </div>
                                        </div>
                                        <div style={{ paddingRight: '65px', display: "flex", justifyContent: "flex-end" }}>
                                            <div id="id-1707376031669-0.5a3c82d431128_detailDivDown" style={{ display: "flex", justifyContent: "space-between" }}>
                                                <span style={{ fontSize: '14px', color: 'rgb(0, 0, 0)' }}>{msg?.time ? getTime(msg.time) : ""}</span>
                                            </div>
                                        </div>
                                    </>}
                                    {msg.sender === "bot" && <>
                                        <div className="ai-chat-strip">
                                            <div id="id-1707376039378-0.b462ded3c7d1d_message" className="ai-chat-box" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
                                                <span id="id-1707376039378-0.b462ded3c7d1d" style={{ color: 'rgb(37, 63, 125)', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>{msg.text}</span><br />
                                            </div>
                                            <div className="ai-chat-strip-icon" style={{ backgroundColor: 'rgb(40, 79, 163)', margin: '0px 15px' }}>
                                                <div className="MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault css-bzjj9t-MuiAvatar-root">
                                                    <Avatar sx={{ width: 36, height: 36 }}>
                                                        <SmartToyTwoToneIcon />
                                                    </Avatar>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ paddingLeft: '65px', display: "flex", justifyContent: "flex-start" }}>
                                            <div id="id-1707376039378-0.b462ded3c7d1d_detailDivDown" style={{ width: '100px', display: "flex", justifyContent: "space-between" }}>
                                                <span style={{ fontSize: '14px', color: 'rgb(0, 0, 0)' }}>{msg?.time ? getTime(msg.time) : ""}</span>
                                            </div>
                                        </div>
                                    </>}
                                </div>
                            ))}
                        </div>
                        <Row>
                            {showDefaultText && messageText &&
                                messageText.length > 0 &&
                                messageText.map((item, index) => (
                                <Col
                                    key={index}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    className="py-1 card-col px-1"
                                    data-value={item}
                                    onClick={(e) => handleClick(e)}
                                >
                                    <Card style={{ height: "100%",fontSize:"15px" }} className="hover-bg-grey">
                                    <Card.Body className="d-flex justify-content-between px-3 py-2 align-items-center" style={{fontSize:"13px"}}>
                                        <Card.Text className="m-0">{item}</Card.Text>
                                        <Tooltip title="Click to send" arrow={true} placement="top">
                                        <ArrowUpwardIcon className="arrowUpwardIcon" style={{ fontSize: "15px", visibility: "hidden" }} />
                                        </Tooltip>
                                    </Card.Body>
                                    </Card>
                                </Col>
                                ))}
                            </Row>
                        <div className="chatFormContainer">
                            <textarea 
                               className="chatFormInput" 
                               id="chatFormInputTextArea"
                               type="text"
                                rows="1"
                                placeholder="Send a message..."
                                value={input}
                                onChange={(e) => {setInput(e.target.value);setSelectedText('');}}
                                onKeyDown={handleEnter}
                                // style={{ height: '64px' }}
                                 ></textarea>
                            <IconButton style={{ backgroundColor: 'rgb(252, 240, 233)', cursor: 'default', margin: '9px', width: '46px', height: '46px' }} onClick={sendMessage}>
                                <SendTwoToneIcon />
                            </IconButton>
                        </div>
                    </div>
                {/* </div> */}
            </div>

        </>
    );

}

export default ChatBox;
