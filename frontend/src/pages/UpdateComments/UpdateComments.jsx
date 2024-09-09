import Button from "@mui/material/Button";
import React, { useEffect, useState,useRef} from "react";
import { useLocation } from 'react-router-dom';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import * as UpdateCommentsApi from "../../api/updateComments.api";
import * as UsersNotificationApi from "../../api/usersNotification.api";
import "./style.css";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { Avatar } from "@mui/material";
import { showNotification } from "../../utils/notification";
import Box from "@mui/material/Box";
import AttachedFile from "../UpdateChats/AttachedFile";
import SelectedFilesName from "../UpdateChats/SelectedFilesName";
import { socket } from "../../socket";
import DisplaySlectedFile from "./DisplaySlectedFile";
import ReactQuillMention from '../../components/ReactQuillMention/ReactQuillMention'
import * as WorkOrderListApi from "../../api/worklist.api";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

function formatDate(dateString) {
  const date = new Date(dateString);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const formattedTime = `${hours}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  return `${monthNames[monthIndex]} ${day}, ${year} at ${formattedTime}`;
}

function UpdateComments() {
  const { selectedProject, selectedOrganization } = useSelector(
    (state) => state.orgDetails
  );
  const location = useLocation();
  const messagesBodyRef = useRef(null);
  const { userInfo } = useSelector((state) => state.user);
  const [requirementData, setRequirementData] = useState();
  const [value, setValue] = useState(0);
  const [isLoader, setIsLoader] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState();
  const [isDisable, setIsDisable] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [allOrgUsersId, setAllOrgUsersId] = useState([]);
  const [allOrgUsersName, setAllOrgUsersName] = useState([]);
  const [isSubmitText, setIsSubmitText] = useState(false);
  useEffect(() => {
    if (selectedProject?.id) {
      (async () => {
        try {
          const response = await UpdateCommentsApi.getUpdatedComments({
            projectId: selectedProject?.id,
          });

          if (response && response.status && response.comments) {
            setRequirementData(response);
            // Ensure the DOM is updated before scrolling
            setTimeout(() => {
              if (messagesBodyRef.current) {
                messagesBodyRef.current.scrollTop = messagesBodyRef.current.scrollHeight;
              }
            }, 0);
          }
        } catch (error) {
          showNotification("error", "Comments Not Found!");
        }
      })();
    }
  }, [selectedProject]);


  useEffect(() => {
    if (selectedOrganization?.id) {
        (async () => {
            const response = await WorkOrderListApi.getAllOrgUsers(selectedOrganization?.id)
            if (response && response.status && response.allOrgUser) {
                const formattedUsers = response.allOrgUser && response.allOrgUser.length > 0 && response.allOrgUser.map(user => (user.id));
                  const filteredUsers = formattedUsers.filter(id => id !== userInfo.id);
                  const orgUserDetails = response.allOrgUser.length > 0 && response.allOrgUser.filter(user => user.id !== userInfo.id);
                  const orgUser = orgUserDetails.map(user => ({
                    id: user.id,
                    value: `${user.firstname} ${user.lastname}`
                  }));
                  setAllOrgUsersName(orgUser)
                  setAllOrgUsersId(filteredUsers);
                  setIsLoader(false);
            }
        })();
    }
}, [selectedOrganization]);



  useEffect(()=>{
    (async()=>{
      if(selectedProject && selectedProject?.id){
        socket.on("all-users-notified", async (data) => {
          // Check if the project ID matches and the user is in the notified list
          if (data.projectId == selectedProject?.id && data.notifiedTo.id.includes(userInfo.id)) {
            const response = await UpdateCommentsApi.getUpdatedComments({
              projectId: selectedProject?.id,
            });

            if (response && response.status && response.comments) {
              if (messagesBodyRef.current) {
                setRequirementData(response);
                messagesBodyRef.current.scrollTop = messagesBodyRef.current.scrollHeight;
              } else {
                console.error("messagesBodyRef.current is null or undefined");
              }
            }
          }
        });
        return () => {
          socket.off("all-users-notified");
        };
      }
    })()
  },[selectedProject,socket])

const handleChange = (content) => {
  if(content){
    setCommentText(content);
    setIsSubmitText(false)
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const mentions = doc.querySelectorAll('.mention');
    const ids = Array.from(mentions).map(mention => mention.getAttribute('data-id'));
    setMentionedUsers(ids);
  }
};

  const addComment = async () => {
    const isEmpty = commentText.trim() === '' || commentText === '<p><br></p>' || commentText === '<h1><br></h1>' || commentText === '<h2><br></h2>';
    if (isEmpty &&  !(selectedFiles && selectedFiles.key === "files" && selectedFiles.value.length > 0)) {
      return; 
    }
    setIsDisable(true)
    let data = {
      projectId: selectedProject?.id,
      text: commentText,
    };

    let formdata = new FormData();
    if (
      selectedFiles &&
      selectedFiles.key === "files" &&
      selectedFiles.value.length > 0
    ) {
      for (const file of Object.values(selectedFiles.value)) {
        formdata.append("files", file);
      }
    }
    formdata.append("data", JSON.stringify(data));

    let message = '';

    if (commentText && !isEmpty) {
      message = commentText.replace(/<[^>]*>/g, '');
    }

    if (selectedFiles && selectedFiles.key === "files" && selectedFiles.value.length > 0) {
      if (message !== '') {
        message += ' and added new attachment(s)';
      } else {
        message = 'Added new attachment(s)';
      }
    }
    const response = await UpdateCommentsApi.addComment(formdata);



    const usersData = {
      projectId: selectedProject?.id,
      notifiedUserId:allOrgUsersId,
      message:message,
      type:"comments",
  };

    const res = await UsersNotificationApi.addUsersNotification(usersData);
    
    if(res && res.status){
      socket.emit('notified-all-users', res.userNotification);
    }
    

    if (response && response.status) {
      setCommentText("");
      setIsDisable(false);
      setSelectedFiles(null);
      setIsSubmitText(true)
      const newComment = {
        ...response.comment,
        commentBy: {
          firstname: userInfo?.firstname,
          lastname: userInfo?.lastname,
        },
      };

      setRequirementData((prev) => {
        const updatedPrev = prev || {};
        const updatedComments = updatedPrev.comments || [];

        return {
          ...updatedPrev,
          comments: [...updatedComments, newComment],
        };
      });
      if (messagesBodyRef.current) {
        messagesBodyRef.current.scrollTop = messagesBodyRef.current.scrollHeight;
      } else {
          console.error("messagesBodyRef.current is null or undefined");
      }
    
    }
  };

  const selectedMedia = async ({ key, value }) => {
    if (key === "files") {
      const selectedKeyValue = { key, value };
      setSelectedFiles(selectedKeyValue);
    }
  };

  return (
    <>
      <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
        <div className="main-task-page-container">
          <div className="main-task-page">
            <div className="main-task-container">
              <div className="main-task-details-container">
                  {isLoader ? (
                            <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <CircularProgress />
                          </Box>
                        ) : (
                  <div className="main-task-details-sub-container">
                      <Box role="tabpanel" hidden={value !== 0}>
                            <div className="display-all-comments"  ref={messagesBodyRef}>
                                <>
                                  {(requirementData?.comments || []).map(
                                    (commentItem) => (
                                      <div
                                        style={{
                                          backgroundColor: "rgb(255, 255, 255)",
                                          color: "rgb(23, 43, 77)",
                                          fontFamily:
                                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                                          fontSize: "14px",
                                          fontWeight: "400",
                                          lineHeight: "20px",
                                          marginBottom: "0px",
                                          marginLeft: "0px",
                                          marginRight: "0px",
                                          marginTop: "var(--ds-space-100,8px)",
                                          padding: "0px",
                                          textAlign: "start",
                                        }}
                                      >
                                        <div data-testid="comment-base-item-14752">
                                          <div
                                            style={{
                                              display: "flex",
                                              gap: "15px",
                                            }}
                                          >
                                            <div>
                                              <Avatar
                                                style={{
                                                  width: "32px",
                                                  height: "32px",
                                                  fontSize: "14px",
                                                }}
                                                {...stringAvatar(
                                                  `${commentItem?.commentBy.firstname} ${commentItem?.commentBy.lastname}`
                                                )}
                                              />
                                            </div>
                                            <div
                                              style={{
                                                gridArea: "comment-area",
                                                margin: "0px",
                                                minWidth: "0px",
                                                overflowWrap: "break-word",
                                                paddingBottom: "0px",
                                                paddingLeft: "0px",
                                                paddingRight: "0px",
                                                paddingTop:
                                                  "var(--ds-space-025, 2px)",
                                              }}
                                            >
                                              <div
                                                style={{
                                                  boxSizing: "border-box",
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  gap: "var(--ds-space-050, 4px)",
                                                  justifyContent: "stretch",
                                                  margin: "0px",
                                                  padding: "0px",
                                                }}
                                              >
                                                <div
                                                  data-testid="issue-comment-base.ui.comment.ak-comment.14752-header"
                                                  style={{
                                                    WebkitBoxAlign: "center",
                                                    alignItems: "center",
                                                    boxSizing: "border-box",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: "var(--ds-space-100, 8px)",
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      margin: "0px",
                                                      padding: "0px",
                                                    }}
                                                  >
                                                    <span
                                                      aria-expanded="false"
                                                      aria-haspopup="true"
                                                      aria-label="More information about Mandeep Singh"
                                                      role="button"
                                                      tabIndex="0"
                                                    >
                                                      <div
                                                        data-testid="profilecard-next.ui.profilecard.profilecard-trigger"
                                                        style={{
                                                          margin: "0px",
                                                          padding: "0px",
                                                        }}
                                                      >
                                                        <span
                                                          role="presentation"
                                                          style={{
                                                            color: "black",
                                                            fontWeight: "500",
                                                            fontSize: "14px",
                                                          }}
                                                        >
                                                          {`${commentItem?.commentBy.firstname} ${commentItem?.commentBy.lastname}`}
                                                        </span>
                                                      </div>
                                                    </span>
                                                  </div>
                                                  <span
                                                    role="presentation"
                                                    style={{
                                                      color: "#42526E",
                                                      fontSize: "14px",
                                                    }}
                                                  >
                                                    {formatDate(
                                                      commentItem.updatedAt
                                                    )}
                                                  </span>
                                                </div>
                                                <div
                                                  color="color.text"
                                                  data-testid="issue-comment-base.ui.comment.ak-comment.14752-content"
                                                  style={{
                                                    boxSizing: "border-box",
                                                    margin: "0px",
                                                    padding: "0px",
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      color:
                                                        "var(--ds-text, #172B4D)",
                                                      fontSize: "14px",
                                                      lineHeight: "24px",
                                                      margin: "0px",
                                                      overflowWrap: "break-word",
                                                      padding: "0px",
                                                      whiteSpace: "pre-wrap",
                                                    }}
                                                  >
                                                    <ReactQuill
                                                    
                                                      style={{ border: "unset" }}
                                                      className="ReactQuill"
                                                      theme="snow"
                                                      value={commentItem.text}
                                                      readOnly={true}
                                                      modules={{
                                                        toolbar: [],
                                                      }}
                                                    />
                                                    <DisplaySlectedFile
                                                      commentItem={commentItem.image}
                                                      width={"230px"}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </>
                            </div>
                            <div
                              style={{
                                "--_13x3tqy": "var(--c-, )",
                                "--_17l2vjj": "0",
                                "--_1lo5oba": "var(--ds-surface, white)",
                                "--_fvojpe": "translate(0, 0)",
                                background: "var(--_1lo5oba)",
                                bottom: "var(--ds-space-negative-025,-2px)",
                                marginBottom: "0px",
                                marginLeft: "var(--ds-space-negative-100,-8px)",
                                marginRight: "0px",
                                marginTop: "0px",
                                paddingBottom: "0px",
                                paddingLeft: "var(--ds-space-100,8px)",
                                paddingRight: "0px",
                                paddingTop: "0px",
                                position: "sticky",
                                top: "var(--_13x3tqy)",
                                transform: "var(--_fvojpe)",
                                transition:
                                  "transform 0.3s cubic-bezier(0.86, 0, 0.07, 1) 0.1s",
                                zIndex: "var(--_17l2vjj)",
                              }}
                            >
                              <div
                                style={{
                                  "--_1pv0o8f":
                                    "0 -2px 0 0 var(--ds-border, #EBECF0)",
                                  background: "var(--ds-surface,#fff)",
                                  display: "flex",
                                  marginBottom: "0px",
                                  marginLeft: "0px",
                                  marginRight: "0px",
                                  marginTop: "var(--ds-space-100,8px)",
                                  paddingBottom: "var(--ds-space-200,1pc)",
                                  paddingLeft: "0px",
                                  paddingRight: "0px",
                                  paddingTop: "var(--ds-space-200,1pc)",
                                }}
                              >
                                <div
                                  style={{
                                    marginBottom: "0px",
                                    marginLeft: "0px",
                                    marginRight: "var(--ds-space-150,9pt)",
                                    marginTop: "var(--ds-space-025,2px)",
                                    padding: "0px",
                                  }}
                                >
                                  <div
                                    aria-labelledby="18val-avatar-label"
                                    role="img"
                                    style={{
                                      display: "inline-block",
                                      margin: "0px",
                                      outline: "0px",
                                      padding: "0px",
                                      position: "relative",
                                    }}
                                  >
                                    <span
                                      style={{
                                        WebkitBoxAlign: "stretch",
                                        WebkitBoxPack: "center",
                                        alignItems: "stretch",
                                        backgroundColor:
                                          "var(--ds-surface-overlay, #FFFFFF)",
                                        borderRadius: "50%",
                                        boxShadow:
                                          "0 0 0 2px var(--ds-surface-overlay, #FFFFFF)",
                                        boxSizing: "content-box",
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "32px",
                                        justifyContent: "center",
                                        margin: "var(--ds-space-025, 2px)",
                                        overflow: "hidden",
                                        padding: "var(--ds-space-0, 0px)",
                                        position: "static",
                                        transform: "translateZ(0px)",
                                        transition:
                                          "transform 200ms ease 0s, opacity 200ms ease 0s",
                                        width: "32px",
                                      }}
                                    >
                                      <Avatar
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                          fontSize: "14px",
                                        }}
                                        {...stringAvatar(
                                          `${userInfo?.firstname} ${userInfo?.lastname}`
                                        )}
                                      />
                                    </span>
                                    <span hidden id="18val-avatar-label">
                                      Profile image of Milan Rawat
                                    </span>
                                  </div>
                                </div>

                                <div
                                  data-testid="issue.activity.comment"
                                  style={{
                                    flex: "1 1 100%",
                                    margin: "0px",
                                    minWidth: "0px",
                                    padding: "0px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      width: "100%",
                                    }}
                                  >
                                  <ReactQuillMention onChange={handleChange} allOrgUsersName={allOrgUsersName} commentText={commentText}   placeholder={"Type your update..."} isSubmitText={isSubmitText} />

                                    <div
                                      role="group"
                                      style={{
                                        display: "inline-flex",
                                        width: "100%",
                                        gap: "4px",
                                        WebkitBoxAlign: "center",
                                        WebkitBoxPack: "end",
                                        alignItems: "center",
                                        backgroundColor: "rgb(255, 255, 255)",
                                        boxSizing: "border-box",
                                        color: "rgb(23, 43, 77)",
                                        display: "flex",
                                        fontFamily:
                                          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
                                        fontSize: "14px",
                                        fontWeight: 400,
                                        justifyContent: "flex-start",
                                        lineHeight: "20px",
                                        margin: "0px",
                                        padding: "12px 0px",
                                        textAlign: "start",
                                      }}
                                    >
                                      <Button
                                        disabled={isDisable}
                                        variant="contained"
                                        className={isDisable ? "not-allowed-cursor" : ""}
                                        style={{
                                          background: isDisable ? "#cccccc" : "#F07227",
                                          borderRadius: "5px",
                                          width: "auto",
                                        }}
                                        onClick={addComment}
                                      >
                                        {isDisable ? <CircularProgress style={{height:"20px",width:"20px"}} /> : <span className="text-capitalize">Send</span>}
                                      </Button>

                                      <Button
                                        variant="outlined"
                                        style={{
                                          background: "#d2cccc",
                                          borderRadius: "5px",
                                          width: "auto",
                                          borderColor: "grey",
                                          color: "black",
                                          border: "none",
                                        }}
                                        onClick={() => setIsSubmitText(true)}
                                      >
                                        <span className="text-capitalize">
                                          Cancel
                                        </span>
                                      </Button>
                                      <AttachedFile
                                        selectedMedia={selectedMedia}
                                      />
                                    </div>
                                    <SelectedFilesName
                                      setSelectedFiles={setSelectedFiles}
                                      selectedFiles={selectedFiles}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                      </Box>
                </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default UpdateComments;
