import React, { useEffect, useState } from 'react';
import './createRepository.css'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input/Input';
import { Avatar, Box, Button, ButtonGroup, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import ComputerIcon from '@mui/icons-material/Computer';
import PersonIcon from '@mui/icons-material/Person';
import * as langChainApi from '../../api/langchain.api';
import * as ToolApi from '../../api/tool.api';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import CopyToClipboard from 'react-copy-to-clipboard';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { addTool } from '../../store/projectTool/userToolSlice';

const AiMessage = ({ message }) => {
    return (
        <div style={{ height: "auto", width: "auto", display: "flex", alignItems: "flex-end", margin: "20px 0" }}>
            <Avatar sx={{ bgcolor: "rgb(252, 221, 203)" }}>
                <ComputerIcon />
            </Avatar>
            <div style={{
                width: "fit-content",
                maxWidth: "75%",
                height: "auto",
                borderRadius: "10px 10px 10px 0",
                boxShadow: "2px 2px 6px 0 rgba(0, 0, 0, 0.4)",
                marginLeft: "10px",
                padding: "10px",
                background: "rgb(40, 79, 163)",
                color: "white",
                fontSize: "18px"
            }}>
                <span>{message}</span>
            </div>
        </div>
    )
}

const UserMessage = ({ value, onChange, type, disable, onKeyDown }) => {
    return (
        <div style={{ height: "auto", width: "auto", display: "flex", alignItems: "flex-end", margin: "20px 0" }}>
            <Avatar sx={{ bgcolor: "rgb(252, 221, 203)" }}>
                <PersonIcon />
            </Avatar>
            <Input
                name="Project Name"
                placeholder="Type your answer..."
                type={type}
                value={value}
                onChange={onChange}
                height={type === "text" ? "65px" : "auto"}
                disable={disable}
                onKeyDown={onKeyDown}
                style={{
                    width: "100%",
                    maxHeight: "199px",
                    borderRadius: "5px",
                    outline: "none",
                    padding: "15px",
                    background: "white",
                    border: "1px solid #DCDCDC",
                    marginLeft: "10px",
                    cursor: disable ? "not-allowed" : "text"
                }}
            />
        </div>
    )
}

function generateSessionId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `${hexadecimalString.split(".")[1]}_${timestamp}`;
}

const Controls = ({ zoomIn, zoomOut, resetTransform }) => (
    <div style={{ top: 0, margin: "10px" }}>
        <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button  onClick={() => zoomIn()} ><AddIcon /></Button>
            <Button  onClick={() => zoomOut()} ><RemoveIcon /></Button>
            <Button  onClick={() => resetTransform()}><CloseIcon /></Button>
        </ButtonGroup>
    </div>
);

