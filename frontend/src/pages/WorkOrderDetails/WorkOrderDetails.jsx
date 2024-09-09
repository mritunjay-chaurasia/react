import Button from "@mui/material/Button";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactQuill,{Quill} from "react-quill";
import 'react-quill/dist/quill.snow.css';
import mention from "quill-mention";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation} from "react-router-dom";
import * as WorkOrderApi from '../../api/worklist.api';
import * as WorkOrderListApi from "../../api/worklist.api";
import "./workorderdetails.css";
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { socket } from "../../socket";
import { Avatar } from '@mui/material';
import { showNotification } from "../../utils/notification";
import * as UserProjectApi from '../../api/userProject.api';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Carousel, { Modal, ModalGateway } from "react-images";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { BACKEND_URL } from '../../constants';
import InputViewTextField from './InputViewTextField';
import HistoryDetails from './WorkOrderComponents/HistoryDetails/HistoryDetails';
import * as UsersNotificationApi from "../../api/usersNotification.api";
import ReactQuillMention from '../../components/ReactQuillMention/ReactQuillMention';
import AttachedFile from "../../pages/UpdateChats/AttachedFile";
import SelectedFilesName from "../../pages/UpdateChats/SelectedFilesName";
import CircularProgress from "@mui/material/CircularProgress";
import DisplaySlectedFile from "../../pages/UpdateComments/DisplaySlectedFile";

Quill.register("modules/mention", mention);
let workOrderStatusList;
let taskHoursList = [];

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

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
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}


function formatDate(dateString) {
    const date = new Date(dateString);

    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    return `${monthNames[monthIndex]} ${day}, ${year} at ${formattedTime}`;
}

function identifyLinkType(link) {
    // Regular expressions to match image and video file extensions
    const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;
    const videoExtensions = /\.(mp4|avi|mov|wmv|flv|webm)$/i;

    // Test if the link matches the image or video extensions
    if (imageExtensions.test(link)) {
        return 'image';
    } else if (videoExtensions.test(link)) {
        return 'video';
    } else {
        return 'unknown';
    }
}

// Example usage:
const link1 = 'https://example.com/image.jpg';
const link2 = 'https://example.com/video.mp4';

console.log(identifyLinkType(link1)); // Output: 'image'
console.log(identifyLinkType(link2)); // Output: 'video'


