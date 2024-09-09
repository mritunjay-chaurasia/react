import React, { useEffect, useState } from "react";
import { IconButton, Switch } from "@mui/material";
import * as OrgTokenApi from "../../api/orgToken.api";
import { showNotification } from "../../utils/notification";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import openAiLogo from "../../assets/images/openai.jpg";
import serpAPILogo from "../../assets/images/serp.jpg";
import rteLogo from "../../assets/images/rte-logo-1.png";
import "./keys.css";

import { OPEN_AI_KEY, SERP_KEY } from "../../constants";
import { makeStyles } from "@material-ui/core/styles";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

const useStyles = makeStyles({
    root: {
        width: "50px",
        height: "24px",
        padding: "0px",
    },
    switchBase: {
        color: "#818181",
        padding: "1px",
        "&$checked": {
            "& + $track": {
                backgroundColor: "#F07227",
            },
        },
    },
    thumb: {
        color: "white",
        width: "20px",
        height: "20px",
        margin: "1px",
    },
    track: {
        borderRadius: "20px",
        backgroundColor: "#818181",
        opacity: "1 !important",
        "&:after, &:before": {
            color: "white",
            fontSize: "11px",
            position: "absolute",
            top: "6px",
        },
        "&:after": {
            content: "'On'",
            left: "8px",
        },
        "&:before": {
            content: "'Off'",
            right: "7px",
        },
    },
    checked: {
        color: "#23bf58 !important",
        transform: "translateX(26px) !important",
    },
});