const CreateRepository = () => {
    const { selectedProject } = useSelector((state) => state.orgDetails);
    const { userInfo } = useSelector((state) => state.user);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [projectName, setProjectName] = useState("");
    // const [projectNameSubmitted, setProjectNameSubmitted] = useState(false);
    const [userRequirement, setUserRequirement] = useState("");
    const [questionCount, setQuestionCount] = useState(0);
    const [allQnA, setAllQnA] = useState([]);
    const [gotProjectSummary, setGotProjectSummary] = useState(false);
    const [sessionId, setSessionId] = useState(generateSessionId());
    const [nextBtnLoading, setNextBtnLoading] = useState(false);
    const [continueBtnLoading, setContinueBtnLoading] = useState(false);
    const [userRequirementsSummary, setUserRequirementsSummary] = useState();
    const [flowchart, setFlowchart] = useState();
    const [generatedCode, setGeneratedCode] = useState();
    const [loadingFlowchart, setLoadingFlowchart] = useState(false);
    const [loadingCode, setLoadingCode] = useState(false);
    const [viewFlowChart, setViewFlowChart] = useState(false);
    const [viewGeneratedCode, setViewGeneratedCode] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [checkingFlow, setCheckingFlow] = useState(true);
    const [collectiveRequirement, setCollectiveRequirement] = useState("");
    const [openCodeTabList, setOpenCodeTabList] = useState([]);
    const [copiedText, setCopiedText] = useState(false);

    const [zipFile, setZipFile] = useState(null);
    const [requirementObj, setRequirementObj] = useState({
        code: "",
        requirement: "",
        updatedCode: null,
        show: false,
        key: ""
    })

    const handleNext = async () => {
        // if (projectName.length === 0) return setErrorMsg("Project Name Required")
        setNextBtnLoading(true);
        // if (!projectNameSubmitted) setProjectNameSubmitted(true)
        // else {
        if (userRequirement.length === 0) {
            setNextBtnLoading(false);
            return setErrorMsg("Project Description Required")
        }
        let requirement = allQnA && allQnA.length > 0 ? allQnA[allQnA.length - 1].ans : userRequirement
        if (requirement.length === 0 && questionCount < 6) {
            setNextBtnLoading(false);
            return setErrorMsg("Answer Required")
        }
        if (questionCount === 7 && requirement.length === 0) return handleSubmit()
        let data = {
            sessionId: sessionId,
            // projectName: projectName,
            projectId: selectedProject?.id,
            userRequirements: requirement,
            questionCount: questionCount
        }
        const response = await langChainApi.userSoution(data)

        let temp = [...allQnA]
        temp.push({ ques: response.response, ans: "" })
        setAllQnA(temp)

        setQuestionCount(response.questionCount)
        // }
        setNextBtnLoading(false);
    }

    const handleSubmit = async () => {
        setContinueBtnLoading(true)
        let data = {
            sessionId: sessionId,
            // projectName: projectName,
            projectId: selectedProject?.id,
            userRequirements: "userRequirements",
            questionCount: 8
        }
        const response = await langChainApi.userSoution(data)
        setUserRequirementsSummary(response.new_user_solution_summary)
        setCollectiveRequirement(response.collective_user_requirement)
        setGotProjectSummary(true)
        setContinueBtnLoading(false);
    }

    const handleInputChange = (e, index) => {
        setErrorMsg();
        e.target.style.height = "auto";
        e.target.style.height = (e.target.scrollHeight + 2) + "px";

        const newValue = e.target.value;

        // Create a new array with the updated value for the specific qna object
        const updatedQnA = [...allQnA];
        updatedQnA[index] = { ...updatedQnA[index], ans: newValue };

        // Update the state with the new array
        setAllQnA(updatedQnA);
    };

    const generateCode = async () => {
        setLoadingCode(true);
        setViewGeneratedCode(true);
        if (!generatedCode) {
            let data = {
                detailed_user_requirement: collectiveRequirement ? collectiveRequirement : "",
                projectId: selectedProject?.id,
                userRequirementsSummary: userRequirementsSummary['Core Features and Components']
            }
            const response = await langChainApi.generateCode(data)
            setGeneratedCode(response)
            // setZipFile(response.codeFile)
        }
        setLoadingCode(false);
    }


    const downloadCode = async () => {
        const response = await langChainApi.downloadCode(selectedProject?.id)

        // Assuming `data` is a Blob. If not, you may need to convert it into a Blob.
        const blob = new Blob([response.data], { type: 'application/zip' });

        // Create a URL for the blob
        const downloadUrl = window.URL.createObjectURL(blob);

        // Create a temporary anchor element and trigger the download
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "project.zip"; // You can customize the file name
        document.body.appendChild(a);
        a.click();

        // Clean up by revoking the object URL and removing the temporary anchor element
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
    }

    const generateFlowchart = async () => {
        setLoadingFlowchart(true);
        setViewFlowChart(true);
        if (!flowchart) {
            let data = {
                solution_summary: userRequirementsSummary ? userRequirementsSummary : {},
                work_order_id: selectedProject?.id,
                isTaskFlowchart: false
            }
            const response = await langChainApi.solutionSummaryFlowchart(data)
            setFlowchart(response?.flowchart)
        }
        setLoadingFlowchart(false);
    }

    const handleEnter = (e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            handleNext();
        }
    };

    function onChangeText(e) {
        setErrorMsg();
        setUserRequirement(e.target.value)

        e.target.style.height = "auto";
        e.target.style.height = (e.target.scrollHeight + 2) + "px";
    }

    useEffect(() => {
        if (selectedProject?.id) {
            (async () => {
                const repoFlowRes = await langChainApi.getRepoFlow(selectedProject.id);
                if (repoFlowRes && repoFlowRes.status) {
                    setQuestionCount(repoFlowRes.repoFlow.stepCount)
                    setAllQnA(repoFlowRes.repoFlow.allqna)
                    setSessionId(repoFlowRes.repoFlow.sessionId)
                    setUserRequirement(repoFlowRes.repoFlow.repoDescription)
                    setFlowchart(repoFlowRes.repoFlow.flowchart)
                    setCollectiveRequirement(repoFlowRes.repoFlow.collectiveRequirement)
                    setProjectName(repoFlowRes?.repoFlow?.repoName);
                    setGeneratedCode(repoFlowRes.code)
                    setZipFile(repoFlowRes.codeFile);

                    if (repoFlowRes.repoFlow?.summary) {
                        setGotProjectSummary(true);
                        setUserRequirementsSummary(repoFlowRes.repoFlow.summary)
                    }
                }
                setCheckingFlow(false);
            })()
        }
    }, [selectedProject])

    const handleRestartRepoFlow = async () => {
        const res = await langChainApi.restartRepoFlow(selectedProject?.id)
        if (res && res.status) {
            setQuestionCount(0)
            setAllQnA([])
            setSessionId(generateSessionId());
            setUserRequirement("")
        }
    }

    const addOrRemoveTabText = (text) => {
        // Check if the text already exists in the array
        if (openCodeTabList.includes(text)) {
            // If it exists, remove it
            setOpenCodeTabList(openCodeTabList.filter((item) => item !== text));
        } else {
            // If it doesn't exist, add it
            setOpenCodeTabList([...openCodeTabList, text]);
        }
    };

    const handleCopy = () => {
        setCopiedText(true)
        setTimeout(() => setCopiedText(false), 2000);
    }


    const createAndAddTool = async (data, fileContent) => {
        const binaryStr = atob(fileContent);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }

        // Create a blob from the binary data
        const blob = new Blob([bytes], { type: 'application/zip' });

        // Append the blob to the FormData
        var formdata = new FormData();
        formdata.append("file", blob, "myfilename.zip");
        formdata.append("data", JSON.stringify(data));
        const res = await ToolApi.addTool(formdata);
        if (res && res && res.status && res.usertool) {
            dispatch(addTool(res.usertool));
        }
    }

    const uploadGeneratedCode = async () => {
        let data = {
            pluginName: `${projectName}-frontend`,
            pluginDescription: "",
            pluginDetails: {},
            icon: "ri-file-text-line",
            pluginType: "DocumentTool",
            pluginTypeName: "Document",
            toolMaster: 1,
            project: selectedProject?.id,
            projectCodeType: "reactjs",
            connectionDate: new Date(),
            statusChangeDate: new Date(),
            emailId: userInfo?.emailid ? userInfo.emailid : "",
        };

        console.log(zipFile)
        await createAndAddTool(data, zipFile.react);
        data = { ...data, pluginName: `${projectName}-backend`, projectCodeType: "nodejs" }
        await createAndAddTool(data, zipFile.node);
        navigate("/integration")

        // const binaryStr = atob(zipFile.react);
        // const len = binaryStr.length;
        // const bytes = new Uint8Array(len);
        // for (let i = 0; i < len; i++) {
        //     bytes[i] = binaryStr.charCodeAt(i);
        // }

        // // Create a blob from the binary data
        // const blob = new Blob([bytes], { type: 'application/zip' });

        // // Append the blob to the FormData
        // var formdata = new FormData();
        // formdata.append("file", blob, "myfilename.zip");
        // formdata.append("data", JSON.stringify(data));
        // data = formdata;
        // const res = await ToolApi.addTool(data);
        // if (res && res && res.status && res.usertool) {
        //     dispatch(addTool(res.usertool));
        // }


    }

    // handleFileChange = (event) => {
    //     const file = event.target.files[0];

    //     if (file) {
    //       // Read the file as a binary string
    //       const reader = new FileReader();
    //       reader.onload = () => {
    //         const binaryString = reader.result.split(',')[1];

    //         // Convert base64 to Uint8Array and set in state
    //         const byteArray = new Uint8Array(atob(binaryString).split('').map(char => char.charCodeAt(0)));
    //         this.setState({ zipFileData: byteArray });
    //       };

    //       reader.readAsDataURL(file);
    //     }
    //   };

    const installNodeModules = (PORT) => {
        fetch(`http://localhost:${PORT}/execute-npm-install`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cwd: "abc" }), // Replace with your command
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Handle the output as needed
                alert(JSON.stringify(data))
            })
            .catch((error) => {
                console.error(error);
            });

    }


    const runProjectFrontend = (PORT) => {
        fetch(`http://localhost:${PORT}/execute-npm-start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cwd: "abc" }), // Replace with your command
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Handle the output as needed
                alert(JSON.stringify(data))

            })
            .catch((error) => {
                console.error(error);
            });

    }

    const handleGenerateCode = async () => {
        const response = await langChainApi.makeCodeChangesTwo(requirementObj)
        if (response && response.status) {
            setRequirementObj({ ...requirementObj, updatedCode: response.updatedCode })
        }
    }
    const handleGenerateRequirement = async (key) => {
        setRequirementObj({ ...requirementObj, show: true, key: key })
    }

    return (
        <>
            <div className='createRepoPage'>
                {!gotProjectSummary && !checkingFlow && <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        className='text-capitalize'
                        variant="outlined"
                        style={{
                            color: "#F07227",
                            border: "1px solid #F07227",
                            fontSize: '16px',
                            fontWeight: 600,
                        }}
                        sx={{
                            ":hover": {
                                bgcolor: "#FCE9E9",
                            }
                        }}
                        onClick={handleRestartRepoFlow}
                    >
                        Start Over
                    </Button>
                </div>}
                <div className='repoDetailsBox'>
                    {checkingFlow ? <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <CircularProgress />
                    </div> :
                        !gotProjectSummary ?
                            <div className='repoInitialDetails'>
                                {/* <AiMessage message={"What should be the name of your new project ?"} />
                            <UserMessage value={projectName} onChange={(e) => setProjectName(e.target.value)} type={"text"} disable={projectNameSubmitted} /> */}
                                <AiMessage message={"Provide a concise, one-sentence description of your project."} />
                                <UserMessage value={userRequirement} onChange={onChangeText} type={"textbox"} disable={allQnA.length > 0} onKeyDown={handleEnter} />

                                {allQnA.map((qna, i) => <>
                                    <AiMessage message={`${qna.ques}`} />
                                    <UserMessage value={qna.ans} onChange={(e) => handleInputChange(e, i)} type={"textbox"} onKeyDown={handleEnter} />
                                </>)}
                                <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
                                    {/* {allQnA.length >= 6 && <Button
                                    variant="outlined"
                                    style={{
                                        color: "#F07227",
                                        border: "1px solid #F07227", margin: '0px 15px',
                                        fontSize: '14px', fontWeight: 600,
                                        width: "199px",
                                        height: "52px",
                                        borderRadius: "5px",
                                    }}
                                    sx={{
                                        ":hover": {
                                            bgcolor: "#FCE9E9",
                                        },
                                    }}
                                    disabled={continueBtnLoading || nextBtnLoading}
                                    onClick={handleSubmit}
                                >
                                    {continueBtnLoading ? <CircularProgress size="2rem" /> : "Continue"}
                                </Button>} */}
                                    {errorMsg && <span style={{ color: "red" }}>{errorMsg}</span>}
                                    <Button
                                        className='text-capitalize'
                                        variant="outlined"
                                        style={{
                                            color: "#F07227",
                                            border: "1px solid #F07227", margin: '0px 15px',
                                            fontSize: '14px', fontWeight: 600,
                                            width: "199px",
                                            height: "52px",
                                            borderRadius: "5px",
                                        }}
                                        sx={{
                                            ":hover": {
                                                bgcolor: "#FCE9E9",
                                            },
                                        }}
                                        disabled={continueBtnLoading || nextBtnLoading}
                                        onClick={handleNext}
                                    >
                                        {nextBtnLoading ? <CircularProgress size="2rem" /> : "Continue"}
                                    </Button>
                                </div>
                            </div>
                            :
                            <>
                                <div style={{ padding: "10px", border: "1px solid lightgrey", borderRadius: "8px", boxShadow: "2px 2px 6px 0 rgba(0, 0, 0, 0.4)" }}>
                                    <h3 style={{ textAlign: "center" }}>Solution Overview</h3>
                                    <p style={{ whiteSpace: "pre-wrap" }}>
                                        {console.log("userRequirementsSummary", userRequirementsSummary)}
                                        {Object.keys(userRequirementsSummary).map(mainKey => {
                                            return (
                                                <>
                                                    <h3>{mainKey}</h3>
                                                    {(typeof userRequirementsSummary[mainKey] === "object") ? Object.keys(userRequirementsSummary[mainKey]).map(key => {
                                                        return (
                                                            <>
                                                                <h4 style={{ color: `${requirementObj.key === key ? "orange" : "blue"}`, cursor: "pointer" }} onClick={() => handleGenerateRequirement(key)}>{key}</h4>
                                                                {(typeof userRequirementsSummary[mainKey][key] === "object") ? Object.keys(userRequirementsSummary[mainKey][key]).map(subKey => {
                                                                    return (
                                                                        <>
                                                                            <div style={{ display: "flex" }}><h5>{subKey} : </h5> <span>{userRequirementsSummary[mainKey][key][subKey]}</span></div>
                                                                        </>
                                                                    )
                                                                }) : <><div style={{ display: "flex" }}><h5>{key} : </h5> <span>{userRequirementsSummary[mainKey][key]}</span></div></>}
                                                            </>
                                                        )
                                                    }) : <div style={{ display: "flex" }}><h5>{mainKey} : </h5> <span>{userRequirementsSummary[mainKey]}</span></div>}
                                                </>
                                            )
                                        })}
                                    </p>

                                    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "40px" }}>
                                        <Button
                                            className='text-capitalize'
                                            variant="outlined"
                                            style={{
                                                color: "#F07227",
                                                border: "1px solid #F07227", margin: '0px 15px',
                                                fontSize: '14px', fontWeight: 600,
                                                width: "auto",
                                                height: "52px",
                                                borderRadius: "5px",
                                            }}
                                            sx={{
                                                ":hover": {
                                                    bgcolor: "#FCE9E9",
                                                },
                                            }}
                                            // disabled={loadingCode}
                                            onClick={generateCode}
                                        >
                                            {generatedCode ? "View Code" : "Generate Code"}
                                        </Button>

                                        <Button
                                           className='text-capitalize'
                                            variant="outlined"
                                            style={{
                                                color: "#F07227",
                                                border: "1px solid #F07227", margin: '0px 15px',
                                                fontSize: '14px', fontWeight: 600,
                                                width: "auto",
                                                height: "52px",
                                                borderRadius: "5px",
                                            }}
                                            sx={{
                                                ":hover": {
                                                    bgcolor: "#FCE9E9",
                                                },
                                            }}
                                            // disabled={loadingCode}
                                            onClick={downloadCode}
                                        >
                                            Download Code
                                        </Button>

                                        <Button
                                            className='text-capitalize'
                                            variant="outlined"
                                            style={{
                                                color: "#F07227",
                                                border: "1px solid #F07227", margin: '0px 15px',
                                                fontSize: '14px', fontWeight: 600,
                                                width: "auto",
                                                height: "52px",
                                                borderRadius: "5px",
                                            }}
                                            sx={{
                                                ":hover": {
                                                    bgcolor: "#FCE9E9",
                                                },
                                            }}
                                            disabled={loadingFlowchart}
                                            onClick={generateFlowchart}
                                        >
                                            {flowchart ? "View Flowchart" : "Generate Flowchart"}
                                        </Button>
                                    </div>
                                    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "40px" }}>
                                        <Button
                                            className='text-capitalize'
                                            variant="outlined"
                                            style={{
                                                color: "#F07227",
                                                border: "1px solid #F07227", margin: '0px 15px',
                                                fontSize: '14px', fontWeight: 600,
                                                width: "auto",
                                                height: "52px",
                                                borderRadius: "5px",
                                            }}
                                            sx={{
                                                ":hover": {
                                                    bgcolor: "#FCE9E9",
                                                },
                                            }}
                                            // disabled={loadingCode}
                                            onClick={() => installNodeModules(9000)}
                                        >
                                            Install Packages ( Frontend)
                                        </Button>

                                        <Button
                                           className='text-capitalize'
                                            variant="outlined"
                                            style={{
                                                color: "#F07227",
                                                border: "1px solid #F07227", margin: '0px 15px',
                                                fontSize: '14px', fontWeight: 600,
                                                width: "auto",
                                                height: "52px",
                                                borderRadius: "5px",
                                            }}
                                            sx={{
                                                ":hover": {
                                                    bgcolor: "#FCE9E9",
                                                },
                                            }}
                                            disabled={loadingFlowchart}
                                            onClick={() => runProjectFrontend(9000)}
                                        >
                                            Run Project (Front end)
                                        </Button>
                                    </div>
                                    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "40px" }}>
                                        <Button
                                           className='text-capitalize'
                                            variant="outlined"
                                            style={{
                                                color: "#F07227",
                                                border: "1px solid #F07227", margin: '0px 15px',
                                                fontSize: '14px', fontWeight: 600,
                                                width: "auto",
                                                height: "52px",
                                                borderRadius: "5px",
                                            }}
                                            sx={{
                                                ":hover": {
                                                    bgcolor: "#FCE9E9",
                                                },
                                            }}
                                            // disabled={loadingCode}
                                            onClick={() => installNodeModules(7000)}
                                        >
                                            Install Packages (Backend)
                                        </Button>

                                        <Button
                                            className='text-capitalize'
                                            variant="outlined"
                                            style={{
                                                color: "#F07227",
                                                border: "1px solid #F07227", margin: '0px 15px',
                                                fontSize: '14px', fontWeight: 600,
                                                width: "auto",
                                                height: "52px",
                                                borderRadius: "5px",
                                            }}
                                            sx={{
                                                ":hover": {
                                                    bgcolor: "#FCE9E9",
                                                },
                                            }}
                                            disabled={loadingFlowchart}
                                            onClick={() => runProjectFrontend(7000)}
                                        >
                                            Run Project (Backend)
                                        </Button>
                                    </div>

                                    <Dialog
                                        fullWidth={true}
                                        maxWidth={"xl"}
                                        open={viewGeneratedCode}
                                        onClose={() => setViewGeneratedCode(false)}
                                        sx={{ zIndex: 110 }}
                                    >
                                        <DialogContent sx={{
                                            minHeight: "80vh", maxHeight: "90vh", height: "100%", "& .MuiBox-root": {
                                                height: "100%",
                                                minHeight: "75vh"
                                            },
                                            padding: "0 20px 24px 20px"
                                        }}>
                                            <Box
                                                noValidate
                                                component="form"
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: "column",
                                                    m: 'auto',
                                                    width: '100%',
                                                    height: "auto"
                                                }}
                                            >
                                                {loadingCode ?
                                                    <div style={{ height: '100%', width: '100%' }}>
                                                        <Box sx={{ display: "flex", flexDirection: "column", height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                            <CircularProgress style={{ margin: "15px" }} />
                                                            Please wait while Aster AI generates your code.
                                                        </Box>
                                                    </div>
                                                    :
                                                    generatedCode &&
                                                    <div className='flowChartwDiv' style={{
                                                        width: "100%", height: "100%", display: 'flex', flexDirection: "column", alignItems: 'center', justifyContent: 'center', maxHeight: '100%', padding: "20px"
                                                        // , backgroundColor: 'red' 
                                                    }}>
                                                        <span style={{
                                                            backgroundColor: "rgb(252, 221, 203)",
                                                            width: "100%",
                                                            textAlign: "center",
                                                            height: "40px",
                                                            verticalAlign: "middle",
                                                            position: "sticky",
                                                            top: "0",
                                                            zIndex: 100
                                                        }}>Total {generatedCode?.react?.length + generatedCode?.node?.length} files of code generated, Click
                                                            <button
                                                                onClick={() => navigate("/businessDocumentation")}
                                                                className="verificationEmailButton"
                                                            >
                                                                here
                                                            </button>
                                                            to navigate to Business Docs</span>
                                                        {Object.keys(generatedCode).map((key, index) =>
                                                            <>
                                                                <h3 style={{ width: "100%", textAlign: "center", backgroundColor: "white", boxShadow: "0 3px 5px -3px rgba(0, 0, 0, 0.2)", position: "sticky", top: "40px", zIndex: 100 }}>{key === "node" ? "Node.js" : "React.js"}</h3>
                                                                {generatedCode[key].map((file, index) => {
                                                                    return (
                                                                        <>
                                                                            <div style={{
                                                                                width: "100%",
                                                                                display: "flex",
                                                                                flexDirection: "column",
                                                                                borderRadius: "4px",
                                                                                padding: "5px",
                                                                                border: "1px solid lightgrey",
                                                                                margin: "5px 0",
                                                                                zIndex: 50
                                                                            }}>

                                                                                <List
                                                                                    sx={{ width: '100%', bgcolor: 'background.paper', padding: "0" }}
                                                                                    component="nav"
                                                                                    aria-labelledby="nested-list-subheader"
                                                                                >

                                                                                    <ListItemButton onClick={() => addOrRemoveTabText(index)}>
                                                                                        <ListItemIcon>
                                                                                            <CodeIcon />
                                                                                        </ListItemIcon>
                                                                                        <ListItemText primary={file?.file_name ? file.file_name : ""} primaryTypographyProps={{ fontWeight: '600' }} />
                                                                                        {openCodeTabList.includes(index) ? <ExpandLess /> : <ExpandMore />}
                                                                                    </ListItemButton>

                                                                                    <Collapse in={openCodeTabList.includes(index)} timeout="auto" unmountOnExit>
                                                                                        <List component="div" sx={{ pl: 4 }}>
                                                                                            <div style={{ display: "flex", width: "100%" }}>
                                                                                                <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", margin: "10px 0" }}>
                                                                                                    <h3>Previous Code</h3>
                                                                                                    <div style={{ width: "100%", display: "flex", justifyContent: 'space-between', alignItems: "center", paddingLeft: "5px", backgroundColor: "whitesmoke" }}>
                                                                                                        <span>{file.file_name}</span>
                                                                                                        <CopyToClipboard text={file.file_content} onCopy={handleCopy}>
                                                                                                            <div style={{ backgroundColor: "#FCF0E9", padding: "8px", borderRadius: "4px", cursor: "pointer" }} onClick={handleCopy}>
                                                                                                                <Tooltip title="Copy To ClipBoard">
                                                                                                                    <i className="ri-file-copy-line"></i>
                                                                                                                </Tooltip>
                                                                                                            </div>
                                                                                                        </CopyToClipboard></div>

                                                                                                    <SyntaxHighlighter language="javascript" style={docco}>
                                                                                                        {file.file_content}
                                                                                                    </SyntaxHighlighter>
                                                                                                </div>
                                                                                            </div>
                                                                                        </List>
                                                                                    </Collapse>
                                                                                </List>

                                                                            </div>
                                                                        </>
                                                                    )
                                                                })}
                                                            </>
                                                        )}
                                                    </div>}
                                            </Box>
                                        </DialogContent>
                                        <DialogActions style={{ display: "flex", justifyContent: "center" }}>
                                            <Button
                                               className='text-capitalize'
                                                variant="outlined"
                                                style={{
                                                    color: "#F07227",
                                                    border: "1px solid #F07227",
                                                    margin: "20px",
                                                    fontSize: '17px',
                                                    fontWeight: 700,
                                                    // cursor: "not-allowed"
                                                }}
                                                disabled={loadingCode}
                                                onClick={uploadGeneratedCode}
                                            >
                                                Upload Code
                                            </Button>
                                        </DialogActions>
                                        <DialogActions style={{ display: "flex", justifyContent: "center" }}>
                                            <Button
                                                className='text-capitalize'
                                                variant="outlined"
                                                style={{
                                                    color: "#F07227",
                                                    border: "1px solid #F07227",
                                                    margin: "20px",
                                                    fontSize: '17px',
                                                    fontWeight: 700,
                                                    // cursor: "not-allowed"
                                                }}
                                                disabled={loadingCode}
                                                onClick={installNodeModules}
                                            >
                                                Install Pakages
                                            </Button>
                                        </DialogActions>
                                        <DialogActions style={{ display: "flex", justifyContent: "center" }}>
                                            <Button
                                               className='text-capitalize'
                                                variant="outlined"
                                                style={{
                                                    color: "#F07227",
                                                    border: "1px solid #F07227",
                                                    margin: "20px",
                                                    fontSize: '17px',
                                                    fontWeight: 700,
                                                    // cursor: "not-allowed"
                                                }}
                                                disabled={loadingCode}
                                                onClick={runProjectFrontend}
                                            >
                                                Run  Frontend Project
                                            </Button>
                                        </DialogActions>
                                    </Dialog>


                                    <Dialog
                                        fullWidth={true}
                                        maxWidth={"xl"}
                                        open={viewFlowChart}
                                        onClose={() => setViewFlowChart(false)}
                                        sx={{ zIndex: 110 }}
                                    >
                                        <DialogContent sx={{
                                            minHeight: "80vh", maxHeight: "90vh", height: "100%", "& .MuiBox-root": {
                                                height: "100%",
                                                minHeight: "75vh"
                                            }
                                        }}>
                                            <Box
                                                noValidate
                                                component="form"
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: "column",
                                                    m: 'auto',
                                                    width: '100%',
                                                    height: "auto"
                                                }}
                                            >
                                                <h3>FlowChart</h3>
                                                {loadingFlowchart ?
                                                    <div style={{ height: '100%', width: '100%' }}>
                                                        <Box sx={{ display: "flex", height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                            <CircularProgress />
                                                        </Box>
                                                    </div>
                                                    :
                                                    flowchart &&
                                                    <div className='flowChartwDiv' style={{
                                                        width: "100%", height: "100%", display: 'flex', flexDirection: "column", alignItems: 'center', justifyContent: 'center', maxHeight: '100%', padding: "20px"
                                                        // , backgroundColor: 'red' 
                                                    }}>
                                                        {/* <CloseIcon style={{ position: "absolute", top: 0, right: 0, margin: "5px", cursor: "pointer" }} onClick={() => setPreviewImage({ isOpen: false, img: null })} /> */}

                                                        <TransformWrapper
                                                        >
                                                            {(utils) => (
                                                                <React.Fragment>
                                                                    <Controls {...utils} />
                                                                    <TransformComponent
                                                                        wrapperStyle={{ height: "100%", width: "100%", display: 'flex', justifyContent: "center", alignItems: "center" }}
                                                                        contentStyle={{ height: "100%", width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "10px" }}
                                                                    >
                                                                        {
                                                                            flowchart &&
                                                                            <div className='itsFlowChart' alt="flow chart" style={{ cursor: "pointer", margin: "15px", display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '100%', maxHeight: '100%' }}
                                                                                dangerouslySetInnerHTML={{ __html: flowchart }}
                                                                            >

                                                                            </div>

                                                                        }
                                                                    </TransformComponent>

                                                                </React.Fragment>
                                                            )}
                                                        </TransformWrapper>
                                                    </div>}
                                            </Box>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                {requirementObj.show && <div>
                                    <Input
                                        name="Requirement"
                                        placeholder={"Requirement"}
                                        type="textbox"
                                        onChange={(e) => setRequirementObj({ code: requirementObj.code, requirement: e.target.value })}
                                        style={{
                                            width: "250px",
                                            height: "auto",
                                            borderRadius: "5px",
                                            outline: "none",
                                            padding: "15px",
                                            background: "white",
                                            border: "1px solid #DCDCDC",
                                        }}
                                        value={requirementObj.requirement}
                                    />
                                    <Button
                                       className='text-capitalize'
                                        variant="outlined"
                                        style={{
                                            color: "#F07227",
                                            border: "1px solid #F07227", margin: '0px 15px',
                                            fontSize: '14px', fontWeight: 600,
                                            width: "199px",
                                            height: "52px",
                                            borderRadius: "5px",
                                        }}
                                        sx={{
                                            ":hover": {
                                                bgcolor: "#FCE9E9",
                                            },
                                        }}
                                        // disabled={continueBtnLoading || nextBtnLoading}
                                        onClick={handleGenerateCode}
                                    >
                                        Submit
                                    </Button>

                                    {requirementObj?.updatedCode && <div>
                                        {requirementObj.updatedCode}
                                    </div>}
                                </div>}
                            </>
                    }
                </div>
            </div>
        </>
    );
}

export default CreateRepository;