const TaskIssueField = ({ label, value, type, onChange, key, handleUpdateData, options }) => {
    return (
        <div
            style={{
                flex: '1 1 0%',
                margin: '0px',
                padding: '0px',
                position: 'relative'
            }}
        >
            <div
                style={{
                    margin: '0px',
                    padding: '0px',
                    width: '100%'
                }}
            >
                <div
                    className="jira-issue-field-heading-field-wrapper"
                    data-testid="issue.views.issue-base.context.number.customfield_10037">
                    <div
                        data-testid="issue-field-heading-styled-field-heading.customfield_10037"
                        style={{
                            boxSizing: 'border-box',
                            flexGrow: '1',
                            lineHeight: '1',
                            margin: '0px',
                            maxWidth: '170px',
                            minWidth: '90pt',
                            paddingBottom: '0px',
                            paddingLeft: '0px',
                            paddingRight: 'var(--ds-space-300,24px)',
                            paddingTop: 'var(--ds-space-100,8px)',
                            position: 'relative',
                            width: '40%'
                        }}
                    >
                        <h2
                            data-component-selector="jira-issue-field-heading-field-heading-title"
                            style={{
                                boxSizing: 'border-box',
                                color: '#172B4D',
                                // display: '20px',
                                // fontSize: '1.71429em',
                                fontWeight: 'var(--ds-font-weight-medium, 500)',
                                letterSpacing: '-0.01em',
                                lineHeight: '1.16667',
                                marginTop: '0px',
                                padding: '0px',
                                verticalAlign: 'bottom'
                            }}
                        >
                            {label}
                        </h2>
                    </div>
                    <div
                        style={{
                            '--_z7gtgw': 'var(--c-, )',
                            boxSizing: 'border-box',
                            flexGrow: '1',
                            margin: '0px',
                            padding: '0px',
                            width: '60%'
                        }}
                    >
                        <div
                            style={{
                                marginBottom: '0px',
                                marginLeft: 'var(--ds-space-negative-100,-8px)',
                                marginRight: '0px',
                                marginTop: 'var(--ds-space-negative-100,-8px)',
                                paddingBottom: '0px',
                                paddingLeft: '0px',
                                paddingRight: 'var(--ds-space-100,8px)',
                                paddingTop: '0px'
                            }}
                        >
                            <div
                                style={{
                                    margin: '0px',
                                    marginBlockStart: 'var(--ds-space-100, 8px)',
                                    padding: '0px'
                                }}
                            >
                                <div
                                    style={{
                                        lineHeight: '1',
                                        margin: '0px',
                                        padding: '0px'
                                    }}
                                >

                                    <div
                                        style={{
                                            boxSizing: 'border-box',
                                            width: "100%",
                                            maxWidth: '100%',
                                            minHeight: '32px',
                                        }}
                                    >
                                        <InputViewTextField
                                            type={type}
                                            text={value}
                                            onChange={onChange}
                                            handleUpdateData={handleUpdateData}
                                            options={options}
                                        />
                                        {/* <div
                                            data-component-selector="jira-issue-field-inline-edit-read-view-container"
                                            style={{
                                                left: 'var(--ds-space-075,6px)',
                                                margin: '0px',
                                                padding: '0px',
                                                position: 'relative',
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {requirementData?.taskHours['estAnlHrs']}
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


function WorkOrderDetails() {
    const { selectedProject, selectedOrganization } = useSelector((state) => state.orgDetails);
    const { userInfo } = useSelector((state) => state.user);
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState({ key: "files", value: []});
    const { workOrderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [requirementData, setRequirementData] = useState();
    const [allOrgUsers, setAllOrgUsers] = useState([]);
    const [taskAttachments, setTaskAttachments] = useState([]);
    const [taskAttachmentsVideo, setTaskAttachmentsVideo] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [value, setValue] = useState(0);
    const [commentBoxFocused, setCommentBoxFocused] = useState(false);
    const [descriptionBoxFocused, setDescriptionBoxFocused] = useState(false);
    const [videoLoader, setVideoLoader] = useState(false);
    const [previouscommentTexts, setPreviouscommentTexts] = useState('');
    const [previouscommentMediaFile, setPreviouscommentMediaFile] = useState([]);
    const [mentionedUsers, setMentionedUsers] = useState([]);
    const [allOrgUsersName, setAllOrgUsersName] = useState([]);
    const [previousDescription, setPreviousDescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedComment, setSelectedComment] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const editorRef = useRef(null);


    useEffect(() => {
        (async()=>{
            if(selectedProject && selectedProject.id){
                const loadProject = await UserProjectApi.loadProject(selectedProject.id);
                workOrderStatusList = loadProject?.userProject?.selectedStatus
                taskHoursList = loadProject?.userProject?.selectedDetails
            }
        })()
    }, [selectedProject])
    

    const [workOrderStatusListForAi, setWorkOrderStatusListForAi] = useState([
        {
            value: "codeReview",
            label: "Code review"
        },
        {
            value: "pushThisToProduction",
            label: "Push this to production"
        },
        {
            value: "getQuoteOnDevelopment",
            label: "Get quote on development"
        },
        {
            value: "getQuoteOnDeployment",
            label: "Get quote on deployment"
        }
    ]);

    const [taskData, setTaskData] = useState({
        taskName: "",
        description: "",
        mode: "",
        developer: "",
        files: [],
        priority: "",
        taskHours: {
            estAnlHrs: "",
            estDevHrs: "",
            estQAHrs: "",
            actAnlHrs: "",
            actDevHrs: "",
            actQAHrs: "",
        }
    })



    let taskUsersList = [
        {
            key: "assignedTo",
            label: "Assignee",
        },
        {
            key: "createdBy",
            label: "Reporter",
        },
        // {
        //     key: "principalArchitect",
        //     label: "Principal Architect",
        // },
        // {
        //     key: "qaLead",
        //     label: "QA Lead",
        // },
    ]

    const textareaRef = useRef(null);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = 'auto'; // Reset height to recalculate
        const newHeight = Math.min(textarea.scrollHeight, 120); // Get scrollHeight and compare with max-height
        textarea.style.height = `${newHeight}px`; // Set new height
    };

    const handleTextChange = (event) => {
        setCommentText(event.target.value);
        adjustHeight();
    };

    // Utility function to convert a URL to a File object
    const urlToFile = async (url, filename) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const mimeType = blob.type;
        return new File([blob], filename, { type: mimeType });
    };


    const handleEditClick = async(comment) => {
        setSelectedComment(comment);
        setIsEditing(true);
        setPreviouscommentTexts(comment.text )
        if (comment?.image) {
            let mediaToSet = [];
            let previousCommentMediaFile = []; 
            for (const file of comment.image) {
                const fileObject = await urlToFile(`${BACKEND_URL}/chatImages/${file}`, file);
                previousCommentMediaFile.push(file)
                mediaToSet.push(fileObject);
            }
            const editMediaFile = { key: "files", value: mediaToSet };
            setSelectedFiles(editMediaFile);
            setPreviouscommentMediaFile(previousCommentMediaFile)
        }
 
        if(comment.text ){
            const parser = new DOMParser();
            const doc = parser.parseFromString(comment.text , 'text/html');
            const mentions = doc.querySelectorAll('.mention');
            const ids = Array.from(mentions).map(mention => mention.getAttribute('data-id'));
            setMentionedUsers(ids);
          }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (editorRef.current && !editorRef.current.contains(event.target)) {
                setIsEditing(false);
                setSelectedComment(null);
                setCommentBoxFocused(false);
                setDescriptionBoxFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const handleSaveClick = async (commentId) => {
        let data = {
            workOrderId: requirementData?.id,
            text: selectedComment.text,
            workOrderCommentId: commentId,
            previouscommentTexts:previouscommentTexts,
            previouscommentMediaFile:previouscommentMediaFile,
            mentionedUsers:mentionedUsers
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
        const isEmpty = selectedComment.text.trim() === '' || selectedComment.text === '<p><br></p>' || selectedComment.text === '<h1><br></h1>' || selectedComment.text === '<h2><br></h2>';

        if (selectedComment.text && !isEmpty) {
          message = selectedComment.text.replace(/<[^>]*>/g, '');
        }
    
        if (selectedFiles && selectedFiles.key === "files" && selectedFiles.value.length > 0) {
          if (message !== '') {
            message += ' and added new attachment(s)';
          } else {
            message = 'Added new attachment(s)';
          }
        }
        const usersData = {
            projectId: selectedProject?.id,
            notifiedUserId:mentionedUsers,
            workOrderId : requirementData?.id,
            message:message,
            type: "mention",
        };

        const res = await UsersNotificationApi.addUsersNotification(usersData);
        if(res && res.status){
            socket.emit('notified-all-users', res.userNotification);
        }
    
        try {
            const response = await WorkOrderListApi.addComment(formdata);
            if (response && response.status) {
                setIsEditing(false);
                setSelectedComment(null);
                setPreviouscommentMediaFile([]);
                setSelectedFiles({ key: "files", value: []});
                let data = {
                    orgId: selectedOrganization.id,
                    workOrderId: workOrderId
                }
                const fetchComments = await WorkOrderApi.getOrgWorkOrder(data);
                if (fetchComments && fetchComments.status && fetchComments.workOrder) {
                    setRequirementData(fetchComments.workOrder);
                }
    
            }
        } catch (error) {
            console.error("Error while saving comment:", error);
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setSelectedComment(null);
        setSelectedFiles({ key: "files", value: []});
    };

    const handleCommentTextChange = (content) => {
        setSelectedComment(prev => ({ ...prev, text: content }));
        if(content){
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            const mentions = doc.querySelectorAll('.mention');
            const ids = Array.from(mentions).map(mention => mention.getAttribute('data-id'));
            setMentionedUsers(ids);
          }
    };

    const openLightbox = useCallback((event, { photo, index }) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    const [currentImage2, setCurrentImage2] = useState(0);
    const [viewerIsOpen2, setViewerIsOpen2] = useState(false);

    const openLightbox2 = useCallback((event, { photo, index }) => {
        setCurrentImage2(index);
        setViewerIsOpen2(true);
    }, []);

    const closeLightbox2 = () => {
        setCurrentImage2(0);
        setViewerIsOpen2(false);
    };



    const changeTicketStatus = async (id, status) => {
        try {
            const response = await WorkOrderListApi.changeWorkOrderStatus({ workOrderId: id, status: status })

            if (response.status) {
                // setWorkOrderListData((prev) => {
                //     return prev.map(elem => {
                //         if (elem.id === response.updateWorkOrderList.id) return { ...elem, status: response.updateWorkOrderList.status }
                //         else return elem
                //     })
                // })

                showNotification('success', "Successfully send to developers");
            }
        } catch (error) {
            console.log("Error While Sending information to Developers", error);
            showNotification('error', "Some Error Occured please try after some time");
        }
    }



    const assignTicketToUser = async (userId, ticketId) => {
        try {
            const response = await WorkOrderListApi.assignTicketToUser({ userId: userId, ticketId: ticketId })

            if (response && response.status) {
                // setWorkOrderListData((prev) => {
                //     return prev.map(elem => {
                //         if (elem.id === response.workOrder.id) return { ...elem, assignedToUser: response.workOrder.assignedToUser, assignedTo: response.workOrder.assignedTo }
                //         else return elem
                //     })
                // })

                showNotification('success', "Assigned to developer");
            }
        } catch (error) {
            console.log("Error While Sending information to Developers", error);
            showNotification('error', "Some Error Occured please try after some time");
        }
    }

    const comingSoonNotify = () => {
        showNotification("info", "Coming soon")
    }

    useEffect(() => {
        if (selectedOrganization?.id) {
            (async () => {
                try {
                   
                    let data = {
                        orgId: selectedOrganization.id,
                        workOrderId: workOrderId
                    }
                    const response = await WorkOrderApi.getOrgWorkOrder(data);
                   
                    if (response && response.status && response.workOrder && response.workOrder.list && selectedOrganization?.id === response.workOrder.orgId && selectedProject.id === response.workOrder.projectId ) {
                        setRequirementData(response.workOrder);
                        setTaskData({
                            taskName: response.workOrder.taskName,
                            description: response.workOrder.description,
                            mode: response.workOrder.mode,
                            developer: response.workOrder?.assignedToUser,
                            files: response.workOrder.images,
                            priority: response.workOrder.priority,
                            taskHours: response.workOrder.taskHours
                        })
                        setPreviousDescription(response?.workOrder?.description)
                        let imagesToSet = []
                        let videosToSet = []
                        console.log('my images :: :: ', response.workOrder.images)
                        response.workOrder.images.forEach(image => {
                            let type = identifyLinkType(image)
                            
                            if (type === "image") imagesToSet.push({
                                src: `${BACKEND_URL}/taskImages/${image}`,
                                width: 1,
                                height: 1
                            })
                            if (type === "video") videosToSet.push({
                                src: `${BACKEND_URL}/taskImages/${image}`
                            })
                        })
                        setTaskAttachments(imagesToSet)
                        setTaskAttachmentsVideo(videosToSet)
                    } else {
                        showNotification('error', "Task Details Not Found!")
                        navigate("/workOrder")
                    }
                } catch (error) {
                    showNotification('error', "Task Details Not Found!")
                    navigate("/workOrder")
                }
            })()
        }
    }, [selectedOrganization,selectedProject,location])


    useEffect(() => {
        if (selectedOrganization?.id) {
            (async () => {
                const response = await WorkOrderListApi.getAllOrgUsers(selectedOrganization?.id)
                if (response && response.status && response.allOrgUser) {
                    setAllOrgUsers(response.allOrgUser);
                    const filteredUsers = response.allOrgUser.length > 0 && response.allOrgUser.filter(user => user.id !== userInfo.id);
                    const formattedUsers = filteredUsers.map(user => ({
                      id: user.id,
                      value: `${user.firstname} ${user.lastname}`
                    }));
                    setAllOrgUsersName(formattedUsers);
                    setIsLoading(false)
                }
            })();
        }
    }, [selectedOrganization]);

    const previewReactProject = () => {
        navigate('/sourceCode')
    }

    const onUpdateTicketData = async ({ key, value }) => {
        try {
            let data = {
                workOrderId: requirementData?.id,
                taskHours: requirementData?.taskHours,
                developer: requirementData?.developer,
                tester: requirementData?.tester,
                createdBy: requirementData?.createdBy,
                assignedTo: requirementData?.assignedTo,
                principalArchitect: requirementData?.principalArchitect,
                qaLead: requirementData?.qaLead,
                status: requirementData?.status,
                priority: requirementData?.priority,
                description: taskData?.description,
                taskName: taskData?.taskName,
            }
            if (key && value) data[key] = value

            var formdata = new FormData();
            // Append files to the FormData object
            if (key === "files") {
                for (const file of Object.values(value)) {
                    formdata.append("files", file);
                }
            }
            formdata.append("data", JSON.stringify(data));

            const response = await WorkOrderApi.updateTicket(formdata);
            setPreviousDescription(response?.workOrder?.description)
            
            let notifiedUserId;
            if (key && key === 'assignedTo' && value) {
                notifiedUserId = value;
            }
            
            const usersData = {
                projectId: selectedProject?.id,
                notifiedUserId:[notifiedUserId],
                workOrderId: requirementData?.id,
                type: "assignedTo",
            };

            const res = await UsersNotificationApi.addUsersNotification(usersData);
            console.log("usersData>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<   res",res)
              if(res && res.status){
                socket.emit('notified-all-users',res.userNotification);
              }
  

            // if (response && response.status && response.workOrder) {
            //     setRequirementData({ ...requirementData, ...response.workOrder });
            // }

            if (response && response.status && key === "files" && response.fileNames) {
                setVideoLoader(true);

                let imagesToSet = [];
                let videosToSet = [];

                response.fileNames.forEach(image => {
                    let type = identifyLinkType(image);

                    if (type === "image") {
                        imagesToSet.push({
                            src: `${BACKEND_URL}/taskImages/${image}`,
                            width: 1,
                            height: 1
                        });
                    }
                    if (type === "video") {
                        videosToSet.push({
                            src: `${BACKEND_URL}/taskImages/${image}`
                        });
                    }
                });

                setTaskAttachments(prev => [...prev, ...imagesToSet]);
                setTaskAttachmentsVideo(prev => [...prev, ...videosToSet]);
                showNotification('success', "Successfully uploaded");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            showNotification('error', "Some Error Occured please try after some time");
        }
    }

    const quillTextChange = (content) => {
        if(content){
            setCommentText(content);
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            const mentions = doc.querySelectorAll('.mention');
            const ids = Array.from(mentions).map(mention => mention.getAttribute('data-id'));
            setMentionedUsers(ids);
          }
    }

    const addComment = async () => {
        const isEmpty = commentText.trim() === '' || commentText === '<p><br></p>' || commentText === '<h1><br></h1>' || commentText === '<h2><br></h2>';
        if (isEmpty &&  !(selectedFiles && selectedFiles.key === "files" && selectedFiles.value.length > 0)) {
            return; 
          }
        let data = {
            workOrderId: requirementData?.id,
            text: commentText,
            mentionedUsers:mentionedUsers
        }
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
        
        const response = await WorkOrderListApi.addComment(formdata);

        if (response && response.status) {
            setSelectedFiles({ key: "files", value: []});
            setRequirementData(prev => {
                return {
                    ...prev, comments: [{
                        ...response.comment, commentBy: {
                            firstname: userInfo?.firstname,
                            lastname: userInfo?.lastname
                        }
                    }, ...prev.comments]
                }
            })
        }
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
        const usersData = {
            projectId: selectedProject?.id,
            notifiedUserId:mentionedUsers,
            workOrderId : requirementData?.id,
            message:message,
            type: "mention",
        };

        const res = await UsersNotificationApi.addUsersNotification(usersData);
        if(res && res.status){
            socket.emit('notified-all-users', res.userNotification);
        }

        setCommentText("")
        setCommentBoxFocused(false)
    }
    const selectedMedia = async ({ key, value }) => {
        if (key === "files") {
            // Get the existing files from the state
            const existingFiles = selectedFiles?.value || [];
            // Create an array to hold both existing and new files
            const newFiles = [...existingFiles, ...value];
            // Update the state with the combined files
            const selectedKeyValue = { key, value: newFiles };
            setSelectedFiles(selectedKeyValue);
        }
    };


    return (
        <>
            {isLoading ? <div className="d-flex justify-content-center align-items-center h-100"><CircularProgress/> </div>:     
            <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
                <div className="main-task-page-container">
                    <div className="main-task-page">
                        <div className="main-task-container">
                            <div className="main-task-details-container">
                                <div className="main-task-details-sub-container">
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexGrow: '1',
                                            flexShrink: '1',
                                            margin: '0px',
                                            minWidth: '0px',
                                            padding: '0px',
                                            width: '100%'
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexGrow: '1',
                                                flexShrink: '1',
                                                margin: '0px',
                                                padding: '0px'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flex: '1 1 0%',
                                                    margin: '0px',
                                                    padding: '0px',
                                                    position: 'relative'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        margin: '0px',
                                                        padding: '0px',
                                                        width: '100%'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            marginBottom: '0px',
                                                            marginLeft: 'var(--ds-space-negative-100,-8px)',
                                                            marginRight: '0px',
                                                            marginTop: 'var(--ds-space-negative-100,-8px)',
                                                            padding: '0px',
                                                            width: '100%'
                                                        }}
                                                    >
                                                        <div
                                                            data-testid="issue-field-summary.ui.issue-field-summary-inline-edit--container"
                                                            style={{
                                                                margin: '0px',
                                                                padding: '0px',
                                                                width: '100%'
                                                            }}
                                                        >
                                                            <form role="presentation">
                                                                <div
                                                                    style={{
                                                                        margin: '0px',
                                                                        marginBlockStart: 'var(--ds-space-100, 8px)',
                                                                        padding: '0px'
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            lineHeight: '1',
                                                                            margin: '0px',
                                                                            padding: '0px'
                                                                        }}
                                                                    >
                                                                        <button
                                                                            aria-label={requirementData?.taskName}
                                                                            style={{
                                                                                background: 'transparent',
                                                                                border: '0px',
                                                                                display: 'block',
                                                                                lineHeight: '1',
                                                                                margin: 'var(--ds-space-0, 0px)',
                                                                                outline: '0px',
                                                                                padding: 'var(--ds-space-0, 0px)'
                                                                            }}
                                                                            type="button"
                                                                        />
                                                                        <div
                                                                            data-read-view-fit-container-width="true"
                                                                            role="presentation"
                                                                            style={{
                                                                                border: '2px solid transparent',
                                                                                borderRadius: '3px',
                                                                                boxSizing: 'border-box',
                                                                                display: 'inline-block',
                                                                                margin: '0px',
                                                                                maxWidth: '100%',
                                                                                padding: '0px',
                                                                                transition: 'background 0.2s ease 0s',
                                                                                width: '100%'
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    left: 'var(--ds-space-075,6px)',
                                                                                    lineHeight: '1',
                                                                                    maxWidth: '100%',
                                                                                    position: 'relative',
                                                                                    wordBreak: 'break-word'
                                                                                }}
                                                                            >
                                                                                {/* <h1
                                                                                    data-testid="issue.views.issue-base.foundation.summary.heading"
                                                                                    style={{
                                                                                        color: '#172B4D',
                                                                                        fontSize: '24px',
                                                                                        fontWeight: '600',
                                                                                        letterSpacing: '-0.01em',
                                                                                        lineHeight: '1.10345',
                                                                                        margin: '0px',
                                                                                        padding: '0px',
                                                                                        width: '100%',
                                                                                        wordBreak: 'break-word'
                                                                                    }}
                                                                                > */}
                                                                                <InputViewTextField
                                                                                    text={requirementData?.taskName}
                                                                                    onChange={(e) => setTaskData({ ...taskData, taskName: e.target.value })}
                                                                                    handleUpdateData={(e) => {
                                                                                        if (requirementData.taskName !== e.target.value)
                                                                                            onUpdateTicketData({ key: "taskName", value: e.target.value })
                                                                                    }}
                                                                                    style={{
                                                                                        color: '#172B4D',
                                                                                        fontSize: '24px',
                                                                                        fontWeight: '600',
                                                                                        letterSpacing: '-0.01em',
                                                                                        lineHeight: '1.10345',
                                                                                        width: '100%',
                                                                                        wordBreak: 'break-word'
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            margin: '0px',
                                            padding: '0px',
                                            position: 'relative'
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'block',
                                                margin: '0px',
                                                padding: '0px',
                                                position: 'absolute',
                                                width: '100%'
                                            }}
                                        >
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <div style={{ display: 'inline-flex' }}>
                                            <div role="presentation" style={{ margin: '0', padding: '0' }}>
                                                <span
                                                    data-testid="issue.issue-view.views.issue-base.foundation.quick-add.quick-add-item.add-attachment"
                                                    style={{ marginRight: '8px' }}
                                                >
                                                    <input
                                                        type="file"
                                                        id="file-input"
                                                        style={{ display: 'none' }}
                                                        accept="image/*,video/*"
                                                        multiple
                                                        onChange={(e) => onUpdateTicketData({ key: 'files', value: e.target.files })}
                                                    />

                                                    <button
                                                        aria-label="Attach"
                                                        style={{
                                                            alignItems: 'baseline',
                                                            // background: 'var(--ds-background-neutral, rgba(9, 30, 66, 0.04))',
                                                            background:"transparent",
                                                            borderRadius: '3px',
                                                            borderWidth: '0',
                                                            cursor: 'pointer',
                                                            display: 'inline-flex',
                                                            fontWeight: '500',
                                                            height: '2.28571em',
                                                            justifyContent: 'center',
                                                            lineHeight: '2.28571em',
                                                            margin: '0',
                                                            maxWidth: '100%',
                                                            // padding: '0 10px',
                                                            padding:"0",
                                                            position: 'relative',
                                                            textAlign: 'center',
                                                            transition: 'background 0.1s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)',
                                                            verticalAlign: 'middle',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                        onClick={() => document.getElementById('file-input').click()}
                                                    >
                                                        <span style={{ display: 'flex', marginRight: '-4px' }}>
                                                            <span style={{ marginLeft: '-4px', marginRight: '-2px' }}>
                                                                <span aria-hidden="true">
                                                                    <svg
                                                                        height="24"
                                                                        role="presentation"
                                                                        style={{ height: '24px', width: '24px', color: 'currentColor', fill: 'var(--ds-surface, #FFFFFF)' }}
                                                                        viewBox="0 0 24 24"
                                                                        width="24"
                                                                    >
                                                                        <path
                                                                            d="M11.643 17.965c-1.53 1.495-4.016 1.496-5.542.004a3.773 3.773 0 01.002-5.412l7.147-6.985a2.316 2.316 0 013.233-.003c.893.873.895 2.282.004 3.153l-6.703 6.55a.653.653 0 01-.914-.008.62.62 0 010-.902l6.229-6.087a.941.941 0 000-1.353.995.995 0 00-1.384 0l-6.23 6.087a2.502 2.502 0 000 3.607 2.643 2.643 0 003.683.009l6.703-6.55a4.074 4.074 0 00-.003-5.859 4.306 4.306 0 00-6.002.003l-7.148 6.985a5.655 5.655 0 00-.001 8.118c2.29 2.239 6.015 2.238 8.31-.005l6.686-6.533a.941.941 0 000-1.353.995.995 0 00-1.384 0l-6.686 6.534z"
                                                                            fill="currentColor"
                                                                            fillRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                </span>
                                                            </span>
                                                        </span>
                                                        <span style={{ flex: '1', margin: '0 2px', opacity: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Attach</span>
                                                    </button>
                                                </span>
                                            </div>
                                        </div>

                                    </div>

                                    <div
                                        style={{
                                            marginBottom: '0px',
                                            marginLeft: '0px',
                                            marginRight: '0px',
                                            marginTop: 'var(--ds-space-100,8px)',
                                            padding: '0px'
                                        }}
                                    >
                                        <div
                                            style={{
                                                flex: '1 1 0%',
                                                margin: '0px',
                                                padding: '0px',
                                                position: 'relative'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    margin: '0px',
                                                    padding: '0px',
                                                    width: '100%'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        margin: '0px',
                                                        padding: '0px'
                                                    }}
                                                >
                                                    <h2
                                                        data-testid="issue.views.issue-base.common.description.label"
                                                        style={{
                                                            color: '#172B4D',
                                                            fontSize: '16px',
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        Description
                                                    </h2>
                                                    <div
                                                        data-component-selector="jira.issue-view.common.inline-edit.compact-wrapper-control"
                                                        style={{
                                                            marginBottom: 'var(--ds-space-300,24px)',
                                                            marginLeft: '0px',
                                                            marginRight: '0px',
                                                            marginTop: '0px',
                                                            padding: '0px'
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                margin: '0px',
                                                                marginBlockStart: 'var(--ds-space-100, 8px)',
                                                                padding: '0px',
                                                                width: "100%",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    lineHeight: '1',
                                                                    margin: '0px',
                                                                    padding: '0px',
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <div
                                                                    data-read-view-fit-container-width="true"
                                                                    role="presentation"
                                                                    style={{
                                                                        alignItems: 'center',
                                                                        border: '2px solid transparent',
                                                                        borderRadius: '3px',
                                                                        boxSizing: 'border-box',
                                                                        display: 'flex',
                                                                        marginBottom: '0px',
                                                                        marginLeft: 'var(--ds-space-negative-100,-8px)',
                                                                        marginRight: '0px',
                                                                        marginTop: 'var(--ds-space-negative-100,-8px)',
                                                                        maxWidth: '100%',
                                                                        paddingBottom: '0px',
                                                                        // paddingLeft: 'var(--ds-space-075,6px)',
                                                                        paddingRight: 'var(--ds-space-075,6px)',
                                                                        paddingTop: '0px',
                                                                        transition: 'background 0.2s ease 0s',
                                                                        width: '100%',
                                                                        wordBreak: 'break-word'
                                                                    }}
                                                                >
                                                                    {/* {!descriptionBoxFocused && <div className='issue-field-detail' onClick={() => setDescriptionBoxFocused(true)}>
                                                                        <FroalaEditorView model={requirementData?.description} />
                                                                    </div>}
                                                                    {descriptionBoxFocused && <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                                                        <MyFroalaEditor model={taskData?.description} setModel={(value) => setTaskData({ ...taskData, description: value })} />
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
                                                                                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
                                                                                fontSize: "14px",
                                                                                fontWeight: 400,
                                                                                justifyContent: "flex-start",
                                                                                lineHeight: "20px",
                                                                                margin: "0px",
                                                                                padding: "12px 0px",
                                                                                textAlign: "start"
                                                                            }}
                                                                        >
                                                                            <Button
                                                                                variant="contained"
                                                                                style={{
                                                                                    background: "#F07227",
                                                                                    borderRadius: "5px",
                                                                                    width: "auto",
                                                                                }}
                                                                                onClick={() => {
                                                                                    onUpdateTicketData({ key: "description", value: taskData?.description })
                                                                                    setDescriptionBoxFocused(false)
                                                                                }}
                                                                            >
                                                                                <span>Save</span>
                                                                            </Button>

                                                                            <Button
                                                                                variant="outlined"
                                                                                style={{
                                                                                    // background: "#F07227",
                                                                                    borderRadius: "5px",
                                                                                    width: "auto",
                                                                                    borderColor: "grey",
                                                                                    color: "black",
                                                                                    border: "none"
                                                                                }}
                                                                                onClick={() => setDescriptionBoxFocused(false)}
                                                                            >
                                                                                <span>Cancel</span>
                                                                            </Button>
                                                                        </div>
                                                                    </div>} */}
                                                                    {!descriptionBoxFocused && <div  className='issue-field-detail' onClick={() => setDescriptionBoxFocused(true)}>
                                                                        <ReactQuill
                                                                            style={{ border: 'unset' }}
                                                                            className="ReactQuill"
                                                                            theme="snow"
                                                                            value={taskData.description}
                                                                            readOnly={true}
                                                                            placeholder="description..."
                                                                            modules={{
                                                                                toolbar: [], // Empty array to remove all toolbar options
                                                                            }}
                                                                        />
                                                                    </div>}
                                                                    {descriptionBoxFocused && <div ref={editorRef} style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                                                        <ReactQuillMention allOrgUsersName={allOrgUsersName} onChange={(value) => setTaskData({ ...taskData, description: value })} commentText={taskData.description} placeholder={"description..."}/>
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
                                                                                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
                                                                                fontSize: "14px",
                                                                                fontWeight: 400,
                                                                                justifyContent: "flex-start",
                                                                                lineHeight: "20px",
                                                                                margin: "0px",
                                                                                padding: "12px 0px",
                                                                                textAlign: "start"
                                                                            }}
                                                                        >
                                                                            <Button
                                                                                variant="contained"
                                                                                style={{
                                                                                    background: "#F07227",
                                                                                    borderRadius: "5px",
                                                                                    width: "auto",
                                                                                }}
                                                                                onClick={() => {
                                                                                    onUpdateTicketData({ key: "description", value: taskData?.description })
                                                                                    setDescriptionBoxFocused(false)
                                                                                }}
                                                                            >
                                                                                <span className="text-capitalize">Save</span>
                                                                            </Button>

                                                                            <Button
                                                                                variant="outlined"
                                                                                style={{
                                                                                    // background: "#F07227",
                                                                                    borderRadius: "5px",
                                                                                    width: "auto",
                                                                                    borderColor: "grey",
                                                                                    color: "black",
                                                                                    border: "none"
                                                                                }}  
                                                                                onClick={() => {setDescriptionBoxFocused(false);
                                                                                    setTaskData({ ...taskData, description: previousDescription});
                                                                                }}
                                                                            >
                                                                                <span className="text-capitalize">Cancel</span>
                                                                            </Button>
                                                                        </div>
                                                                    </div>}

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {requirementData?.mode === 'ai' &&

                                                    <div
                                                        style={{
                                                            margin: '0px',
                                                            padding: '0px'
                                                        }}
                                                    >
                                                        <h2
                                                            data-testid="issue.views.issue-base.common.description.label"
                                                            style={{
                                                                color: '#172B4D',
                                                                fontSize: '16px',
                                                                fontWeight: '600',
                                                            }}
                                                        >
                                                            Ai generated response
                                                        </h2>

                                                        <div
                                                            data-component-selector="jira.issue-view.common.inline-edit.compact-wrapper-control"
                                                            style={{
                                                                marginBottom: 'var(--ds-space-300,24px)',
                                                                marginLeft: '0px',
                                                                marginRight: '0px',
                                                                marginTop: '0px',
                                                                padding: '0px',
                                                                width: '100%',
                                                            }}
                                                        >   <Button
                                                           className="text-capitalize"
                                                            variant="outlined"
                                                            style={{
                                                                width: "120px",
                                                                color: "#F07227",
                                                                border: "1px solid #F07227", margin: '0px 15px'
                                                            }}
                                                            sx={{
                                                                ":hover": {
                                                                    bgcolor: "#FCE9E9",
                                                                },
                                                            }}
                                                            onClick={() => previewReactProject()}
                                                        >
                                                                Preview
                                                            </Button>

                                                            <div
                                                                style={{
                                                                    margin: '0px',
                                                                    marginBlockStart: 'var(--ds-space-100, 8px)',
                                                                    padding: '0px',
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        lineHeight: '1',
                                                                        margin: '0px',
                                                                        padding: '0px',
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    <div
                                                                        data-read-view-fit-container-width="true"
                                                                        role="presentation"
                                                                        style={{
                                                                            alignItems: 'center',
                                                                            border: '2px solid transparent',
                                                                            borderRadius: '3px',
                                                                            boxSizing: 'border-box',
                                                                            display: 'flex',
                                                                            marginBottom: '0px',
                                                                            marginLeft: 'var(--ds-space-negative-100,-8px)',
                                                                            marginRight: '0px',
                                                                            marginTop: 'var(--ds-space-negative-100,-8px)',
                                                                            maxWidth: '100%',
                                                                            paddingBottom: '0px',
                                                                            paddingLeft: 'var(--ds-space-075,6px)',
                                                                            paddingRight: 'var(--ds-space-075,6px)',
                                                                            paddingTop: '0px',
                                                                            transition: 'background 0.2s ease 0s',
                                                                            width: '100%',
                                                                            wordBreak: 'break-word'
                                                                        }}
                                                                    >

                                                                        <div style={{ width: '100%' }}>
                                                                            {requirementData &&
                                                                                requirementData?.aiResponce.map(itemContent => (
                                                                                    <div styl e={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                                        <div style={{ marginBottom: '2rem', width: "90%" }}>
                                                                                            <div>
                                                                                                <Accordion >
                                                                                                    <AccordionSummary
                                                                                                        expandIcon={<ExpandMoreIcon />}
                                                                                                        aria-controls="panel1-content"
                                                                                                        id="panel1-header"
                                                                                                    >
                                                                                                        <div style={{ width: "100%", height: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 15px" }}>
                                                                                                            <span>{itemContent.file}</span>
                                                                                                        </div>
                                                                                                    </AccordionSummary>
                                                                                                    <AccordionDetails>
                                                                                                        <SyntaxHighlighter language="javascript" style={docco} wrapLongLines={true}>
                                                                                                            {itemContent.content}
                                                                                                        </SyntaxHighlighter>
                                                                                                    </AccordionDetails>
                                                                                                </Accordion>
                                                                                            </div>


                                                                                        </div>
                                                                                    </div>
                                                                                ))

                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>}
                                            </div>
                                        </div>

                                        {((taskAttachments && taskAttachments.length > 0) || (taskAttachmentsVideo && taskAttachmentsVideo.length > 0)) && <div
                                            style={{
                                                margin: '0px',
                                                padding: '0px',
                                                position: 'relative'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    alignItems: 'center',
                                                    display: 'flex',
                                                    flexWrap: 'nowrap',
                                                    justifyContent: 'space-between',
                                                    margin: '0px',
                                                    padding: '0px'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        alignItems: 'center',
                                                        display: 'flex',
                                                        justifyContent: 'flex-start',
                                                        margin: '0px',
                                                        maxWidth: '100%',
                                                        padding: '0px'
                                                    }}
                                                >
                                                    <h2
                                                        data-testid="issue.views.issue-base.common.description.label"
                                                        style={{
                                                            color: '#172B4D',
                                                            fontSize: '20px',
                                                            fontWeight: 'var(--ds-font-weight-medium, 500)',
                                                            letterSpacing: '-0.01em',
                                                            lineHeight: '1.16667',
                                                            minWidth: '0px',
                                                            overflowWrap: 'break-word'
                                                        }}
                                                    >
                                                        Attachments
                                                    </h2>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    margin: '0px',
                                                    padding: '0px',
                                                    scrollMarginBottom: '75pt'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        margin: '0px',
                                                        padding: '0px'
                                                    }}
                                                >
                                                    <div
                                                        data-testid="issue.views.field.rich-text.description"
                                                        role="presentation"
                                                        style={{
                                                            margin: '0px',
                                                            padding: '0px'
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                margin: '0px',
                                                                padding: '0px',
                                                                width: '100%'
                                                            }}
                                                        >
                                                            <div
                                                                data-component-selector="jira.issue-view.common.inline-edit.compact-wrapper-control"
                                                                style={{
                                                                    marginBottom: 'var(--ds-space-300,24px)',
                                                                    marginLeft: '0px',
                                                                    marginRight: '0px',
                                                                    marginTop: '0px',
                                                                    padding: '0px'
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        margin: '0px',
                                                                        padding: '0px'
                                                                    }}
                                                                >
                                                                    <form role="presentation">
                                                                        <div
                                                                            style={{
                                                                                margin: '0px',
                                                                                marginBlockStart: 'var(--ds-space-100, 8px)',
                                                                                padding: '0px',
                                                                                width: "100%",
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    lineHeight: '1',
                                                                                    margin: '0px',
                                                                                    padding: '0px',
                                                                                    width: "100%",
                                                                                }}
                                                                            >
                                                                                <button
                                                                                    aria-label="Edit Description"
                                                                                    style={{
                                                                                        background: 'transparent',
                                                                                        border: '0px',
                                                                                        display: 'block',
                                                                                        lineHeight: '1',
                                                                                        margin: 'var(--ds-space-0, 0px)',
                                                                                        outline: '0px',
                                                                                        width: "100%",
                                                                                        padding: 'var(--ds-space-0, 0px)'
                                                                                    }}
                                                                                    type="button"
                                                                                />
                                                                                <div
                                                                                    data-read-view-fit-container-width="true"
                                                                                    role="presentation"
                                                                                    style={{
                                                                                        alignItems: 'center',
                                                                                        border: '2px solid transparent',
                                                                                        borderRadius: '3px',
                                                                                        boxSizing: 'border-box',
                                                                                        display: 'flex',
                                                                                        marginBottom: '0px',
                                                                                        marginLeft: 'var(--ds-space-negative-100,-8px)',
                                                                                        marginRight: '0px',
                                                                                        marginTop: 'var(--ds-space-negative-100,-8px)',
                                                                                        maxWidth: '100%',
                                                                                        paddingBottom: '0px',
                                                                                        paddingLeft: 'var(--ds-space-075,6px)',
                                                                                        paddingRight: 'var(--ds-space-075,6px)',
                                                                                        paddingTop: '0px',
                                                                                        transition: 'background 0.2s ease 0s',
                                                                                        width: '100%',
                                                                                        wordBreak: 'break-word'
                                                                                    }}
                                                                                >
                                                                                    {/* <Gallery photos={taskAttachments} onClick={openLightbox} /> */}

                                                                                    <div className="thumbnails d-flex flex-wrap">
                                                                                        {taskAttachments.map((image, index) => (
                                                                                            <img
                                                                                                key={index}
                                                                                                src={image.src}
                                                                                                alt={`Thumbnail ${index}`}
                                                                                                style={{ width: 230, margin: 10, cursor: 'pointer' }}
                                                                                                onClick={() => {
                                                                                                    setCurrentImage(index);
                                                                                                    setViewerIsOpen(true);
                                                                                                }}
                                                                                            />
                                                                                        ))}


                                                                                        {taskAttachmentsVideo.map(video => (
                                                                                            <video controls style={{ width: 230, margin: 10 }}>
                                                                                                <source src={video.src} type="video/mp4" />
                                                                                                <source src="mov_bbb.ogg" type="video/ogg" />
                                                                                                Your browser does not support HTML video.
                                                                                            </video>
                                                                                        ))}

                                                                                    </div>
                                                                                    <ModalGateway>
                                                                                        {viewerIsOpen ? (
                                                                                            <Modal onClose={closeLightbox}>
                                                                                                <Carousel
                                                                                                    currentIndex={currentImage}
                                                                                                    views={taskAttachments.map(x => ({
                                                                                                        ...x,
                                                                                                        srcset: x.srcSet,
                                                                                                        caption: x.title
                                                                                                    }))}
                                                                                                />
                                                                                            </Modal>
                                                                                        ) : null}
                                                                                    </ModalGateway>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}

                                    </div>
                                    <div
                                        style={{
                                            margin: '0px',
                                            padding: '0px',
                                            position: 'relative'
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'block',
                                                margin: '0px',
                                                padding: '0px',
                                                position: 'absolute',
                                                width: '100%'
                                            }}
                                        >
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            margin: '0px',
                                            padding: '0px',
                                            position: 'relative'
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'block',
                                                margin: '0px',
                                                padding: '0px',
                                                position: 'absolute',
                                                width: '100%'
                                            }}
                                        >
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            alignItems: 'center',
                                            display: 'flex',
                                            flexWrap: 'nowrap',
                                            margin: '0px',
                                            padding: '0px'
                                        }}
                                    >
                                        <h2
                                            data-testid="issue-activity-feed.heading"
                                            style={{
                                                color: '#172B4D',
                                                fontSize: '20px',
                                                fontWeight: 'var(--ds-font-weight-medium, 500)',
                                                letterSpacing: '-0.01em',
                                                lineHeight: '1.16667',
                                                minWidth: '0px',
                                                overflowWrap: 'break-word'
                                            }}
                                        >
                                            Activity
                                        </h2>
                                    </div>
                                    <div
                                        style={{
                                            alignItems: 'center',
                                            display: 'flex',
                                            flexWrap: 'nowrap',
                                            justifyContent: 'space-between',
                                            margin: '4px 0px 0px',
                                            padding: '0px'
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                margin: '0px',
                                                padding: '0px',
                                                width: '100%',
                                            }}
                                        >

                                            <div
                                                role="menubar"
                                                style={{
                                                    width: '100%',
                                                }}
                                            >
                                                <Box sx={{ width: '100%' }}>
                                                    <Box >

                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            {/* <span>Show: </span> */}
                                                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                                                {/* <Tab label="All" /> */}
                                                                <Tab label="Comments" className="text-capitalize" />
                                                                <Tab label="History" className="text-capitalize" />
                                                                {/* <Tab label="Work Log" /> */}
                                                            </Tabs>
                                                        </div>

                                                        {/* <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: "flex-end"
                                                            }}
                                                        >
                                                            <button
                                                                style={{
                                                                    WebkitBoxPack: 'center',
                                                                    alignItems: 'center',
                                                                    borderRadius: 'var(--ds-border-radius, 3px)',
                                                                    borderWidth: '0px',
                                                                    boxSizing: 'border-box',
                                                                    cursor: 'pointer',
                                                                    display: 'inline-flex',
                                                                    fontWeight: '500',
                                                                    height: '1.71429em',
                                                                    justifyContent: 'center',
                                                                    lineHeight: '1.71429em',
                                                                    maxWidth: '100%',
                                                                    padding: '0px 10px',
                                                                    position: 'relative',
                                                                    textAlign: 'center',
                                                                    transition: 'background 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s',
                                                                    verticalAlign: 'middle',
                                                                    whiteSpace: 'nowrap'
                                                                }}
                                                                tabIndex="0"
                                                                type="button"
                                                                onClick={comingSoonNotify}
                                                            >
                                                                <span
                                                                    style={{
                                                                        WebkitBoxFlex: '1',
                                                                        flexGrow: '1',
                                                                        flexShrink: '1',
                                                                        margin: '0px 2px',
                                                                        opacity: '1',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        transition: 'opacity 0.3s ease 0s',
                                                                        whiteSpace: 'nowrap'
                                                                    }}
                                                                >
                                                                    Oldest first
                                                                </span>
                                                                <SortIcon />
                                                            </button>
                                                        </div> */}

                                                    </Box>
                                                    {/* <Box role="tabpanel" hidden={value !== 0}>
                                                        Item One Content
                                                    </Box> */}
                                                    <Box role="tabpanel" hidden={value !== 0}>
                                                        {(requirementData?.comments || []).map(commentItem => (
                                                            <div
                                                               key={commentItem.id}
                                                                style={{
                                                                    backgroundColor: 'rgb(255, 255, 255)',
                                                                    color: 'rgb(23, 43, 77)',
                                                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                                                                    fontSize: '14px',
                                                                    fontWeight: '400',
                                                                    lineHeight: '20px',
                                                                    marginBottom: '0px',
                                                                    marginLeft: '0px',
                                                                    marginRight: '0px',
                                                                    marginTop: 'var(--ds-space-100,8px)',
                                                                    padding: '0px',
                                                                    textAlign: 'start'
                                                                }}
                                                            >
                                                                <div data-testid="comment-base-item-14752">
                                                                    <div
                                                                        style={{
                                                                            display: 'flex',
                                                                            gap: "15px"
                                                                        }}
                                                                    >

                                                                        <div>

                                                                            <Avatar style={{ width: "32px", height: "32px", fontSize: "14px" }} {...stringAvatar(`${commentItem?.commentBy.firstname} ${commentItem?.commentBy.lastname}`)} />
                                                                        </div>
                                                                        <div
                                                                            style={{
                                                                                gridArea: 'comment-area',
                                                                                margin: '0px',
                                                                                minWidth: '0px',
                                                                                overflowWrap: 'break-word',
                                                                                paddingBottom: '0px',
                                                                                paddingLeft: '0px',
                                                                                paddingRight: '0px',
                                                                                paddingTop: 'var(--ds-space-025, 2px)'
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    boxSizing: 'border-box',
                                                                                    display: 'flex',
                                                                                    flexDirection: 'column',
                                                                                    gap: 'var(--ds-space-050, 4px)',
                                                                                    justifyContent: 'stretch',
                                                                                    margin: '0px',
                                                                                    padding: '0px'
                                                                                }}
                                                                            >

                                                                                <div
                                                                                    data-testid="issue-comment-base.ui.comment.ak-comment.14752-header"
                                                                                    style={{
                                                                                        WebkitBoxAlign: 'center',
                                                                                        alignItems: 'center',
                                                                                        boxSizing: 'border-box',
                                                                                        display: 'flex',
                                                                                        flexDirection: 'row',
                                                                                        gap: 'var(--ds-space-100, 8px)'
                                                                                    }}
                                                                                >
                                                                                    <div
                                                                                        style={{
                                                                                            margin: '0px',
                                                                                            padding: '0px'
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
                                                                                                    margin: '0px',
                                                                                                    padding: '0px'
                                                                                                }}
                                                                                            >
                                                                                                <span
                                                                                                    role="presentation"
                                                                                                    style={{
                                                                                                        color: "black",
                                                                                                        fontWeight: "500",
                                                                                                        fontSize: "14px"
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
                                                                                            color: '#42526E',
                                                                                            fontSize: "14px"
                                                                                        }}
                                                                                    >
                                                                                        {formatDate(commentItem.updatedAt)}
                                                                                    </span>
                                                                                </div>
                                                                                <div
                                                                                    color="color.text"
                                                                                    data-testid="issue-comment-base.ui.comment.ak-comment.14752-content"
                                                                                    style={{
                                                                                        boxSizing: 'border-box',
                                                                                        margin: '0px',
                                                                                        padding: '0px'
                                                                                    }}
                                                                                >
                                                                                    <div
                                                                                        style={{
                                                                                            color: 'var(--ds-text, #172B4D)',
                                                                                            fontSize: '14px',
                                                                                            lineHeight: '24px',
                                                                                            margin: '0px',
                                                                                            overflowWrap: 'break-word',
                                                                                            padding: '0px',
                                                                                            whiteSpace: 'pre-wrap'
                                                                                        }}
                                                                                    >
                                                                                        {isEditing && selectedComment?.id === commentItem.id ? (
                                                                                            <div ref={editorRef}  style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                                                                            <ReactQuillMention allOrgUsersName={allOrgUsersName} onChange={handleCommentTextChange} commentText={selectedComment.text} placeholder={"comment..."}/>
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
                                                                                                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
                                                                                                        fontSize: "14px",
                                                                                                        fontWeight: 400,
                                                                                                        justifyContent: "flex-start",
                                                                                                        lineHeight: "20px",
                                                                                                        margin: "0px",
                                                                                                        padding: "12px 0px",
                                                                                                        textAlign: "start"
                                                                                                    }}
                                                                                                >
                                                                                                    <Button
                                                                                                        variant="contained"
                                                                                                        style={{
                                                                                                            background: "#F07227",
                                                                                                            borderRadius: "5px",
                                                                                                            width: "auto",
                                                                                                        }}
                                                                                                        onClick={() => handleSaveClick(commentItem.id)}
                                                                                                    >
                                                                                                        <span className="text-capitalize">Save</span>
                                                                                                    </Button>

                                                                                                    <Button
                                                                                                        variant="outlined"
                                                                                                        style={{
                                                                                                            borderRadius: "5px",
                                                                                                            width: "auto",
                                                                                                            borderColor: "grey",
                                                                                                            color: "black",
                                                                                                            border: "none"
                                                                                                        }}
                                                                                                        onClick={() => handleCancelClick()}
                                                                                                    >
                                                                                                        <span className="text-capitalize">Cancel</span>
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
                                                                                        ) : (
                                                                                            <div onClick={() => handleEditClick(commentItem)}>
                                                                                                <ReactQuill
                                                                                                    style={{ border: 'unset' }}
                                                                                                    className="ReactQuill"
                                                                                                    theme="snow"
                                                                                                    value={commentItem.text}
                                                                                                    readOnly={true}
                                                                                                    modules={{
                                                                                                        toolbar: [],
                                                                                                    }}
                                                                                                />
                                                                                            <DisplaySlectedFile width={"230px"} commentItem={commentItem.image}/>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <div
                                                            style={{
                                                                '--_13x3tqy': 'var(--c-, )',
                                                                '--_17l2vjj': '0',
                                                                '--_1lo5oba': 'var(--ds-surface, white)',
                                                                '--_fvojpe': 'translate(0, 0)',
                                                                background: 'var(--_1lo5oba)',
                                                                bottom: 'var(--ds-space-negative-025,-2px)',
                                                                marginBottom: '0px',
                                                                marginLeft: 'var(--ds-space-negative-100,-8px)',
                                                                marginRight: '0px',
                                                                marginTop: '0px',
                                                                paddingBottom: '0px',
                                                                paddingLeft: 'var(--ds-space-100,8px)',
                                                                paddingRight: '0px',
                                                                paddingTop: '0px',
                                                                position: 'sticky',
                                                                top: 'var(--_13x3tqy)',
                                                                transform: 'var(--_fvojpe)',
                                                                transition: 'transform 0.3s cubic-bezier(0.86, 0, 0.07, 1) 0.1s',
                                                                zIndex: 'var(--_17l2vjj)'
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    '--_1pv0o8f': '0 -2px 0 0 var(--ds-border, #EBECF0)',
                                                                    background: 'var(--ds-surface,#fff)',
                                                                    display: 'flex',
                                                                    marginBottom: '0px',
                                                                    marginLeft: '0px',
                                                                    marginRight: '0px',
                                                                    marginTop: 'var(--ds-space-100,8px)',
                                                                    paddingBottom: 'var(--ds-space-200,1pc)',
                                                                    paddingLeft: '0px',
                                                                    paddingRight: '0px',
                                                                    paddingTop: 'var(--ds-space-200,1pc)'
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        marginBottom: '0px',
                                                                        marginLeft: '0px',
                                                                        marginRight: 'var(--ds-space-150,9pt)',
                                                                        marginTop: 'var(--ds-space-025,2px)',
                                                                        padding: '0px'
                                                                    }}
                                                                >
                                                                    <div
                                                                        aria-labelledby="18val-avatar-label"
                                                                        role="img"
                                                                        style={{
                                                                            display: 'inline-block',
                                                                            margin: '0px',
                                                                            outline: '0px',
                                                                            padding: '0px',
                                                                            position: 'relative'
                                                                        }}
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                WebkitBoxAlign: 'stretch',
                                                                                WebkitBoxPack: 'center',
                                                                                alignItems: 'stretch',
                                                                                backgroundColor: 'var(--ds-surface-overlay, #FFFFFF)',
                                                                                borderRadius: '50%',
                                                                                boxShadow: '0 0 0 2px var(--ds-surface-overlay, #FFFFFF)',
                                                                                boxSizing: 'content-box',
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                                height: '32px',
                                                                                justifyContent: 'center',
                                                                                margin: 'var(--ds-space-025, 2px)',
                                                                                overflow: 'hidden',
                                                                                padding: 'var(--ds-space-0, 0px)',
                                                                                position: 'static',
                                                                                transform: 'translateZ(0px)',
                                                                                transition: 'transform 200ms ease 0s, opacity 200ms ease 0s',
                                                                                width: '32px'
                                                                            }}
                                                                        >
                                                                            <Avatar style={{ width: "32px", height: "32px", fontSize: "14px" }} {...stringAvatar(`${userInfo?.firstname} ${userInfo?.lastname}`)} />
                                                                        </span>
                                                                        <span
                                                                            hidden
                                                                            id="18val-avatar-label"
                                                                        >
                                                                            Profile image of Milan Rawat
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    data-testid="issue.activity.comment"
                                                                    style={{
                                                                        flex: '1 1 100%',
                                                                        margin: '0px',
                                                                        minWidth: '0px',
                                                                        padding: '0px'
                                                                    }}
                                                                >
                                                                    {!commentBoxFocused && <input
                                                                        ref={textareaRef}
                                                                        data-testid="chrome-collapsed"
                                                                        placeholder="Add a comment…"
                                                                        style={{
                                                                            backgroundColor: 'var(--ds-background-input, white)',
                                                                            border: '1px solid var(--ds-border-input, #DFE1E6)',
                                                                            borderRadius: '3px',
                                                                            boxSizing: 'border-box',
                                                                            color: 'var(--ds-text-subtlest, #5E6C84)',
                                                                            fontSize: '14px',
                                                                            fontWeight: '400',
                                                                            height: '40px', // Initial height, will be overridden by adjustHeight function
                                                                            letterSpacing: '-0.005em',
                                                                            lineHeight: '1.42857',
                                                                            paddingBottom: 'var(--ds-space-150, 12px)',
                                                                            paddingLeft: 'var(--ds-space-250, 20px)',
                                                                            paddingTop: 'var(--ds-space-150, 12px)',
                                                                            width: '100%',
                                                                            overflowY: 'auto' // Allow scroll inside textarea if needed
                                                                        }}
                                                                        rows={1}
                                                                        // value={commentText}
                                                                        onChange={handleTextChange}
                                                                        onFocus={() => setCommentBoxFocused(true)}
                                                                    />}



                                                                    {/* {commentBoxFocused && <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                                                        <MyFroalaEditor model={commentText} setModel={(value) => setCommentText(value)} />
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
                                                                                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
                                                                                fontSize: "14px",
                                                                                fontWeight: 400,
                                                                                justifyContent: "flex-start",
                                                                                lineHeight: "20px",
                                                                                margin: "0px",
                                                                                padding: "12px 0px",
                                                                                textAlign: "start"
                                                                            }}
                                                                        >
                                                                            <Button
                                                                                variant="contained"
                                                                                style={{
                                                                                    background: "#F07227",
                                                                                    borderRadius: "5px",
                                                                                    width: "auto",
                                                                                }}
                                                                                onClick={() => {
                                                                                    addComment()
                                                                                    setCommentBoxFocused(false)
                                                                                }}
                                                                            >
                                                                                <span>Save</span>
                                                                            </Button>

                                                                            <Button
                                                                                variant="outlined"
                                                                                style={{
                                                                                    // background: "#F07227",
                                                                                    borderRadius: "5px",
                                                                                    width: "auto",
                                                                                    borderColor: "grey",
                                                                                    color: "black",
                                                                                    border: "none"
                                                                                }}
                                                                                onClick={() => {
                                                                                    setCommentText("")
                                                                                    setCommentBoxFocused(false)
                                                                                }}
                                                                            >
                                                                                <span>Cancel</span>
                                                                            </Button>
                                                                        </div>
                                                                    </div>} */}
                                                                    {commentBoxFocused && <div ref={editorRef} style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                                                       
                                                                    <ReactQuillMention allOrgUsersName={allOrgUsersName} onChange={quillTextChange} commentText={commentText} placeholder={"comment..."}/>
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
                                                                                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
                                                                                fontSize: "14px",
                                                                                fontWeight: 400,
                                                                                justifyContent: "flex-start",
                                                                                lineHeight: "20px",
                                                                                margin: "0px",
                                                                                padding: "12px 0px",
                                                                                textAlign: "start"
                                                                            }}
                                                                        >
                                                                            <Button
                                                                                variant="contained"
                                                                                style={{
                                                                                    background: "#F07227",
                                                                                    borderRadius: "5px",
                                                                                    width: "auto",
                                                                                }}
                                                                                onClick={() => {
                                                                                    addComment()
                                                                                    setCommentBoxFocused(false)
                                                                                }}
                                                                            >
                                                                              <span className="text-capitalize">Save</span>
                                                                            </Button>

                                                                            <Button
                                                                                variant="outlined"
                                                                                style={{
                                                                                    // background: "#F07227",
                                                                                    borderRadius: "5px",
                                                                                    width: "auto",
                                                                                    borderColor: "grey",
                                                                                    color: "black",
                                                                                    border: "none"
                                                                                }}
                                                                                onClick={() => {
                                                                                    setCommentText("")
                                                                                    setSelectedFiles({ key: "files", value: []})
                                                                                    setCommentBoxFocused(false)
                                                                                }}
                                                                            >
                                                                                <span className="text-capitalize">Cancel</span>
                                                                            </Button>
                                                                            <AttachedFile
                                                                            selectedMedia={selectedMedia}
                                                                            />
                                                                        </div>
                                                                        <SelectedFilesName
                                                                            setSelectedFiles={setSelectedFiles}
                                                                            selectedFiles={selectedFiles}
                                                                        />
                                                                    </div>}

                                                                </div>

                                                            </div>
                                                        </div>
                                                    </Box>
                                                    <Box role="tabpanel" hidden={value !== 1}>
                                                        <HistoryDetails workOrderId={requirementData?.workOrderId} />
                                                    </Box>
                                                    {/* <Box role="tabpanel" hidden={value !== 3}>
                                                        Item four Content
                                                    </Box> */}
                                                </Box>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                aria-orientation="vertical"
                                data-component-selector="jira-issue-view-common-component-resize-handle"
                                data-testid="flex-resizer.ui.handle.resizer"
                                role="separator"
                                style={{
                                    '--_1o4cubd': 'translate3d(-50%, 0, 0)',
                                    '--_1ravlqm': 'var(--c-, )',
                                    alignSelf: 'stretch',
                                    cursor: 'ew-resize',
                                    display: 'flex',
                                    flexGrow: '0',
                                    flexShrink: '0',
                                    justifyContent: 'center',
                                    left: '0px',
                                    margin: '0px',
                                    padding: '0px',
                                    width: 'var(--ds-space-300,24px)'
                                }}
                                tabIndex="0"
                            >
                                <div
                                    style={{
                                        alignSelf: 'stretch',
                                        animationDuration: '0s',
                                        animationName: 'kowt20h',
                                        animationTimingFunction: 'ease-in-out',
                                        background: 'var(--ds-border-focused,#2684ff)',
                                        margin: '0px',
                                        opacity: '0',
                                        padding: '0px',
                                        position: 'relative',
                                        transition: 'background 0.5s ease 0s',
                                        width: '2px'
                                    }}
                                >
                                    <div
                                        data-testid="flex-resizer.ui.handle.resize-icon"
                                        style={{
                                            animationDuration: '0s',
                                            animationName: 'k1mczlc',
                                            animationTimingFunction: 'ease-in-out',
                                            background: 'var(--ds-surface,#fff)',
                                            borderRadius: '50%',
                                            boxShadow: 'var(--ds-shadow-overlay,0 0 0 1px #091e4214,0 2px 4px 1px #091e4214)',
                                            height: '24px',
                                            left: 'var(--ds-space-negative-150,-9pt)',
                                            margin: '0px',
                                            opacity: '0',
                                            padding: '0px',
                                            position: 'absolute',
                                            top: 'var(--ds-space-400,2pc)',
                                            width: '24px'
                                        }}
                                    >
                                        <span
                                            aria-hidden="true"
                                            data-testid="flex-resizer.ui.handle.chevron-left"
                                            style={{
                                                '--icon-primary-color': 'currentColor',
                                                '--icon-secondary-color': 'var(--ds-surface, #FFFFFF)',
                                                display: 'inline-block',
                                                flexShrink: '0',
                                                height: '24px',
                                                lineHeight: '1',
                                                width: '24px'
                                            }}
                                        >
                                            <svg
                                                height="24"
                                                role="presentation"
                                                style={{
                                                    color: 'var(--icon-primary-color)',
                                                    fill: 'var(--icon-secondary-color)',
                                                    height: '24px',
                                                    maxHeight: '100%',
                                                    maxWidth: '100%',
                                                    overflow: 'hidden',
                                                    verticalAlign: 'bottom',
                                                    width: '24px'
                                                }}
                                                viewBox="0 0 24 24"
                                                width="24"
                                            >
                                                <path
                                                    d="M13.706 9.698a.988.988 0 000-1.407 1.01 1.01 0 00-1.419 0l-2.965 2.94a1.09 1.09 0 000 1.548l2.955 2.93a1.01 1.01 0 001.42 0 .988.988 0 000-1.407l-2.318-2.297 2.327-2.307z"
                                                    fill="currentColor"
                                                    fillRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div
                                data-testid="issue.views.issue-details.issue-layout.container-right"
                                style={{
                                    height: '100%',
                                    boxSizing: 'border-box',
                                    flex: '0 1 calc(34.8758% + 12px)',
                                    margin: '0px',
                                    minWidth: 'max(calc((100% - var(--_8gjczv))/2 + var(--_xhypko)),var(--_xhypko))',
                                    outlineColor: 'currentcolor',
                                    outlineWidth: 'medium',
                                    // overflowX: '',
                                    overflowY: 'auto',
                                    paddingBottom: '0px',
                                    paddingLeft: '0px',
                                    paddingRight: 'max(calc((100% - var(--_8gjczv))/2),0px)',
                                    paddingTop: '0px',
                                    transition: 'min-width 0.15s ease 0s'
                                }}
                                tabIndex="0"
                            >
                                <div
                                    data-component-selector="jira.issue-view.issue-details.full-size-mode-column"
                                    data-testid="issue.views.issue-details.issue-layout.right-most-column"
                                    issuemaxwidth="1680"
                                    style={{
                                        margin: '0px',
                                        outlineColor: 'currentcolor',
                                        outlineWidth: 'medium',
                                        paddingBottom: 'var(--ds-space-400,2pc)',
                                        paddingLeft: 'var(--ds-space-0,0)',
                                        paddingRight: 'var(--ds-space-300,24px)',
                                        paddingTop: 'var(--ds-space-250,20px)'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            maxHeight: '2pc',
                                            position: "sticky",
                                            top: 0,
                                            zIndex: "100",
                                            backgroundColor: "white",
                                        }}
                                    >

                                        <div
                                            style={{
                                                flexShrink: '0',
                                                margin: '0px',
                                                padding: '0px'
                                            }}
                                        >
                                            {/* <div
                                                role="presentation"
                                                style={{
                                                    margin: '0px',
                                                    padding: '0px',
                                                    marginBottom: "10px"
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        WebkitBoxFlex: '0',
                                                        alignSelf: 'center',
                                                        display: 'flex',
                                                        flexGrow: '0',
                                                        flexShrink: '0',
                                                        fontSize: '0px',
                                                        lineHeight: '0',
                                                        margin: '0px 2px',
                                                        opacity: '1',
                                                        transition: 'opacity 0.3s ease 0s'
                                                    }}
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        style={{
                                                            display: 'inline-block',
                                                            flexShrink: '0',
                                                            height: '24px',
                                                            lineHeight: '1',
                                                            width: '24px'
                                                        }}
                                                        onClick={comingSoonNotify}
                                                    >
                                                        <svg
                                                            height="24"
                                                            role="presentation"
                                                            style={{
                                                                color: 'var(--icon-primary-color)',
                                                                fill: 'var(--icon-secondary-color)',
                                                                height: '24px',
                                                                maxHeight: '100%',
                                                                maxWidth: '100%',
                                                                overflow: 'hidden',
                                                                verticalAlign: 'bottom',
                                                                width: '24px'
                                                            }}
                                                            viewBox="0 0 24 24"
                                                            width="24"
                                                        >
                                                            <g
                                                                fill="currentColor"
                                                                fillRule="evenodd"
                                                            >
                                                                <path
                                                                    d="M6 15a3 3 0 100-6 3 3 0 000 6zm0-2a1 1 0 110-2 1 1 0 010 2zm12-4a3 3 0 100-6 3 3 0 000 6zm0-2a1 1 0 110-2 1 1 0 010 2zm0 14a3 3 0 100-6 3 3 0 000 6zm0-2a1 1 0 110-2 1 1 0 010 2z"
                                                                    fillRule="nonzero"
                                                                />
                                                                <path d="M7 13.562l8.66 5 1-1.732-8.66-5z">
                                                                </path>
                                                                <path d="M7 10.83l1 1.732 8.66-5-1-1.732z">
                                                                </path>
                                                            </g>
                                                        </svg>
                                                    </span>
                                                </span>
                                            </div> */}
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            margin: '0px',
                                            padding: '0px',
                                            visibility: 'visible'
                                        }}
                                    >
                                        <div
                                            data-testid="issue.views.issue-base.context.status-and-approvals-wrapper.status-and-approval"
                                            style={{
                                                margin: '0px',
                                                padding: '0px'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    margin: '0px',
                                                    paddingBottom: '0px',
                                                    paddingLeft: '0px',
                                                    paddingRight: '0px',
                                                    paddingTop: 'var(--ds-space-150,9pt)'
                                                }}
                                            >
                                                <div
                                                    data-testid="issue.views.issue-base.foundation.status.status-field-wrapper"
                                                    style={{
                                                        marginBottom: '0px',
                                                        marginLeft: '0px',
                                                        marginRight: 'var(--ds-space-100,8px)',
                                                        marginTop: '0px',
                                                        overflow: 'hidden',
                                                        paddingBottom: 'var(--ds-space-100,8px)',
                                                        paddingLeft: '0px',
                                                        paddingRight: '0px',
                                                        paddingTop: '0px',
                                                        width: "auto",
                                                        minWidth: "140px",
                                                    }}
                                                >
                                                    {/* 
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={10}
                                                        // onChange={handleChange}
                                                        style={{
                                                            WebkitBoxAlign: 'baseline',
                                                            WebkitBoxPack: 'center',
                                                            alignItems: 'baseline',
                                                            borderRadius: 'var(--ds-border-radius, 3px)',
                                                            borderWidth: '0px',
                                                            boxSizing: 'border-box',
                                                            cursor: 'pointer',
                                                            display: 'inline-flex',
                                                            fontWeight: '600',
                                                            height: '2.28571em',
                                                            justifyContent: 'center',
                                                            lineHeight: '2.28571em',
                                                            maxWidth: '100%',
                                                            padding: '0px 10px',
                                                            position: 'relative',
                                                            textAlign: 'center',
                                                            transition: 'background 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s',
                                                            verticalAlign: 'middle',
                                                            whiteSpace: 'nowrap',
                                                            width: '100%'
                                                        }}
                                                    >
                                                        <MenuItem value={10}>Ten</MenuItem>
                                                        <MenuItem value={20}>Twenty</MenuItem>
                                                        <MenuItem value={30}>Thirty</MenuItem>
                                                    </Select> */}

                                                    <InputViewTextField
                                                        type="statusSelect"
                                                        text={requirementData?.status}
                                                        handleUpdateData={(e) => onUpdateTicketData({ key: "status", value: e.target.value })}
                                                        options={requirementData?.mode === 'ai' ? workOrderStatusListForAi : workOrderStatusList && workOrderStatusList.length > 0 ? workOrderStatusList : []}
                                                        onChange={(e) => setRequirementData({ ...requirementData, status: e.target.value })}
                                                        style={{
                                                            alignItems: 'baseline',
                                                            borderRadius: '3px',
                                                            borderWidth: '0px',
                                                            boxSizing: 'border-box',
                                                            cursor: 'pointer',
                                                            display: 'inline-flex',
                                                            fontWeight: '600',
                                                            maxWidth: '100%',
                                                            position: 'relative',
                                                            textAlign: 'center',
                                                            transition: 'background 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s',
                                                            verticalAlign: 'middle',
                                                            whiteSpace: 'nowrap',
                                                            width: '100%'
                                                        }}
                                                    />

                                                    {/* 
                                                    <button
                                                        aria-expanded="false"
                                                        aria-label="In Progress - Change status"
                                                        data-testid="issue-field-status.ui.status-view.status-button.status-button"
                                                        id="issue.fields.status-view.status-button"
                                                        style={{
                                                            WebkitBoxAlign: 'baseline',
                                                            WebkitBoxPack: 'center',
                                                            alignItems: 'baseline',
                                                            borderRadius: 'var(--ds-border-radius, 3px)',
                                                            borderWidth: '0px',
                                                            boxSizing: 'border-box',
                                                            cursor: 'pointer',
                                                            display: 'inline-flex',
                                                            fontWeight: '600',
                                                            height: '2.28571em',
                                                            justifyContent: 'center',
                                                            lineHeight: '2.28571em',
                                                            maxWidth: '100%',
                                                            padding: '0px 10px',
                                                            position: 'relative',
                                                            textAlign: 'center',
                                                            transition: 'background 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s',
                                                            verticalAlign: 'middle',
                                                            whiteSpace: 'nowrap',
                                                            width: '100%'
                                                        }}
                                                        tabIndex="0"
                                                        type="button"
                                                    >
                                                        <span
                                                            style={{
                                                                WebkitBoxFlex: '1',
                                                                flexGrow: '1',
                                                                flexShrink: '1',
                                                                margin: '0px 2px',
                                                                opacity: '1',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                transition: 'opacity 0.3s ease 0s',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {requirementData?.status}
                                                        </span>
                                                        <span
                                                            style={{
                                                                WebkitBoxFlex: '0',
                                                                alignSelf: 'center',
                                                                display: 'flex',
                                                                flexGrow: '0',
                                                                flexShrink: '0',
                                                                fontSize: '0px',
                                                                lineHeight: '0',
                                                                margin: '0px 2px',
                                                                marginInlineEnd: 'var(--ds-space-negative-025, -2px)',
                                                                opacity: '1',
                                                                transition: 'opacity 0.3s ease 0s'
                                                            }}
                                                        >
                                                            <span
                                                                aria-hidden="true"
                                                                style={{
                                                                    '--icon-primary-color': 'currentColor',
                                                                    '--icon-secondary-color': 'var(--ds-surface, #FFFFFF)',
                                                                    display: 'inline-block',
                                                                    flexShrink: '0',
                                                                    lineHeight: '1'
                                                                }}
                                                            >
                                                                <svg
                                                                    height="24"
                                                                    role="presentation"
                                                                    style={{
                                                                        color: 'var(--icon-primary-color)',
                                                                        fill: 'var(--icon-secondary-color)',
                                                                        maxHeight: '100%',
                                                                        maxWidth: '100%',
                                                                        overflow: 'hidden',
                                                                        verticalAlign: 'bottom'
                                                                    }}
                                                                    viewBox="0 0 24 24"
                                                                    width="24"
                                                                >
                                                                    <path
                                                                        d="M8.292 10.293a1.009 1.009 0 000 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 000-1.419.987.987 0 00-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 00-1.406 0z"
                                                                        fill="currentColor"
                                                                        fillRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        </span>
                                                    </button> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                margin: '0px',
                                                padding: '0px',
                                                position: 'relative'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'block',
                                                    margin: '0px',
                                                    padding: '0px',
                                                    position: 'absolute',
                                                    width: '100%'
                                                }}
                                            >
                                            </div>
                                        </div>
                                        <div
                                            data-testid="issue-view-layout-templates-views.ui.context.visible-hidden.ui.context-items"
                                            style={{
                                                margin: '0px',
                                                padding: '0px'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    margin: '0px',
                                                    padding: '0px'
                                                }}
                                            />
                                            <div
                                                data-component-selector="jira-issue-view-layout-templates-pinned-fields-banner-with-grouping-pinned-field-highlight-wrapper"
                                                style={{
                                                    margin: '0px',
                                                    padding: '0px'
                                                }}
                                            >
                                                <div
                                                    data-testid="issue-view-layout-templates-views.ui.context.visible-hidden.ui.primary-items"
                                                    style={{
                                                        margin: '0px',
                                                        padding: '0px'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            margin: '0px',
                                                            padding: '0px'
                                                        }}
                                                    >
                                                        <div
                                                            data-testid="issue-view-layout-templates-views.ui.context.visible-hidden.ui.context-group.container.details-group"
                                                            style={{
                                                                marginBottom: 'var(--ds-space-100,8px)',
                                                                marginLeft: '0px',
                                                                marginRight: '0px',
                                                                marginTop: '0px',
                                                                padding: '0px'
                                                            }}
                                                        >
                                                            <details
                                                                open
                                                                style={{
                                                                    '--_ahoyl5': '1px solid var(--ds-border, #DFE1E6)',
                                                                    boxSizing: 'border-box',
                                                                    display: 'block',
                                                                    marginBottom: 'var(--ds-space-100,8px)'
                                                                }}
                                                            >
                                                                <summary
                                                                    aria-label="Details"
                                                                    data-testid="issue-view-layout-group.common.ui.collapsible-group-factory.details-group"
                                                                    stickyheaderposition="32"
                                                                    style={{
                                                                        '--_122c6ee': '32px',
                                                                        '--_7zohb2': '98',
                                                                        '--_ahoyl5': '1px solid var(--ds-border, #DFE1E6)',
                                                                        alignItems: 'center',
                                                                        backgroundColor: 'var(--ds-surface-overlay,#fff)',
                                                                        border: 'var(--_ahoyl5)',
                                                                        borderRadius: '4px 4px 0px 0px',
                                                                        boxSizing: 'border-box',
                                                                        display: 'flex',
                                                                        height: '3pc',
                                                                        padding: 'var(--ds-space-100,8px) var(--ds-space-150,9pt) var(--ds-space-100,8px) var(--ds-space-150,9pt)',
                                                                        position: 'sticky',
                                                                        top: 'var(--_122c6ee)',
                                                                        zIndex: 'var(--_7zohb2)'
                                                                    }}
                                                                    tabIndex="0"
                                                                >
                                                                    <strong
                                                                        data-component-selector="jira-issue-view-layout-group-common-ui-title-styled"
                                                                        data-testid="issue-view-layout-group.common.ui.collapsible-group-factory.title"
                                                                        style={{
                                                                            color: 'var(--ds-text-subtle,#44546f)',
                                                                            flexShrink: '0',
                                                                            fontSize: '14px',
                                                                            fontWeight: '500',
                                                                            maxWidth: '60%',
                                                                            overflow: 'hidden',
                                                                            paddingRight: 'var(--ds-space-050,4px)',
                                                                            textOverflow: 'ellipsis',
                                                                            whiteSpace: 'nowrap'
                                                                        }}
                                                                    >
                                                                        Details
                                                                    </strong>
                                                                    <div
                                                                        style={{
                                                                            display: 'flex',
                                                                            margin: '0px',
                                                                            padding: '0px'
                                                                        }}
                                                                    >
                                                                        <div
                                                                            role="presentation"
                                                                            style={{
                                                                                margin: '0px',
                                                                                padding: '0px'
                                                                            }}
                                                                        >
                                                                        </div>
                                                                        <div
                                                                            style={{
                                                                                marginBottom: 'var(--ds-space-negative-050,-4px)',
                                                                                marginLeft: '0px',
                                                                                marginRight: '0px',
                                                                                marginTop: '0px',
                                                                                minWidth: '24px',
                                                                                padding: '0px'
                                                                            }}
                                                                        >
                                                                            <span
                                                                                aria-hidden="true"
                                                                                style={{
                                                                                    '--icon-primary-color': 'var(--ds-icon-subtle, #42526E)',
                                                                                    '--icon-secondary-color': 'var(--ds-surface, #FFFFFF)',
                                                                                    display: 'inline-block',
                                                                                    flexShrink: '0',
                                                                                    lineHeight: '1'
                                                                                }}
                                                                            >
                                                                                <svg
                                                                                    height="24"
                                                                                    role="presentation"
                                                                                    style={{
                                                                                        color: 'var(--icon-primary-color)',
                                                                                        fill: 'var(--icon-secondary-color)',
                                                                                        maxHeight: '100%',
                                                                                        maxWidth: '100%',
                                                                                        overflow: 'hidden',
                                                                                        verticalAlign: 'bottom'
                                                                                    }}
                                                                                    viewBox="0 0 24 24"
                                                                                    width="24"
                                                                                >
                                                                                    <path
                                                                                        d="M11.221 9.322l-2.929 2.955a1.009 1.009 0 000 1.419.986.986 0 001.405 0l2.298-2.317 2.307 2.327a.989.989 0 001.407 0 1.01 1.01 0 000-1.419l-2.94-2.965A1.106 1.106 0 0011.991 9c-.279 0-.557.107-.77.322z"
                                                                                        fill="currentColor"
                                                                                        fillRule="evenodd"
                                                                                    >
                                                                                    </path>
                                                                                </svg>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </summary>
                                                                <div
                                                                    style={{
                                                                        borderBottom: 'var(--_ahoyl5)',
                                                                        borderBottomLeftRadius: '4px',
                                                                        borderBottomRightRadius: '4px',
                                                                        borderLeft: 'var(--_ahoyl5)',
                                                                        borderRight: 'var(--_ahoyl5)',
                                                                        boxSizing: 'border-box',
                                                                        margin: '0px',
                                                                        padding: '0px'
                                                                    }}
                                                                >
                                                                    <div
                                                                        data-testid="issue-view-layout-templates-views.ui.context.visible-hidden.ui.context-group.details-group"
                                                                        style={{
                                                                            backgroundColor: 'rgb(255, 255, 255)',
                                                                            color: 'rgb(23, 43, 77)',
                                                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                                                                            fontSize: '14px',
                                                                            fontWeight: '400',
                                                                            lineHeight: '20px',
                                                                            margin: '0px',
                                                                            padding: '0px',
                                                                            textAlign: 'start'
                                                                        }}
                                                                    >

                                                                        {taskUsersList.map(obj => (
                                                                            <div
                                                                                style={{
                                                                                    flex: '1 1 0%',
                                                                                    margin: '0px',
                                                                                    padding: '0px',
                                                                                    position: 'relative'
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    style={{
                                                                                        margin: '0px',
                                                                                        padding: '0px',
                                                                                        width: '100%'
                                                                                    }}
                                                                                >
                                                                                    <div
                                                                                        className="jira-issue-field-heading-field-wrapper"
                                                                                        data-testid="issue.views.issue-base.context.number.customfield_10037">
                                                                                        <div
                                                                                            data-testid="issue-field-heading-styled-field-heading.customfield_10037"
                                                                                            style={{
                                                                                                boxSizing: 'border-box',
                                                                                                flexGrow: '1',
                                                                                                lineHeight: '1',
                                                                                                margin: '0px',
                                                                                                maxWidth: '170px',
                                                                                                minWidth: '90pt',
                                                                                                paddingBottom: '0px',
                                                                                                paddingLeft: '0px',
                                                                                                paddingRight: 'var(--ds-space-300,24px)',
                                                                                                paddingTop: 'var(--ds-space-100,8px)',
                                                                                                position: 'relative',
                                                                                                width: '40%'
                                                                                            }}
                                                                                        >
                                                                                            <h2
                                                                                                data-component-selector="jira-issue-field-heading-field-heading-title"
                                                                                                style={{
                                                                                                    boxSizing: 'border-box',
                                                                                                    color: '#172B4D',
                                                                                                    fontWeight: 'var(--ds-font-weight-medium, 500)',
                                                                                                    letterSpacing: '-0.01em',
                                                                                                    lineHeight: '1.16667',
                                                                                                    marginTop: '0px',
                                                                                                    padding: '0px',
                                                                                                    verticalAlign: 'bottom'
                                                                                                }}
                                                                                            >
                                                                                                {obj.label}
                                                                                            </h2>
                                                                                        </div>
                                                                                        <div
                                                                                            style={{
                                                                                                '--_z7gtgw': 'var(--c-, )',
                                                                                                boxSizing: 'border-box',
                                                                                                flexGrow: '1',
                                                                                                margin: '0px',
                                                                                                padding: '0px',
                                                                                                width: '60%'
                                                                                            }}
                                                                                        >
                                                                                            <div
                                                                                                style={{
                                                                                                    marginBottom: '0px',
                                                                                                    marginLeft: 'var(--ds-space-negative-100,-8px)',
                                                                                                    marginRight: '0px',
                                                                                                    marginTop: 'var(--ds-space-negative-100,-8px)',
                                                                                                    paddingBottom: '0px',
                                                                                                    paddingLeft: '0px',
                                                                                                    paddingRight: 'var(--ds-space-100,8px)',
                                                                                                    paddingTop: '0px'
                                                                                                }}
                                                                                            >
                                                                                                <div
                                                                                                    style={{
                                                                                                        margin: '0px',
                                                                                                        marginBlockStart: 'var(--ds-space-100, 8px)',
                                                                                                        padding: '0px'
                                                                                                    }}
                                                                                                >
                                                                                                    <div
                                                                                                        style={{
                                                                                                            lineHeight: '1',
                                                                                                            margin: '0px',
                                                                                                            padding: '0px'
                                                                                                        }}
                                                                                                    >

                                                                                                        <div
                                                                                                            style={{
                                                                                                                boxSizing: 'border-box',
                                                                                                                width: "100%",
                                                                                                                maxWidth: '100%',
                                                                                                                minHeight: '32px',
                                                                                                                color:"black"
                                                                                                            }}
                                                                                                        >
                                                                                                            <InputViewTextField
                                                                                                                type="select"
                                                                                                                text={requirementData?.[obj.key]}
                                                                                                                handleUpdateData={(e) => onUpdateTicketData({ key: obj.key, value: e.target.value })}
                                                                                                                options={allOrgUsers}
                                                                                                                onChange={(e) => setRequirementData({ ...requirementData, [obj.key]: e.target.value })}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        ))}
                                                                             
                                                                        {
                                                                            taskHoursList && taskHoursList.length > 0 && taskHoursList
                                                                            .filter(obj => obj.key !== "developer" && obj.key !== "tester").map((obj) => (
                                                                                <div
                                                                                    style={{
                                                                                        flex: '1 1 0%',
                                                                                        margin: '0px',
                                                                                        padding: '0px',
                                                                                        position: 'relative'
                                                                                    }}
                                                                                >
                                                                                    <div
                                                                                        style={{
                                                                                            margin: '0px',
                                                                                            padding: '0px',
                                                                                            width: '100%'
                                                                                        }}
                                                                                    >
                                                                                        <div
                                                                                            className="jira-issue-field-heading-field-wrapper"
                                                                                            data-testid="issue.views.issue-base.context.number.customfield_10037">
                                                                                            <div
                                                                                                data-testid="issue-field-heading-styled-field-heading.customfield_10037"
                                                                                                style={{
                                                                                                    boxSizing: 'border-box',
                                                                                                    flexGrow: '1',
                                                                                                    lineHeight: '1',
                                                                                                    margin: '0px',
                                                                                                    maxWidth: '170px',
                                                                                                    minWidth: '90pt',
                                                                                                    paddingBottom: '0px',
                                                                                                    paddingLeft: '0px',
                                                                                                    paddingRight: 'var(--ds-space-300,24px)',
                                                                                                    paddingTop: 'var(--ds-space-100,8px)',
                                                                                                    position: 'relative',
                                                                                                    width: '40%'
                                                                                                }}
                                                                                            >
                                                                                                <h2
                                                                                                    data-component-selector="jira-issue-field-heading-field-heading-title"
                                                                                                    style={{
                                                                                                        boxSizing: 'border-box',
                                                                                                        color: '#172B4D',
                                                                                                        // display: '20px',
                                                                                                        // fontSize: '1.71429em',
                                                                                                        fontWeight: 'var(--ds-font-weight-medium, 500)',
                                                                                                        letterSpacing: '-0.01em',
                                                                                                        lineHeight: '1.16667',
                                                                                                        marginTop: '0px',
                                                                                                        padding: '0px',
                                                                                                        verticalAlign: 'bottom'
                                                                                                    }}
                                                                                                >
                                                                                                    {obj.label}
                                                                                                </h2>
                                                                                            </div>
                                                                                            <div
                                                                                                style={{
                                                                                                    '--_z7gtgw': 'var(--c-, )',
                                                                                                    boxSizing: 'border-box',
                                                                                                    flexGrow: '1',
                                                                                                    margin: '0px',
                                                                                                    padding: '0px',
                                                                                                    width: '60%'
                                                                                                }}
                                                                                            >
                                                                                                <div
                                                                                                    style={{
                                                                                                        marginBottom: '0px',
                                                                                                        marginLeft: 'var(--ds-space-negative-100,-8px)',
                                                                                                        marginRight: '0px',
                                                                                                        marginTop: 'var(--ds-space-negative-100,-8px)',
                                                                                                        paddingBottom: '0px',
                                                                                                        paddingLeft: '0px',
                                                                                                        paddingRight: 'var(--ds-space-100,8px)',
                                                                                                        paddingTop: '0px'
                                                                                                    }}
                                                                                                >
                                                                                                    <div
                                                                                                        style={{
                                                                                                            margin: '0px',
                                                                                                            marginBlockStart: 'var(--ds-space-100, 8px)',
                                                                                                            padding: '0px'
                                                                                                        }}
                                                                                                    >
                                                                                                        <div
                                                                                                            style={{
                                                                                                                lineHeight: '1',
                                                                                                                margin: '0px',
                                                                                                                padding: '0px'
                                                                                                            }}
                                                                                                        >

                                                                                                            <div
                                                                                                                style={{
                                                                                                                    boxSizing: 'border-box',
                                                                                                                    width: "100%",
                                                                                                                    maxWidth: '100%',
                                                                                                                    minHeight: '32px',
                                                                                                                }}
                                                                                                            >
                                                                                                                <InputViewTextField
                                                                                                                    text={requirementData?.taskHours[obj.key]}
                                                                                                                    onChange={(e) => setRequirementData({ ...requirementData, taskHours: { ...requirementData.taskHours, [obj.key]: e.target.value } })}
                                                                                                                    handleUpdateData={(e) => {
                                                                                                                        if (taskData.taskHours[obj.key] !== e.target.value)
                                                                                                                            onUpdateTicketData({ key: "taskHours", value: { ...requirementData.taskHours, [obj.key]: e.target.value } })
                                                                                                                    }}
                                                                                                                />
                                                                                                                {/* <div
                                                                                                                data-component-selector="jira-issue-field-inline-edit-read-view-container"
                                                                                                                style={{
                                                                                                                    left: 'var(--ds-space-075,6px)',
                                                                                                                    margin: '0px',
                                                                                                                    padding: '0px',
                                                                                                                    position: 'relative',
                                                                                                                    wordBreak: 'break-word'
                                                                                                                }}
                                                                                                            >
                                                                                                                {requirementData?.taskHours['estAnlHrs']}
                                                                                                            </div> */}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                        }
                                                                        {/* <TaskIssueField label={"Estimates Approved"} value={"Coming soon"} />
                                                                        <TaskIssueField label={"Billable(Yes/No)"} value={"Coming soon"} />
                                                                        <TaskIssueField label={"Dev Complete"} value={"Coming soon"} />
                                                                        <TaskIssueField label={"Code Review Completion"} value={"Coming soon"} />
                                                                        <TaskIssueField label={"Qa Complete"} value={"Coming soon"} />
                                                                        <TaskIssueField label={"Release Date"} value={"Coming soon"} /> */}
                                                                    { taskHoursList && taskHoursList.length > 0 && taskHoursList
                                                                            .filter(obj => obj.key === "developer").map((obj) =>(
                                                                        <div
                                                                            style={{
                                                                                flex: '1 1 0%',
                                                                                margin: '0px',
                                                                                padding: '0px',
                                                                                position: 'relative'
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    margin: '0px',
                                                                                    padding: '0px',
                                                                                    width: '100%'
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    className="jira-issue-field-heading-field-wrapper"
                                                                                    data-testid="issue.views.issue-base.context.number.customfield_10037">
                                                                                    <div
                                                                                        data-testid="issue-field-heading-styled-field-heading.customfield_10037"
                                                                                        style={{
                                                                                            boxSizing: 'border-box',
                                                                                            flexGrow: '1',
                                                                                            lineHeight: '1',
                                                                                            margin: '0px',
                                                                                            maxWidth: '170px',
                                                                                            minWidth: '90pt',
                                                                                            paddingBottom: '0px',
                                                                                            paddingLeft: '0px',
                                                                                            paddingRight: 'var(--ds-space-300,24px)',
                                                                                            paddingTop: 'var(--ds-space-100,8px)',
                                                                                            position: 'relative',
                                                                                            width: '40%'
                                                                                        }}
                                                                                    >
                                                                                        <h2
                                                                                            data-component-selector="jira-issue-field-heading-field-heading-title"
                                                                                            style={{
                                                                                                boxSizing: 'border-box',
                                                                                                color: '#172B4D',
                                                                                                // display: '20px',
                                                                                                // fontSize: '1.71429em',
                                                                                                fontWeight: 'var(--ds-font-weight-medium, 500)',
                                                                                                letterSpacing: '-0.01em',
                                                                                                lineHeight: '1.16667',
                                                                                                marginTop: '0px',
                                                                                                padding: '0px',
                                                                                                verticalAlign: 'bottom'
                                                                                            }}
                                                                                        >
                                                                                            {obj.label}
                                                                                        </h2>
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            '--_z7gtgw': 'var(--c-, )',
                                                                                            boxSizing: 'border-box',
                                                                                            flexGrow: '1',
                                                                                            margin: '0px',
                                                                                            padding: '0px',
                                                                                            width: '60%'
                                                                                        }}
                                                                                    >
                                                                                        <div
                                                                                            style={{
                                                                                                marginBottom: '0px',
                                                                                                marginLeft: 'var(--ds-space-negative-100,-8px)',
                                                                                                marginRight: '0px',
                                                                                                marginTop: 'var(--ds-space-negative-100,-8px)',
                                                                                                paddingBottom: '0px',
                                                                                                paddingLeft: '0px',
                                                                                                paddingRight: 'var(--ds-space-100,8px)',
                                                                                                paddingTop: '0px'
                                                                                            }}
                                                                                        >
                                                                                            <div
                                                                                                style={{
                                                                                                    margin: '0px',
                                                                                                    marginBlockStart: 'var(--ds-space-100, 8px)',
                                                                                                    padding: '0px'
                                                                                                }}
                                                                                            >
                                                                                                <div
                                                                                                    style={{
                                                                                                        lineHeight: '1',
                                                                                                        margin: '0px',
                                                                                                        padding: '0px'
                                                                                                    }}
                                                                                                >

                                                                                                    <div
                                                                                                        style={{
                                                                                                            boxSizing: 'border-box',
                                                                                                            width: "100%",
                                                                                                            maxWidth: '100%',
                                                                                                            minHeight: '32px',
                                                                                                        }}
                                                                                                    >
                                                                                                        <InputViewTextField
                                                                                                            type="select"
                                                                                                            text={requirementData?.developer}
                                                                                                            handleUpdateData={(e) => onUpdateTicketData({ key: "developer", value: e.target.value })} options={allOrgUsers}
                                                                                                            onChange={(e) => setRequirementData({ ...requirementData, developer: e.target.value })}
                                                                                                        />
                                                                                                        {/* <ReactQuill
                                                                                                            style={{ border: 'unset' }}
                                                                                                            className="ReactQuill"
                                                                                                            theme="snow"
                                                                                                            value={taskData.description}
                                                                                                            readOnly={true}
                                                                                                            placeholder="Compose an epic..."
                                                                                                            modules={{
                                                                                                                toolbar: [], // Empty array to remove all toolbar options
                                                                                                            }}
                                                                                                        /> */}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>))}

                                                                        { taskHoursList && taskHoursList.length > 0 && taskHoursList
                                                                            .filter(obj => obj.key === "tester").map((obj) =>(
                                                                        <div
                                                                            style={{
                                                                                flex: '1 1 0%',
                                                                                margin: '0px',
                                                                                padding: '0px',
                                                                                position: 'relative'
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    margin: '0px',
                                                                                    padding: '0px',
                                                                                    width: '100%'
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    className="jira-issue-field-heading-field-wrapper"
                                                                                    data-testid="issue.views.issue-base.context.number.customfield_10037">
                                                                                    <div
                                                                                        data-testid="issue-field-heading-styled-field-heading.customfield_10037"
                                                                                        style={{
                                                                                            boxSizing: 'border-box',
                                                                                            flexGrow: '1',
                                                                                            lineHeight: '1',
                                                                                            margin: '0px',
                                                                                            maxWidth: '170px',
                                                                                            minWidth: '90pt',
                                                                                            paddingBottom: '0px',
                                                                                            paddingLeft: '0px',
                                                                                            paddingRight: 'var(--ds-space-300,24px)',
                                                                                            paddingTop: 'var(--ds-space-100,8px)',
                                                                                            position: 'relative',
                                                                                            width: '40%'
                                                                                        }}
                                                                                    >
                                                                                        <h2
                                                                                            data-component-selector="jira-issue-field-heading-field-heading-title"
                                                                                            style={{
                                                                                                boxSizing: 'border-box',
                                                                                                color: '#172B4D',
                                                                                                fontWeight: 'var(--ds-font-weight-medium, 500)',
                                                                                                letterSpacing: '-0.01em',
                                                                                                lineHeight: '1.16667',
                                                                                                marginTop: '0px',
                                                                                                padding: '0px',
                                                                                                verticalAlign: 'bottom'
                                                                                            }}
                                                                                        >
                                                                                            {obj.label}
                                                                                        </h2>
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            '--_z7gtgw': 'var(--c-, )',
                                                                                            boxSizing: 'border-box',
                                                                                            flexGrow: '1',
                                                                                            margin: '0px',
                                                                                            padding: '0px',
                                                                                            width: '60%'
                                                                                        }}
                                                                                    >
                                                                                        <div
                                                                                            style={{
                                                                                                marginBottom: '0px',
                                                                                                marginLeft: 'var(--ds-space-negative-100,-8px)',
                                                                                                marginRight: '0px',
                                                                                                marginTop: 'var(--ds-space-negative-100,-8px)',
                                                                                                paddingBottom: '0px',
                                                                                                paddingLeft: '0px',
                                                                                                paddingRight: 'var(--ds-space-100,8px)',
                                                                                                paddingTop: '0px'
                                                                                            }}
                                                                                        >
                                                                                            <div
                                                                                                style={{
                                                                                                    margin: '0px',
                                                                                                    marginBlockStart: 'var(--ds-space-100, 8px)',
                                                                                                    padding: '0px'
                                                                                                }}
                                                                                            >
                                                                                                <div
                                                                                                    style={{
                                                                                                        lineHeight: '1',
                                                                                                        margin: '0px',
                                                                                                        padding: '0px'
                                                                                                    }}
                                                                                                >

                                                                                                    <div
                                                                                                        style={{
                                                                                                            boxSizing: 'border-box',
                                                                                                            width: "100%",
                                                                                                            maxWidth: '100%',
                                                                                                            minHeight: '32px',
                                                                                                        }}
                                                                                                    >
                                                                                                        <InputViewTextField
                                                                                                            type="select"
                                                                                                            text={requirementData?.tester}
                                                                                                            handleUpdateData={(e) => onUpdateTicketData({ key: "tester", value: e.target.value })} options={allOrgUsers}
                                                                                                            onChange={(e) => setRequirementData({ ...requirementData, tester: e.target.value })}
                                                                                                        />
                                                                                                        {/* <ReactQuill
                                                                                                            style={{ border: 'unset' }}
                                                                                                            className="ReactQuill"
                                                                                                            theme="snow"
                                                                                                            value={taskData.description}
                                                                                                            readOnly={true}
                                                                                                            placeholder="Compose an epic..."
                                                                                                            modules={{
                                                                                                                toolbar: [], // Empty array to remove all toolbar options
                                                                                                            }}
                                                                                                        /> */}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>))}


                                                                        {/* <TaskIssueField label={"Time Tracking"} value={"Coming soon"} /> */}
                                                                        <TaskIssueField
                                                                            label={"Priority"}
                                                                            value={requirementData?.priority}
                                                                            type="selectPriority"
                                                                            options={[{ label: "Highest", value: "highest" }, { label: "High", value: "high" }, { label: "Medium", value: "medium" }, { label: "Low", value: "low" }, { label: "Lowest", value: "lowest" }]}
                                                                            handleUpdateData={(e) => onUpdateTicketData({ key: "priority", value: e.target.value })}
                                                                            onChange={(e) => setRequirementData({ ...requirementData, priority: e.target.value })}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </details>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            data-testid="issue.views.issue-details.issue-layout.footnote"
                                            style={{
                                                alignItems: 'flex-start',
                                                display: 'flex',
                                                flexFlow: 'wrap',
                                                marginBottom: 'var(--ds-space-300,24px)',
                                                marginLeft: 'var(--ds-space-negative-100,-8px)',
                                                marginRight: '0px',
                                                marginTop: '0px',
                                                padding: '0px 0px 0px 10px',
                                                placeContent: 'stretch space-between'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    flex: '1 1 0%',
                                                    marginBottom: '0px',
                                                    marginLeft: '0px',
                                                    marginRight: 'var(--ds-space-200,1pc)',
                                                    marginTop: 'var(--ds-space-050,4px)',
                                                    paddingBottom: '0px',
                                                    paddingLeft: 'var(--ds-space-150,9pt)',
                                                    paddingRight: '0px',
                                                    paddingTop: '0px'
                                                }}
                                            >
                                                <div
                                                    data-testid="created-date.ui.read.meta-date"
                                                    style={{
                                                        display: 'flex',
                                                        marginBottom: '0px',
                                                        marginLeft: '0px',
                                                        marginRight: '0px',
                                                        marginTop: 'var(--ds-space-050,4px)',
                                                        padding: '0px'
                                                    }}
                                                >
                                                    <small
                                                        style={{
                                                            color: 'var(--ds-text-subtlest, var(--ds-text-subtlest, #6B778C))',
                                                            fontSize: '0.785714em',
                                                            fontWeight: '400',
                                                            lineHeight: '1.45455',
                                                            marginTop: '16px',
                                                            paddingTop: 'var(--ds-space-025,2px)',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        Created {" "}
                                                        <span role="presentation">
                                                            {formatDate(requirementData?.createdAt)}
                                                        </span>
                                                    </small>
                                                </div>
                                                <div
                                                    data-testid="updated-date.ui.read.meta-date"
                                                    style={{
                                                        display: 'flex',
                                                        marginBottom: '0px',
                                                        marginLeft: '0px',
                                                        marginRight: '0px',
                                                        marginTop: 'var(--ds-space-050,4px)',
                                                        padding: '0px'
                                                    }}
                                                >
                                                    <small
                                                        style={{
                                                            color: 'var(--ds-text-subtlest, var(--ds-text-subtlest, #6B778C))',
                                                            fontSize: '0.785714em',
                                                            fontWeight: '400',
                                                            lineHeight: '1.45455',
                                                            marginTop: '16px',
                                                            paddingTop: 'var(--ds-space-025,2px)',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        Updated {" "}
                                                        <span role="presentation">
                                                            {formatDate(requirementData?.updatedAt)}
                                                        </span>
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        data-testid="highlight-actions.ui.target.container.issue-layout-right.RP-191"
                                        style={{
                                            margin: '0px',
                                            padding: '0px',
                                            position: 'relative'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    );
}
export default WorkOrderDetails;