function Keys() {
    const { selectedProject } = useSelector((state) => state.orgDetails);

    const [projectKey, setProjectKey] = useState("");
    const [projectKeyValue, setProjectKeyValue] = useState("");
    const [openAIKey, setOpenAIKey] = useState("");
    const [serpApiKey, setSerpApiKey] = useState("");
    const [selectedKeyType, setSelectedKeyType] = useState("");
    const [keyError, setKeyError] = useState(false);
    const [edit, setEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [rteApiKey, setRteApiKey] = useState("");
    const [rteKeyToggleStatus, setRteKeyToggleStatus] = useState(false);

    const classes = useStyles();

    const onSelectType = (type) => {
        setSelectedKeyType(type);
        if (type === "openAIKey") {
            setProjectKey(openAIKey);
            setProjectKeyValue(openAIKey);
        }
        if (type === "serpKey") {
            setProjectKey(serpApiKey);
            setProjectKeyValue(serpApiKey);
        }

        if (type === "rteKey") {
            setProjectKey(rteApiKey);
            setProjectKeyValue(rteApiKey);
        }
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setEdit(false);
        setSelectedKeyType("");
        setProjectKey("");
        setProjectKeyValue("");
    };

    const handleCancelEdit = () => {
        setEdit(false);
        if (selectedKeyType === "openAIKey") setProjectKeyValue(openAIKey);
        if (selectedKeyType === "serpKey") setProjectKeyValue(serpApiKey);
        if (selectedKeyType === "rteKey") setRteApiKey(rteApiKey);
    };

    const handleAddOrUpdateAiKey = async () => {
        try {
            if (projectKeyValue.trim() === "") {
                setKeyError(true);
                return;
            }

            if (rteKeyToggleStatus) {
                const rteKeyStatus_error = document.getElementById("rteKeyStatus_error");
                rteKeyStatus_error.innerHTML = "Please Disable RTE Api Key First";
                setKeyError(true);
                return;
            }
            let data = {};
            if (selectedKeyType === "openAIKey") data["openAIKey"] = projectKeyValue;
            if (selectedKeyType === "serpKey") data["serpApiKey"] = projectKeyValue;
            if (selectedKeyType === "rteKey") data["rteKey"] = projectKeyValue;
            const res = await OrgTokenApi.addOrUpdateAiKey(selectedProject?.id, data);
            if (res && res.status) {
                if (selectedKeyType === "openAIKey") setOpenAIKey(projectKeyValue);
                if (selectedKeyType === "serpKey") setSerpApiKey(projectKeyValue);
                if (selectedKeyType === "rteKey") setSerpApiKey(projectKeyValue);
                handleClose();
                showNotification("success", "AI Key Updated Successfully!");
            }
        } catch (error) {
            let message = "Something went wrong, please try again later!";
            if (error?.response?.data?.message) message = error.response.data.message;
            showNotification("success", message);
        }
    };

    const handleEditKey = () => {
        setEdit(true);
    };

    /**
    * This function acept string parameter which is used in code  and Return a string which is display name for UI
    and can be seen by user
    * @params = name (Type:String)
    * @response : returns string (display Name)
    * @author : Mandeep Singh
    */
    const getKeyName = (name) => {
        if (name.trim().length <= 0) {
            return "";
        }
        switch (name) {
            case "openAIKey":
                return "OpenAI Key";
            case "serpKey":
                return "SerpAPI Key";
            case "rteKey":
                return "RTE API Key";

            default:
                console.error(`${name} Not Found !`);
                break;
        }
    };

    /**
    * This function acept Event parameter which is sent by Toggle Button It Use it for handling RTE Key Toggle Button Status
    if its true it will add RTE api keys to database and user will be unable to set his own keys else it will add null value for keys
    in database 
    * @params = name (Type:String)
    * @response : returns string (display Name)
    * @author : Mandeep Singh
    */
    const handleRteKeySetterToggle = async (e) => {
        // setRteKeyStatusMiddler(e.target.checked);
        setRteKeyToggleStatus(e.target.checked);
        if (e.target.checked) {
            await OrgTokenApi.addOrUpdateAiKey(selectedProject?.id, {
                openAIKey: OPEN_AI_KEY,
                serpApiKey: SERP_KEY,
                rtekey: "true",
            });
        } else {
            await OrgTokenApi.addOrUpdateAiKey(selectedProject?.id, {
                openAIKey: "null",
                serpApiKey: "null",
                rtekey: false,
            });
            setOpenAIKey("");
            setSerpApiKey("");
            setRteApiKey("");
            showNotification("info", "Api Keys Reseted, You Should Add Them Manually Now");
        }
    };

    useEffect(() => {
        if (selectedProject?.id) {
            (async () => {
                const response = await OrgTokenApi.getOrgToken(selectedProject?.id);
                if (response && response.length > 0) {
                    if (response[0]?.openapikey) setOpenAIKey(response[0].openapikey);
                    if (response[0]?.serpapikey) setSerpApiKey(response[0].serpapikey);
                    if (response[0]?.rtekey) setRteApiKey(response[0].rtekey);
                    setRteKeyToggleStatus(response[0]?.rtekey ? true : false);
                }
            })();
        }
    }, [selectedProject]);

    return (
        <div className="keysPage">
            <div className="keyTypeCard" onClick={() => onSelectType("openAIKey")}>
                <div style={{ height: "120px" }}>
                    <img src={openAiLogo} alt="logo" style={{ maxHeight: "100%" }} />
                </div>
                <h5 style={{ margin: "8px 0 5px 0" }}>OpenAI</h5>
            </div>
            <div className="keyTypeCard" onClick={() => onSelectType("serpKey")}>
                <div style={{ height: "120px" }}>
                    <img src={serpAPILogo} alt="logo" style={{ maxHeight: "100%" }} />
                </div>
                <h5 style={{ margin: "8px 0 5px 0" }}>SerpAPI</h5>
            </div>

            <div className="keyTypeCard" onClick={() => onSelectType("rteKey")}>
                <div style={{ height: "120px" }}>
                    <img src={rteLogo} alt="logo" style={{ height: "100px" }} />
                </div>
                <h5 style={{ margin: "8px 0 5px 0" }}>RTE API Key</h5>
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {getKeyName(selectedKeyType)}
                    </Typography>
                    <div className="d-flex flex-column justify-center align-items-center pt-3">
                        {projectKey && projectKey.length > 0 && projectKey === "rteKey" && !edit ? (
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <span style={{ marginRight: "8px" }}>{projectKey}</span>
                                <IconButton onClick={handleEditKey}>
                                    <i
                                        className="ri-pencil-line d-flex align-items-center"
                                        style={{ height: "24px" }}
                                    ></i>
                                </IconButton>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center flex-wrap flex-column">
                                {selectedKeyType === "rteKey" ? (
                                    <>
                                        <span style={{ marginRight: "1rem" }}> Use RTE Key</span>
                                        <Switch
                                            classes={{
                                                root: classes.root,
                                                switchBase: classes.switchBase,
                                                thumb: classes.thumb,
                                                track: classes.track,
                                                checked: classes.checked,
                                            }}
                                            checked={rteKeyToggleStatus}
                                            onChange={handleRteKeySetterToggle}
                                            name="checkedControlled"
                                            inputProps={{ "aria-label": "controlled" }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {!rteKeyToggleStatus ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={projectKeyValue === "null" ? "" : projectKeyValue}
                                                    onChange={(e) => {
                                                        setKeyError(false);
                                                        setProjectKeyValue(e.target.value);
                                                    }}
                                                    placeholder="Enter your Key"
                                                    style={{
                                                        border: `1px solid ${keyError ? "red" : "#DCDCDC"}`,
                                                        outline: "none",
                                                        height: 50,
                                                        width: "auto",
                                                        padding: 15,
                                                        borderRadius: 4,
                                                        marginRight: "7px",
                                                    }}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <input
                                                    type="text"
                                                    // value={projectKeyValue}
                                                    onChange={(e) => {
                                                        setKeyError(false);
                                                        setProjectKeyValue(e.target.value);
                                                    }}
                                                    placeholder="Enter your Key"
                                                    style={{
                                                        border: `1px solid ${keyError ? "red" : "#DCDCDC"}`,
                                                        outline: "none",
                                                        height: 50,
                                                        width: "auto",
                                                        padding: 15,
                                                        borderRadius: 4,
                                                        marginRight: "7px",
                                                    }}
                                                />
                                            </>
                                        )}

                                        <div>
                                            <IconButton onClick={handleCancelEdit}>
                                                <ClearIcon sx={{ color: "red" }} />
                                            </IconButton>
                                            <IconButton onClick={handleAddOrUpdateAiKey}>
                                                <DoneIcon sx={{ color: "green" }} />
                                            </IconButton>
                                        </div>

                                        <span
                                            style={{ color: "red", width: "fit-content" }}
                                            id="rteKeyStatus_error"
                                        ></span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default Keys;
