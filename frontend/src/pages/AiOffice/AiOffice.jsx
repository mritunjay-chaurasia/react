import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Input from '../../components/Input/Input';
import { Backdrop, Button, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Modal, Radio, RadioGroup, Snackbar, Stack, Switch, TextField, Tooltip, styled } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { v4 as uuidv4 } from 'uuid';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import StorageIcon from '@mui/icons-material/Storage';
import RepeatOnIcon from '@mui/icons-material/RepeatOn';
import CancelIcon from '@mui/icons-material/Cancel';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import PushPinIcon from '@mui/icons-material/PushPin';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco, github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Xarrow from "react-xarrows";
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/webpack-resolver";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import * as langchainApi from "../../api/langchain.api";
import * as ReadFolderAPI from '../../api/businessDocumentation.api';
import * as UserProjectApi from '../../api/userProject.api';
import { showNotification } from '../../utils/notification';
import ShowSteps from './components/ShowSteps';
import ShowCode from './components/ShowCode';



const initialData = {
    user_data: {
        email: 'string',
        password: 'string',
        first_name: 'string',
        last_name: 'string',
        date_of_birth: 'string (ISO 8601 format)',
        address: {
            street: 'string',
            city: 'string',
            state: 'string',
            zip_code: 'string',
        },
    },
    database: 'object (database connection or session object)',
    secret_key: 'string',
};



const DynamicForm = ({ data, handleTryTest, onCancel }) => {
    const initializeFormData = (obj) => {
        let initializedData = {};
        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                initializedData[key] = initializeFormData(obj[key]);
            } else {
                initializedData[key] = '';
            }
        }
        return initializedData;
    };

    const [formData, setFormData] = useState(initializeFormData(data));

    const handleChange = (path, value) => {
        const keys = path.split('.');
        const newFormData = { ...formData };
        let current = newFormData;

        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                current[key] = value;
            } else {
                if (!current[key]) current[key] = { ...current[key] };
                current = current[key];
            }
        });

        setFormData(newFormData);
    };

    const renderInputs = (obj, path = '') => {
        return Object.keys(obj).map((key) => {
            const newPath = path ? `${path}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                return (
                    <div className="mb-3" key={newPath}>
                        <h5>{key}</h5>
                        <div className="row">
                            {renderInputs(obj[key], newPath)}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="col-md-6 mb-3" key={newPath}>
                        <label htmlFor={newPath} className="form-label">{key}</label>
                        <input
                            type="text"
                            className="form-control"
                            id={newPath}
                            value={getNestedValue(formData, newPath) || ''}
                            onChange={(e) => handleChange(newPath, e.target.value)}
                        />
                    </div>
                );
            }
        });
    };

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    return (
        <form className="container mt-4">
            <div className="row">
                {renderInputs(data)}
            </div>
            {/* <pre className="mt-4">{JSON.stringify(formData, null, 2)}</pre> */}

            <Button
                className='text-capitalize'
                variant="outlined"
                style={{
                    color: "#F07227",
                    border: "1px solid #F07227",
                }}
                sx={{
                    ":hover": {
                        bgcolor: "#FCE9E9",
                    },
                }}
                onClick={() => handleTryTest(formData)}
            >
                Try
            </Button>

            <Button
                className='text-capitalize'
                variant="outlined"
                style={{
                    color: "#F07227",
                    border: "1px solid #F07227",
                    marginLeft: "15px"
                }}
                sx={{
                    ":hover": {
                        bgcolor: "#FCE9E9",
                    },
                }}
                onClick={() => onCancel()}
            >
                Cancel
            </Button>
        </form>
    );
};



const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#284FA3' : '#f07227',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#284FA3' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3, height: "100%" }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}


function AiOffice() {
    const stepCodeEditorRef = useRef(null);
    const fullCodeEditorRef = useRef(null);

    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [subValue, setSubValue] = useState(0);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [dataPreview, setDataPreview] = useState();
    const [hoveredFirstItem, setHoveredFirstItem] = useState();
    const [hoveredSecondItem, setHoveredSecondItem] = useState();
    const [codeView, setCodeView] = useState();
    const [updateQueryText, setUpdateQueryText] = useState("");
    const [copiedText, setCopiedText] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isModalOpen, setIsModalOpen] = useState();
    const [userChangeQuery, setUserChangeQuery] = useState("")
    const [stepPos, setStepPos] = useState();
    const [testFullCodeModal, setTestFullCodeModal] = useState({ open: false, data: null });
    const [jsonEditorValue, setJsonEditorValue] = useState("");
    const [isValidJson, setIsValidJson] = useState(true);
    const [databaseView, setDatabaseView] = useState(false);
    const [viewFunctions, setViewFunctions] = useState(false)
    const [changeTemporary, setChangeTemporary] = useState(false);
    const [openCodeTabList, setOpenCodeTabList] = useState([]);

    const [searchType, setSearchType] = useState("project")
    const [functionsList, setFunctionsList] = useState([]);
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState("");
    const [existingProject, setExistingProject] = useState(false);
    const [existingProjectData, setExistingProjectData] = useState();
    const [fileInput, setFileInput] = useState(null);
    const [editableAPI, setEditableAPI] = useState(null);
    const [editableStep, setEditableStep] = useState(null);
    const [functionStepChain, setFunctionStepChain] = useState([]);


    const handleButtonClick = () => {
        document.querySelector('input[name="Plugin File"]').click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileInput(file);
            setFileName(file.name);
        }
    };

    const [aiProjectInitializationState, setAiProjectInitializationState] = useState({
        highLevelRequirements: "",
        stack: "NodeJS",
        storage: "mongodb",
        projectType: "API",
        baseHeading: "",
        initialized: false,
        baseAPIs: []
    });

    const [aiProjectInitialization, setAiProjectInitialization] = useState({
        highLevelRequirements: "",
        stack: "NodeJS",
        storage: "mongodb",
        projectType: "API",
        baseHeading: "",
        initialized: false,
        baseAPIs: []
    });
    const [selectedAPINode, setSelectedAPINode] = useState();
    const { selectedProject, selectedOrganization } = useSelector(state => state.orgDetails);

    const [dbValue, setDbValue] = React.useState('mongodb');
    const [dbView, setDbView] = useState({
        open: false,
        data: null
    });

    const handleSwitchChange = async (event) => {
        let updatedData = { ...aiProjectInitialization }
        if (event.target.checked) {
            updatedData['stack'] = "Python";
        } else {
            updatedData['stack'] = "NodeJS"
        }
        if (!changeTemporary) await UserProjectApi.updateProject({
            projectId: selectedProject?.id,
            aiProjectInitialization: updatedData
        })
        if (changeTemporary) setAiProjectInitialization(updatedData)
        else setAiProjectInitializationState(updatedData)
    };

    const handleChangeDb = (event) => {
        setDbValue(event.target.value);
    };

    const handleChange = async (event, newValue) => {
        setValue(newValue);
    };


    const handleChangeSubValue = async (event, newValue) => {
        if (newValue === 2) {
            if (!selectedAPINode?.api_code) {
                setOpenBackdrop(true)
                let dataToSend = { ...selectedAPINode, database: aiProjectInitialization?.storage }
                const response = await langchainApi.testNodeApiCompleteCode({ api_data: dataToSend, stack: aiProjectInitialization.stack });
                let updatedAPI = { ...selectedAPINode, api_code: response }
                let updatedAiProjectInitilization = {
                    ...aiProjectInitialization, baseAPIs: aiProjectInitialization.baseAPIs.map(item => {
                        if (item?.id === selectedAPINode?.id) return updatedAPI
                        else return item
                    })
                }
                let isItOld = aiProjectInitializationState.baseAPIs.find(item => item?.id === selectedAPINode?.id)
                if (isItOld) {
                    if (changeTemporary) setAiProjectInitialization(updatedAiProjectInitilization)
                    else setAiProjectInitializationState(updatedAiProjectInitilization)
                }
                else setAiProjectInitialization(updatedAiProjectInitilization)

                setSelectedAPINode(updatedAPI)
                if (!changeTemporary) await UserProjectApi.updateProject({
                    projectId: selectedProject?.id,
                    aiProjectInitialization: updatedAiProjectInitilization
                })
                setOpenBackdrop(false)
            }
        }
        setSubValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };


    const handleChangeSubIndex = (index) => {
        setValue(index);
    };

    function generateRandomId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    const handleSubmitRequirement = async () => {
        setOpenBackdrop(true);
        if (aiProjectInitialization.highLevelRequirements.trim() === "") {
            setOpenBackdrop(false);
            return
        }
        const response = await langchainApi.testNodeApi({ user_input: aiProjectInitialization.highLevelRequirements, stack: aiProjectInitialization.stack });
        setDataPreview(response)
        setOpenBackdrop(false);
    }

    const handleGenerateRequirementJson = async () => {
        setOpenBackdrop(true);
        if (existingProject) {

            let allAPIData = []
            existingProjectData.forEach(item => {
                allAPIData.push({
                    apiName: item.name,
                    api_code: item.code,
                    id: generateRandomId()
                })
            })
            const response = await langchainApi.testNodeApiCompleteApiSteps({ allAPIData: allAPIData, stack: aiProjectInitialization?.stack, function_list: functionsList });
            let functionListToBeInserted = []
            response.forEach(item => {
                item.steps.map((subItem, i) => {
                    if (subItem?.isFunction && subItem.isFunction.toLowerCase() === "yes") {
                        if (subItem?.existingFunction && subItem.existingFunction.toLowerCase() === "no") {
                            functionListToBeInserted.push({
                                name: subItem.functionName,
                                description: subItem.stepDescription,
                                code: subItem.code,
                                projectId: selectedProject?.id
                            })
                            item.steps[i].existingFunction = "yes"
                        } else {
                            functionListToBeInserted.push({
                                id: subItem?.functionId,
                                description: subItem.stepDescription,
                            })
                        }
                    }
                })
            })

            if (functionListToBeInserted.length > 0) {
                const response = await UserProjectApi.addFunctionList({ functionList: functionListToBeInserted })
                setFunctionsList(prev => [...prev, ...response.functionList])
            }

            let updatedData = {
                ...aiProjectInitialization,
                initialized: true,
                baseAPIs: response
            }
            if (!changeTemporary) await UserProjectApi.updateProject({
                projectId: selectedProject?.id,
                aiProjectInitialization: updatedData
            })
            setAiProjectInitializationState(updatedData)

        } else {
            const response = await langchainApi.testNodeApiTwo({ api_data: dataPreview, storage: aiProjectInitialization.storage });
            let APIs = response.APIs.map(item => {
                return {
                    ...item,
                    id: generateRandomId()
                }
            })
            let updatedData = {
                ...aiProjectInitialization,
                initialized: true,
                baseAPIs: APIs
            }
            if (!changeTemporary) await UserProjectApi.updateProject({
                projectId: selectedProject?.id,
                aiProjectInitialization: updatedData
            })
            if (changeTemporary) setAiProjectInitialization(updatedData)
            else setAiProjectInitializationState(updatedData)
            // setAiProjectInitialization(updatedData)
        }
        setOpenBackdrop(false);
    }

    const handleClickAPINode = async (item, i) => {
        console.log("single click")
        setOpenBackdrop(true);
        if (item?.steps) {
            setSelectedAPINode(item)
            setOpenBackdrop(false);
            return
        }

        let response = await langchainApi.testNodeApiThree({ api_data: item, stack: aiProjectInitialization.stack, storage: aiProjectInitialization.storage, function_lists: functionsList });
        let functionListToBeInserted = []
        if (response?.steps && response?.steps.length > 0) {
            response.steps.map((item, i) => {
                if (item?.isFunction && item.isFunction.toLowerCase() === "yes" && item?.existingFunction && item.existingFunction.toLowerCase() === "no") {
                    const newUuid = uuidv4();
                    functionListToBeInserted.push({
                        id: newUuid,
                        name: item.functionName,
                        description: item.stepDescription,
                        code: item.code,
                        projectId: selectedProject?.id
                    })
                    response.steps[i].existingFunction = "yes"
                    response.steps[i].functionId = newUuid
                }
            })
        }
        if (functionListToBeInserted.length > 0) {
            const functionListResponse = await UserProjectApi.addFunctionList({ functionList: functionListToBeInserted })
            setFunctionsList(prev => [...prev, ...functionListResponse.functionList])
        }

        let updatedData = JSON.parse(JSON.stringify(aiProjectInitialization));
        updatedData.baseAPIs[i] = { ...item, steps: response?.steps }
        console.log("updatedDataupdatedData", updatedData)
        if (!changeTemporary) await UserProjectApi.updateProject({
            projectId: selectedProject?.id,
            aiProjectInitialization: updatedData
        })
        if (changeTemporary) setAiProjectInitialization({ ...updatedData })
        else setAiProjectInitializationState(updatedData)
        // setAiProjectInitialization(updatedData)
        setSelectedAPINode(updatedData.baseAPIs[i])
        setOpenBackdrop(false);
        console.log("checkkkkkkkkkk ", updatedData, aiProjectInitializationState)
    }

    const handleGenerateCode = async (item, i) => {
        setOpenBackdrop(true)
        // if (item?.codeGenerated && item.codeGenerated.toLowerCase() === "yes") {
        setCodeView(item)
        setOpenBackdrop(false)
        return
        // }
        // const response = await langchainApi.testNodeApiFour({ api_data: item, stack: aiProjectInitialization.stack })

        // let updatedAPINode = JSON.parse(JSON.stringify(selectedAPINode))
        // updatedAPINode.steps[i] = response
        // let updatedData = aiProjectInitialization.baseAPIs.map(element => {
        //     if (element?.id === updatedAPINode?.id) return updatedAPINode
        //     return element
        // })
        // setSelectedAPINode(updatedAPINode);
        // setAiProjectInitializationState({ ...aiProjectInitialization, baseAPIs: updatedData })
        // await UserProjectApi.updateProject({
        //     projectId: selectedProject?.id,
        //     aiProjectInitialization: { ...aiProjectInitialization, baseAPIs: updatedData }
        // })
        // setCodeView(response)
        // setOpenBackdrop(false)
    }


    const handleOnSendUpdateQuery = async () => {
        setOpenBackdrop(true)
        try {
            const response = await langchainApi.testNodeApiFive({ update_query: updateQueryText, api_data: codeView })
            setCodeView({ ...response })
        } catch (error) {
            showNotification("error", "Something went wrong, please try again");
        }
        setUpdateQueryText("")
        setOpenBackdrop(false)
    }

    const handleEnterModification = (e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault()
            handleOnSendUpdateQuery();
        }
    };

    const handleUpdateCode = async () => {
        setOpenBackdrop(true)
        try {
            let stepCode = stepCodeEditorRef.current.editor.getValue()
            console.log("editorRef.current.editor.getValue()", aiProjectInitialization, stepCode)
            let updatedApis = await Promise.all(aiProjectInitialization.baseAPIs.map(async (item) => {
                if (item.id === selectedAPINode.id) {
                    let itemToReturn = {
                        ...item,
                        steps: item.steps.map(subItem => {
                            if (subItem.stepNo === codeView.stepNo) {
                                return { ...codeView, code: stepCode }
                            } else return subItem
                        })
                    };

                    if (itemToReturn?.api_code) {
                        let dataToSend = { ...itemToReturn, database: aiProjectInitialization?.storage };
                        const response = await langchainApi.testNodeApiCompleteCode({ api_data: dataToSend, stack: aiProjectInitialization.stack });
                        itemToReturn['api_code'] = response;
                    }
                    return itemToReturn;
                } else {
                    return item;
                }
            }));

            console.log("updatedApis :::::::::::::::::::::: ", updatedApis)

            let response
            if (!changeTemporary) await UserProjectApi.updateProject({
                projectId: selectedProject?.id,
                aiProjectInitialization: { ...aiProjectInitialization, baseAPIs: updatedApis }
            })
            const updatedItem = updatedApis.find(item => item.id === selectedAPINode?.id);
            if (updatedItem) {
                setSelectedAPINode(updatedItem);
                console.log("updatedItemupdatedItem 1", updatedItem)
                if (changeTemporary) setAiProjectInitialization({ ...aiProjectInitializationState, baseAPIs: updatedApis })
                else setAiProjectInitializationState({ ...aiProjectInitializationState, baseAPIs: updatedApis })
                // setAiProjectInitialization({ ...aiProjectInitializationState, baseAPIs: updatedApis })
                console.log("updatedItemupdatedItem 2", { ...aiProjectInitializationState, baseAPIs: updatedApis })
                setCodeView({ ...codeView, code: stepCode })
                console.log("updatedItemupdatedItem 3", { ...codeView, code: stepCode })
            }

            if (response && response.status) {
                showNotification("success", "Code Updated!")
            }
        } catch (error) {
            console.log("error in update code ", error)
            showNotification("error", "Something went wrong, please try again later.")
        }
        setOpenBackdrop(false)
    }

    const handleUpdateCodeFullApi = async () => {
        setOpenBackdrop(true)
        try {
            console.log("editorRef.current.editor.getValue()", aiProjectInitialization, fullCodeEditorRef.current.editor.getValue())
            let resss = await langchainApi.testNodeApiCompleteCodeUpdate({
                stack: aiProjectInitialization?.stack, api_code: fullCodeEditorRef.current.editor.getValue(), function_list: functionsList.map(item => {
                    return {
                        id: item.id,
                        name: item.name,
                        description: item.description
                    }
                })
            })
            console.log("resssssssssssssss before ", resss)
            try {
                let functionListToBeInserted = []
                resss.map((item, i) => {
                    if (item?.isFunction && item.isFunction.toLowerCase() === "yes") {
                        if (item?.existingFunction && item.existingFunction.toLowerCase() === "no") {
                            functionListToBeInserted.push({
                                name: item.functionName,
                                description: item?.codeDocumentation ? item.codeDocumentation : item.stepDescription,
                                code: item.code,
                                projectId: selectedProject?.id
                            })
                            resss[i].existingFunction = "yes"
                        } else {
                            resss[i]['code'] = (functionsList.find(elem => elem.id === item.functionId))?.code
                        }
                    }
                })
                console.log("resssssssssssssss after ", resss)

                if (functionListToBeInserted.length > 0) {
                    const response = await UserProjectApi.addFunctionList({ functionList: functionListToBeInserted })
                    setFunctionsList(prev => [...prev, ...response.functionList])
                }
            } catch (error) {
                console.log("resssssssssssssss error", error)
            }


            let updatedApis = aiProjectInitialization.baseAPIs.map(item => {
                if (item.id === selectedAPINode.id) {
                    return {
                        ...item,
                        api_code: fullCodeEditorRef.current.editor.getValue(),
                        steps: resss
                    }
                } else return item
            })
            let response
            if (!changeTemporary) await UserProjectApi.updateProject({
                projectId: selectedProject?.id,
                aiProjectInitialization: { ...aiProjectInitialization, baseAPIs: updatedApis }
            })
            const updatedItem = updatedApis.find(item => item.id === selectedAPINode?.id);
            if (updatedItem) {
                setSelectedAPINode(updatedItem);
                if (changeTemporary) setAiProjectInitialization({ ...aiProjectInitializationState, baseAPIs: updatedApis })
                else setAiProjectInitializationState({ ...aiProjectInitializationState, baseAPIs: updatedApis })
                // setAiProjectInitialization({ ...aiProjectInitializationState, baseAPIs: updatedApis })
                setCodeView({ ...codeView, code: fullCodeEditorRef.current.editor.getValue() })
            }

            if (response && response.status) {
                showNotification("success", "Code Updated!")
            }
        } catch (error) {
            console.log("error in update code ", error)
            showNotification("error", "Something went wrong, please try again later.")
        }
        setOpenBackdrop(false)
    }

    const handleTestCode = async () => {
        if (selectedAPINode?.apiTestResponse && selectedAPINode.apiTestResponse.length > 0) {
            setTestFullCodeModal({ ...testFullCodeModal, open: true })
            return
        }
        setOpenBackdrop(true)
        const response = await langchainApi.testNodeApiTestCode({ api_code: selectedAPINode?.api_code })
        setTestFullCodeModal({ open: true, data: response })
        setOpenBackdrop(false)
    }

    const handleReRunTestCode = async () => {
        setOpenBackdrop(true)
        setTestFullCodeModal({ ...testFullCodeModal, open: false })
        let { apiTestResponse, ...rest } = selectedAPINode;
        setSelectedAPINode(rest)
        console.log("resttttttttttttt ", rest)
        const response = await langchainApi.testNodeApiTestCode({ api_code: selectedAPINode?.api_code })
        setTestFullCodeModal({ open: true, data: response })
        setOpenBackdrop(false)
    }

    const handleTryTest = async (formData) => {
        setTestFullCodeModal({ ...testFullCodeModal, open: false })
        setOpenBackdrop(true)
        let response2;
        if (aiProjectInitialization.stack === "Python") {
            // response2 = await langchainApi.testNodeApiTestPythonCode({ api_data: selectedAPINode, test_input: formData })
            const ress = await ReadFolderAPI.createNewPythonProjectStructure({
                // data: response2,
                projectId: selectedProject?.id,
                // apiId: selectedAPINode?.id
            });
            let mockdb = ress.inputForNextPrompt['mock_database.py']
            let mainFile = ress.inputForNextPrompt['main.py']
            response2 = await langchainApi.testNodeApiTestPythonCodeStructure({ api_data: selectedAPINode, test_input: formData, mock_database_file: mockdb, main_file: mainFile })
        } else {
            // response2 = await langchainApi.testNodeApiTestNodeCode({ api_data: selectedAPINode, test_input: formData })
            const ress = await ReadFolderAPI.createNewNodeProjectStructure({
                // data: response2,
                projectId: selectedProject?.id,
                // apiId: selectedAPINode?.id
            });
            let mockdb = ress.inputForNextPrompt['mock_database.js']
            let mainFile = ress.inputForNextPrompt['main.js']
            response2 = await langchainApi.testNodeApiTestPythonCodeStructure({ api_data: selectedAPINode, test_input: formData, mock_database_file: mockdb, main_file: mainFile })
        }
        const ress = await ReadFolderAPI.saveNewProjectStructure({
            data: response2,
            projectId: selectedProject?.id,
            apiId: selectedAPINode?.id
        });
        let updatedData = {
            ...aiProjectInitialization, baseAPIs: aiProjectInitialization.baseAPIs.map(item => {
                if (item.id === selectedAPINode.id) {
                    let updatedAPINode = { ...item, apiTestResponse: ress.commandOutput }
                    setSelectedAPINode(updatedAPINode)
                    return updatedAPINode
                } else return item
            })
        }
        if (!changeTemporary) await UserProjectApi.updateProject({
            projectId: selectedProject?.id,
            aiProjectInitialization: updatedData
        })
        if (changeTemporary) setAiProjectInitialization(updatedData)
        else setAiProjectInitializationState(updatedData)
        // setAiProjectInitialization(updatedData)
        setOpenBackdrop(false)
        setTestFullCodeModal({ ...testFullCodeModal, open: true, projectStructure: response2, commandOutput: ress.commandOutput })
    }

    const syncBackendBuilderProject = () => {
        document.querySelector('input[name="Sync Project"]').click();
    }

    const handleFileChangeSync = async (e) => {
        const file = e.target.files[0];
        var formdata = new FormData();
        formdata.append("file", file, file.name);
        formdata.append("stack", aiProjectInitializationState?.stack);
        formdata.append("projectId", selectedProject?.id);
        const response = await UserProjectApi.generateAPIList(formdata)
        let apiData = ""
        response.allAPIs.forEach(item => {
            apiData += `- ${item.name} \n`
        })
        // setDataPreview(apiData)
        // setExistingProject(true)
        // setExistingProjectData(response.allAPIs)
        // setFunctionsList(prev => [...prev, ...response.functionList])
    }

    const handleResetAPIFlow = async () => {
        const response = await UserProjectApi.deleteFunctionList(selectedProject?.id)

        await UserProjectApi.updateProject({
            projectId: selectedProject?.id,
            aiProjectInitialization: null
        })
        let dataToSet = {
            highLevelRequirements: "",
            stack: "NodeJS",
            storage: "mongodb",
            baseHeading: "",
            initialized: false,
            baseAPIs: []
        }

        setAiProjectInitializationState(dataToSet)
        // setAiProjectInitialization(dataToSet)
        setCodeView()
    }

    const handleAddAPINode = async () => {
        setOpenBackdrop(true);
        setIsModalOpen()
        let updatedData = {
            ...aiProjectInitialization,
            baseAPIs: [
                ...aiProjectInitialization.baseAPIs,
                { apiName: name, description: description, id: generateRandomId() }
            ]
        }
        if (!changeTemporary) await UserProjectApi.updateProject({
            projectId: selectedProject?.id,
            aiProjectInitialization: updatedData
        })
        if (changeTemporary) setAiProjectInitialization(updatedData)
        else setAiProjectInitializationState(updatedData)
        // setAiProjectInitialization(updatedData)
        setName("");
        setDescription("");
        setOpenBackdrop(false);
    }

    const handleRemoveAPINode = async (i) => {
        setOpenBackdrop(true)
        const updatedAPIs = [...aiProjectInitialization.baseAPIs];
        updatedAPIs.splice(i, 1); // Remove the item at index i
        let updatedData = {
            ...aiProjectInitialization,
            baseAPIs: updatedAPIs
        }

        if (!changeTemporary) await UserProjectApi.updateProject({
            projectId: selectedProject?.id,
            aiProjectInitialization: updatedData
        })
        if (changeTemporary) setAiProjectInitialization(updatedData)
        else setAiProjectInitializationState(updatedData)
        // setAiProjectInitialization(updatedData);
        if (aiProjectInitialization.baseAPIs[i].id === selectedAPINode?.id) {
            setSelectedAPINode()
            setCodeView()
        }
        setOpenBackdrop(false)
    }

    const handleAddStepNode = async () => {
        setIsModalOpen()
        setOpenBackdrop(true)
        console.log("stepPos  ", stepPos + 2)
        const newStepData = {
            "stepNo": stepPos + 2,
            "stepName": name,
            "stepDescription": description,
            "type": "local",
            "code": "",
            "codeDocumentation": ""
        } // Create a new step object

        let newSteps = (selectedAPINode?.steps || []).map(item => {
            if (item.stepNo >= stepPos + 2) return { ...item, stepNo: item.stepNo + 1 }
            return item
        })

        newSteps.splice(stepPos + 1, 0, newStepData);
        const responseStep = await langchainApi.testNodeApiTestGenerateStepCode({ step_data: newStepData, api_data: { ...selectedAPINode, steps: newSteps }, stack: aiProjectInitialization.stack, storage: aiProjectInitialization?.storage, function_lists: functionsList });
        newSteps = newSteps.map(step => step.stepNo === responseStep.stepNo ? responseStep : step);


        let newApiCode = selectedAPINode?.api_code
        let updatedData = {
            ...aiProjectInitialization,
            baseAPIs: await Promise.all(aiProjectInitialization.baseAPIs.map(async (item) => {
                if (item.id === selectedAPINode.id) {
                    let updatedNode = { ...selectedAPINode, steps: newSteps };

                    if (updatedNode?.api_code) {
                        let dataToSend = { ...updatedNode, database: aiProjectInitialization?.storage };
                        const responseCode = await langchainApi.testNodeApiCompleteCode({ api_data: dataToSend, stack: aiProjectInitialization.stack });
                        updatedNode['api_code'] = responseCode;
                        newApiCode = responseCode
                    }
                    return updatedNode
                } else {
                    return item;
                }
            }))
        };

        console.log(updatedData)

        if (!changeTemporary) await UserProjectApi.updateProject({
            projectId: selectedProject?.id,
            aiProjectInitialization: updatedData
        });

        setSelectedAPINode(prevState => ({
            ...prevState,
            api_code: newApiCode,
            steps: newSteps,
        }));

        if (changeTemporary) setAiProjectInitialization(updatedData)
        else setAiProjectInitializationState(updatedData)
        // setAiProjectInitialization(updatedData);
        setName("");
        setDescription("");
        setOpenBackdrop(false)
    };

    const handleRemoveStepNode = async (i) => {
        setOpenBackdrop(true)
        let updatedSteps = [...selectedAPINode.steps];
        updatedSteps.splice(i, 1);

        for (let j = i; j < updatedSteps.length; j++) {
            if (j >= i)
                updatedSteps[j] = { ...updatedSteps[j], stepNo: updatedSteps[j].stepNo - 1 }
        }

        let updatedAPIs = await Promise.all(aiProjectInitialization.baseAPIs.map(async (item) => {
            if (item.id === selectedAPINode.id) {
                let updatedNode = { ...selectedAPINode, steps: updatedSteps };
                if (updatedNode?.api_code) {
                    let dataToSend = { ...updatedNode, database: aiProjectInitialization?.storage };
                    const responseCode = await langchainApi.testNodeApiCompleteCode({ api_data: dataToSend, stack: aiProjectInitialization.stack });
                    updatedNode['api_code'] = responseCode;
                }
                return updatedNode;
            } else {
                return item;
            }
        }));

        let updatedData = {
            ...aiProjectInitialization,
            baseAPIs: updatedAPIs
        };

        if (!changeTemporary) await UserProjectApi.updateProject({
            projectId: selectedProject?.id,
            aiProjectInitialization: updatedData
        })
        setSelectedAPINode({ ...selectedAPINode, steps: updatedSteps })
        if (changeTemporary) setAiProjectInitialization(updatedData)
        else setAiProjectInitializationState(updatedData)
        // setAiProjectInitialization(updatedData);
        if (selectedAPINode.steps[i]?.stepNo === codeView?.stepNo) setCodeView()
        setOpenBackdrop(false)
    }

    const handleSubmitAPIChanges = async () => {
        if (userChangeQuery.trim() === "") return
        setOpenBackdrop(true)
        const response = await langchainApi.testNodeApiCurrentApiChange({
            update_query: userChangeQuery, api_code: selectedAPINode?.api_code, stack: aiProjectInitialization?.stack, function_list: functionsList.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    description: item.description
                }
            })
        })
        setAiProjectInitialization(prev => {
            return {
                ...prev,
                baseAPIs: prev.baseAPIs.map(item => {
                    if (item?.id === selectedAPINode?.id) {
                        let newSelectedApiNode = { ...selectedAPINode, api_code: response?.api_code, steps: response?.steps }
                        setSelectedAPINode(newSelectedApiNode)
                        let updatedStep = response.steps.find(step => step.stepNo === codeView.stepNo)
                        setCodeView(updatedStep)
                        return newSelectedApiNode
                    } else return item
                })
            }
        })
        setChangeTemporary(true)
        setOpenBackdrop(false)
    }

    const handleSubmitProjectChanges = async () => {
        if (userChangeQuery.trim() === "") return
        setOpenBackdrop(true)
        const response = await langchainApi.testNodeApiSix({ update_query: userChangeQuery, api_data: aiProjectInitialization, stack: aiProjectInitialization?.stack, storage: aiProjectInitialization?.storage, function_lists: functionsList })
        if (response?.modified_data && response.modified_data.length > 0) {
            let updatedRes = aiProjectInitialization.baseAPIs.map((element) => {
                const isPresent = response.modified_data.find(obj => obj.apiName === element.apiName);
                console.log("vvvvvvvvvvvvvvvvvvvvvvvvv ddd", isPresent, element.steps)
                if (isPresent) {
                    let newStepsArr = []
                    let updatedArr = isPresent.steps.map(item => {
                        if (item?.stepExists && item?.stepExists.toLowerCase() === "yes") {
                            return item
                        } else {
                            newStepsArr.push(item)
                        }
                    })
                    let updatedStep = {
                        ...element, steps: element?.steps && element?.steps.map(stepEle => {
                            let found = updatedArr.find(objj => (objj?.stepNo && objj?.stepNo.toString()) === (stepEle?.stepNo && stepEle?.stepNo.toString()))
                            if (found) return { ...found, stepNo: parseInt(found.stepNo) }
                            else return stepEle
                        })
                    }
                    newStepsArr.map(ittem => {
                        if (ittem?.newStepPlacement) {
                            if (ittem.newStepPlacement?.afterStep) {
                                let newSt = []
                                updatedStep.steps.forEach((elem, i) => {
                                    if (ittem.newStepPlacement?.afterStep == elem?.stepNo) {
                                        newSt.push(elem)
                                        newSt.push({ ...ittem, stepNo: elem?.stepNo + 1 })
                                        ittem['stepNo'] = elem?.stepNo + 1
                                    }
                                    else if (i + 1 >= parseInt(ittem?.stepNo)) {
                                        newSt.push({ ...elem, stepNo: elem.stepNo + 1 })
                                    } else {
                                        newSt.push(elem)
                                    }
                                });
                                updatedStep['steps'] = newSt
                            }
                            if (ittem.newStepPlacement?.beforeStep) {
                                let newSt = []
                                updatedStep.steps.forEach((elem, i) => {
                                    if (ittem.newStepPlacement?.beforeStep == elem?.stepNo) {
                                        newSt.push({ ...ittem, stepNo: elem?.stepNo })
                                        newSt.push({ ...elem, stepNo: elem.stepNo + 1 })
                                    }
                                    else if (i + 1 >= parseInt(ittem?.newStepPlacement?.beforeStep)) {
                                        newSt.push({ ...elem, stepNo: elem.stepNo + 1 })
                                    } else {
                                        newSt.push(elem)
                                    }
                                });
                                updatedStep['steps'] = newSt
                            }
                        }
                    })
                    console.log("Updatesssssssssssssssssss ", updatedStep)

                    if (updatedStep?.api_code) {
                        let dataToSend = { ...updatedStep, database: aiProjectInitialization?.storage };
                        langchainApi.testNodeApiCompleteCode({ api_data: dataToSend, stack: aiProjectInitialization.stack }).then(responseCode => {
                            updatedStep['api_code'] = responseCode;
                        })
                        return updatedStep
                    } else return updatedStep
                }
                else return element
            });
            console.log("vvvvvvvvvvvvvvvvvvvvvvvvv", updatedRes)
            let updatedData = { ...aiProjectInitialization, baseAPIs: updatedRes }

            // await UserProjectApi.updateProject({
            //     projectId: selectedProject?.id,
            //     aiProjectInitialization: updatedData
            // })
            setSelectedAPINode(prev => {
                return updatedData.baseAPIs.find(item => item?.id === prev?.id)
            })
            setAiProjectInitialization(updatedData)
        } else {

            let functionListToBeInserted = []

            let updatedData = {
                ...aiProjectInitialization, baseAPIs: [...aiProjectInitialization.baseAPIs, ...response.new_data.map(item => {
                    item.steps.map((subItem, i) => {
                        if (subItem?.isFunction && subItem.isFunction.toLowerCase() === "yes" && subItem?.existingFunction && subItem.existingFunction.toLowerCase() === "no") {
                            functionListToBeInserted.push({
                                name: subItem.functionName,
                                description: subItem.stepDescription,
                                code: subItem.code,
                                projectId: selectedProject?.id
                            })
                            item.steps[i].existingFunction = "yes"
                        }
                    })

                    return { ...item, id: generateRandomId() }
                })]
            }

            if (functionListToBeInserted.length > 0) {
                const response = await UserProjectApi.addFunctionList({ functionList: functionListToBeInserted })
                setFunctionsList(prev => [...prev, ...response.functionList])
            }

            // await UserProjectApi.updateProject({
            //     projectId: selectedProject?.id,
            //     aiProjectInitialization: updatedData
            // })
            setSelectedAPINode(prev => {
                return updatedData.baseAPIs.find(item => item?.id === prev?.id)
            })
            setAiProjectInitialization(updatedData)
        }
        setChangeTemporary(true)
        setOpenBackdrop(false)
    }


    const handleSaveAllChanges = async () => {
        await UserProjectApi.updateProject({
            projectId: selectedProject?.id,
            aiProjectInitialization: aiProjectInitialization
        })
        setAiProjectInitializationState(aiProjectInitialization)

        setChangeTemporary(false)

    }

    const handleCopy = () => {
        setCopiedText(true)
        setTimeout(() => setCopiedText(false), 2000);
    }

    const decideColor = (targetId) => {
        let targetItem = aiProjectInitialization.baseAPIs.find(item => item.id === targetId)
        // console.log("aaaaaaaaaaaa ????????", targetItem)
        return aiProjectInitializationState.baseAPIs.find(baseApi => baseApi?.id === targetId && arraysEqual(JSON.stringify(baseApi), JSON.stringify(targetItem))) ? "white" : "rgb(252, 221, 203)"
    }


    const arraysEqual = (a, b) => {
        // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaafdffff ", a, b)
        if (a === b) return true;
        // if (a == null || b == null) return false;
        // if (a.length !== b.length) return false;

        // for (let i = 0; i < a.length; ++i) {
        //   if (a[i] !== b[i]) return false;
        // }
        return true;
    };

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

    const handleUploadFileAndGenerate = async () => {
        var formdata = new FormData();
        formdata.append("file", fileInput, fileInput.name);
        formdata.append("stack", aiProjectInitializationState?.stack);
        formdata.append("projectId", selectedProject?.id);
        const response = await UserProjectApi.generateAPIList(formdata)
        let apiData = ""
        response.allAPIs.forEach(item => {
            apiData += `- ${item.name} \n`
        })
        setDataPreview(apiData)
        setExistingProject(true)
        setExistingProjectData(response.allAPIs)
        setFunctionsList(prev => [...prev, ...response.functionList])
    }

    const handleDoubleClick = (item, index) => {
        console.log("Double click on:", item, index);
        // Add your double-click logic here
        setEditableAPI(item)
    };

    let clickTimeout = null;

    const handleClick = (item, index) => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null;
            handleDoubleClick(item, index);
        } else {
            clickTimeout = setTimeout(() => {
                handleClickAPINode(item, index);
                clickTimeout = null;
            }, 200);
        }
    };

    const handleClickStep = (item, index) => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null;
            setEditableStep(item)
        } else {
            clickTimeout = setTimeout(() => {
                handleGenerateCode(item, index);
                clickTimeout = null;
            }, 200);
        }
    };

    const createFunctionSteps = async (item, i) => {
        console.log("functionStepChainfunctionStepChain 0000 ", item)
        let foundFunctionList = functionsList.find(elem => elem.id === item.functionId)
        if (!foundFunctionList?.steps) {
            setOpenBackdrop(true)
            const response = await langchainApi.createStepsForFunction({ function_list: functionsList, stack: aiProjectInitialization.stack, functionCode: item?.code });
            if(response?.steps) {
                await UserProjectApi.updateFunctionList({functionListId: item.functionId, steps: response.steps})
            }
            setFunctionsList(prev => [...prev.map(elem => {
                if (elem.id === item.functionId) return { ...elem, steps: response.steps }
                else return elem
            })])
            let updatedData = {
                ...selectedAPINode, steps: selectedAPINode.steps.map(apiItem => {
                    if (apiItem.functionId === item.functionId) return { ...apiItem, steps: response.steps }
                    else return apiItem
                })
            }
            setAiProjectInitializationState(prev => ({
                ...prev, baseAPIs: prev.baseAPIs.map(elem => {
                    if (elem.id === updatedData.id) return updatedData
                    else return elem
                })
            }))
            setSelectedAPINode(updatedData)
            setFunctionStepChain(prev => {
                // Create a new array from prev
                const newPrev = [...prev];
              
                // If prev has any items, set the current value of the last item to false
                if (newPrev.length > 0) {
                  newPrev[newPrev.length - 1].current = false;
                } else {
                    newPrev.push({ ...selectedAPINode, current: false })
                }
              
                // Append the new item with current set to true
                newPrev.push({ ...item, ...response, current: true });
              
                // Return the updated array
                return newPrev;
            });              
            // setFunctionStepChain(prev => [...prev, { ...item, ...response, current: true }])
            setOpenBackdrop(false)
        }
        else {
            setFunctionStepChain(prev => {
                // Create a new array from prev
                const newPrev = [...prev];
              
                // If prev has any items, set the current value of the last item to false
                if (newPrev.length > 0) {
                  newPrev[newPrev.length - 1].current = false;
                } else {
                    newPrev.push({ ...selectedAPINode, current: false })
                }
              
                // Append the new item with current set to true
                newPrev.push({ ...item, ...foundFunctionList, current: true });
              
                // Return the updated array
                return newPrev;
              });
              
            // setFunctionStepChain(prev => [...prev, { ...item, ...foundFunctionList, current: true }])
        }
        setCodeView()
        // handleClickStep(item, i)
    }
    useEffect(() => {
        console.log("ffffffffffffffffff ", functionStepChain)
    }, [functionStepChain])


    function updateCurrentFlag() {
        console.log("functionStepChain ><><><>< ", functionStepChain)

        let apiList = functionStepChain.map(item => ({ ...item }));
        console.log("apiListapiList before ", apiList)
        const currentIndex = apiList.findIndex(step => step.current === true);
        console.log(currentIndex)
        if(currentIndex === 0) {
            return setFunctionStepChain([]);
        }
        if (currentIndex > 0) {
            apiList[currentIndex].current = false;
            apiList[currentIndex - 1].current = true;
        }
        console.log("apiListapiList after ", apiList)
        setFunctionStepChain(apiList);
        // setFunctionStepChain([])
    }
    
    function updateCurrentFlagForward() {
        let apiList = functionStepChain.map(item => ({ ...item }));
        const currentIndex = apiList.findIndex(step => step.current === true);
        if (currentIndex < apiList.length - 1) {
            apiList[currentIndex].current = false;
            apiList[currentIndex + 1].current = true;
        }
        setFunctionStepChain(apiList);
      }

    const handleDoneRename = async () => {
        if (selectedAPINode?.apiName === editableAPI?.apiName) return
        let updatedData = {
            ...aiProjectInitialization,
            baseAPIs: aiProjectInitialization.baseAPIs.map(item => {
                if (item.id === editableAPI?.id) return editableAPI
                else return item
            })
        }
        await UserProjectApi.updateProject({
            projectId: selectedProject?.id,
            aiProjectInitialization: updatedData
        })
        setAiProjectInitializationState(updatedData)
        setSelectedAPINode(editableAPI)
        setEditableAPI(null)
    }

    const handleDoneRenameStep = async () => {
        // if(selectedAPINode?.apiName === editableAPI?.apiName) return
        let updatedData = {
            ...aiProjectInitialization,
            baseAPIs: aiProjectInitialization.baseAPIs.map(item => {
                if (item.id === selectedAPINode?.id) {
                    let dd = {
                        ...selectedAPINode,
                        steps: selectedAPINode.steps.map(subItem => {
                            if (subItem?.stepNo === editableStep?.stepNo) return editableStep
                            else return subItem
                        })
                    }
                    setSelectedAPINode(dd)
                    return dd
                }
                else return item
            })
        }
        await UserProjectApi.updateProject({
            projectId: selectedProject?.id,
            aiProjectInitialization: updatedData
        })
        setAiProjectInitializationState(updatedData)
        setEditableStep(null)
    }


    const handleDoubleClickAPINode = (item, index) => {
        // Add your double-click logic here
        console.log("Double-clicked on:", item, index);
    };



    useEffect(() => {
        if (selectedProject?.aiProjectInitialization) {
            setAiProjectInitializationState(selectedProject.aiProjectInitialization)
            // setAiProjectInitialization(selectedProject.aiProjectInitialization)
        }
        if (selectedProject?.id) {
            (async () => {
                const response = await UserProjectApi.getFunctionList(selectedProject?.id)
                setFunctionsList(response?.functionList || [])
            })()
        }
    }, [selectedProject]);

    useEffect(() => {
        // setAiProjectInitialization(prev => {
        //     const prevAPIs = prev.baseAPIs;
        //     const result = aiProjectInitializationState.baseAPIs.map(element => {
        //         const foundItem = prevAPIs.find(item => item.id === element.id);
        //         return foundItem ? foundItem : element;
        //     });
        //     console.log("::: 111", aiProjectInitializationState.baseAPIs)
        //     console.log("::: 222", result)

        //     return {
        //         ...aiProjectInitializationState,
        //         baseAPIs: result
        //     };
        // });
        setAiProjectInitialization(aiProjectInitializationState)
    }, [aiProjectInitializationState]);


    // useEffect(() => {
    //     console.log("aaaaaaaaaaaaaaaaa ", aiProjectInitializationState, aiProjectInitialization, (JSON.stringify(aiProjectInitializationState) === JSON.stringify(aiProjectInitialization)))
    // }, [aiProjectInitialization])


    return (
        <div style={{ width: '100%', height: '100%', display: "flex", flexDirection: "column" }}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {!aiProjectInitialization?.initialized && <Box sx={{ bgcolor: 'background.paper', width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "30px" }}>
                <div style={{ width: "70%", minWidth: "500px" }}>
                    <AppBar position="static">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="secondary"
                            textColor="inherit"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                            <Tab label="Requirements" {...a11yProps(0)} />
                            <Tab label="Stack" {...a11yProps(1)} />
                            <Tab label="Storage" {...a11yProps(2)} />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value}
                        onChangeIndex={handleChangeIndex}
                        style={{
                            height: "100%",
                            flexGrow: "1",
                        }}
                    >
                        <TabPanel style={{
                            height: "100%",
                        }} value={value} index={0} dir={theme.direction}>
                            {dataPreview ? <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <label htmlFor='dataPreviewRequirement'>Backend Design generated below:</label>
                                <div id="dataPreviewRequirement" style={{
                                    maxWidth: "800px",
                                    width: "60%",
                                    minWidth: "350px",
                                    minHeight: "225px",
                                    height: "auto",
                                    borderRadius: "5px",
                                    outline: "none",
                                    padding: "15px",
                                    background: "white",
                                    border: "1px solid #DCDCDC",
                                    whiteSpace: "pre-wrap"
                                }}>
                                    <span>{dataPreview}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-around" }}>
                                    {!existingProject && <Button
                                        variant="outlined"
                                        className="mt-2 text-capitalize"
                                        style={{
                                            color: "#F07227",
                                            border: "1px solid #F07227",
                                            margin: "10px 15px"
                                        }}
                                        sx={{
                                            ":hover": {
                                                bgcolor: "#FCE9E9",
                                            },
                                        }}
                                        onClick={handleSubmitRequirement}
                                    >
                                        Regenerate
                                    </Button>}

                                    <Button
                                        variant="outlined"
                                        className="mt-2 text-capitalize"
                                        style={{
                                            color: "#F07227",
                                            border: "1px solid #F07227",
                                            margin: "10px 15px"
                                        }}
                                        sx={{
                                            ":hover": {
                                                bgcolor: "#FCE9E9",
                                            },
                                        }}
                                        onClick={handleGenerateRequirementJson}
                                    >
                                        Open Studio
                                    </Button>
                                </div>
                            </div> : <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <label htmlFor='backendbuilderrequirement' >Enter your requirements and let Aster AI design your backend</label>
                                <Input
                                    name="Requirement"
                                    placeholder={"Develop a backend system for a task management tool, allowing users to create, assign, and track tasks"}
                                    type="textbox"
                                    id="backendbuilderrequirement"
                                    onChange={(e) => {
                                        let dataToSet = { ...aiProjectInitialization, highLevelRequirements: e.target.value }
                                        setAiProjectInitializationState(dataToSet)
                                        // setAiProjectInitialization(dataToSet)
                                    }}
                                    style={{
                                        maxWidth: "800px",
                                        width: "60%",
                                        minWidth: "350px",
                                        minHeight: "225px",
                                        height: "auto",
                                        borderRadius: "5px",
                                        outline: "none",
                                        padding: "15px",
                                        background: "white",
                                        border: "1px solid #DCDCDC",
                                    }}
                                    value={aiProjectInitialization.highLevelRequirements}
                                />

                                <div style={{ display: "flex" }}>
                                    <Button
                                        variant="outlined"
                                        className="mt-2"
                                        style={{
                                            color: "#F07227",
                                            border: "1px solid #F07227",
                                            margin: "8px"
                                        }}
                                        sx={{
                                            ":hover": {
                                                bgcolor: "#FCE9E9",
                                            },
                                        }}
                                        onClick={handleSubmitRequirement}
                                    >
                                        Generate
                                    </Button>

                                    <div>
                                        <input
                                            onChange={handleFileChange}
                                            name="Plugin File"
                                            placeholder="Plugin File"
                                            type="file"
                                            accept=".zip"
                                            message="max Size limit 50mb"
                                            messages={["Files must be less than 50mb.", "Allowed file types: zip"]}
                                            style={{
                                                display: "none",
                                            }}
                                        />
                                        <Button
                                            variant="outlined"
                                            className="mt-2"
                                            style={{
                                                color: "#F07227",
                                                border: "1px solid #F07227",
                                                margin: "8px"
                                            }}
                                            sx={{
                                                ":hover": {
                                                    bgcolor: "#FCE9E9",
                                                },
                                            }}
                                            onClick={handleButtonClick} // Trigger the file input click
                                        >
                                            Select File
                                        </Button>
                                        {fileName && (
                                            <Button
                                                variant="outlined"
                                                className="mt-2"
                                                style={{
                                                    color: "#F07227",
                                                    border: "1px solid #F07227",
                                                    margin: "8px"
                                                }}
                                                sx={{
                                                    ":hover": {
                                                        bgcolor: "#FCE9E9",
                                                    },
                                                }}
                                                onClick={handleUploadFileAndGenerate} // Trigger the file upload function
                                            >
                                                Upload
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p>{fileName}</p>
                                </div>
                            </div>}
                        </TabPanel>
                        <TabPanel style={{
                            height: "100%",
                        }} value={value} index={1} dir={theme.direction}>
                            <div className="" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                <FormGroup>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography>NodeJS</Typography>
                                        <IOSSwitch onChange={handleSwitchChange} sx={{ m: 1 }} checked={aiProjectInitialization.stack === "Python"} inputProps={{ 'aria-label': 'ant design' }} />
                                        <Typography>Python</Typography>
                                    </Stack>
                                </FormGroup>
                            </div>
                        </TabPanel>
                        <TabPanel style={{
                            height: "100%",
                        }} value={value} index={2} dir={theme.direction}>
                            {/* <div>
                            <FormControl>
                                <FormLabel id="demo-controlled-radio-buttons-group">DataBase</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={dbValue}
                                    onChange={handleChangeDb}
                                >
                                    <FormControlLabel value="mongodb" control={<Radio />} label="MongoDb" />
                                    <FormControlLabel value="postgres" control={<Radio />} label="Postgresql" />
                                </RadioGroup>
                            </FormControl>
                        </div> */}

                            <div className="" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                <FormGroup>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography>MongoDB</Typography>
                                        <IOSSwitch onChange={(e) => setAiProjectInitialization({ ...aiProjectInitialization, storage: e.target.checked ? "postgresql" : "mongodb" })} sx={{ m: 1 }} checked={aiProjectInitialization?.storage === "postgresql"} inputProps={{ 'aria-label': 'ant design' }} />
                                        <Typography>Postgresql</Typography>
                                    </Stack>
                                </FormGroup>
                            </div>
                        </TabPanel>
                    </SwipeableViews>
                </div>
            </Box>}

            <Modal open={isModalOpen} onClose={() => setIsModalOpen()}>
                {isModalOpen === "api" ? <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Enter API Details
                    </Typography>
                    <TextField
                        label={"API Name"}
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label={"API Description"}
                        variant="outlined"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button className='text-capitalize' onClick={handleAddAPINode}>Add</Button>
                </Box> : <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 700, bgcolor: "whitesmoke", boxShadow: 24, p: 4, display: "flex" }}>
                    <div>
                        <label htmlFor='stepname'>
                            Search Global functions and Standard templates
                        </label>
                        <Input
                            label={"Step Name"}
                            id="stepname"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{ mb: 2 }}
                            type={"text"}
                            style={{
                                width: "100%",
                                height: "45px"
                            }}
                        />

                        <label htmlFor='stepname'>
                            Description
                        </label>
                        <Input
                            label={"Step Description"}
                            id="stepdescription"
                            variant="outlined"
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{ mb: 2 }}
                            type={"textbox"}
                            style={{
                                width: "100%",
                                height: "45px",
                                minHeight: "250px"
                            }}
                        />
                        <Button className='text-capitalize' onClick={handleAddStepNode}>Generate Code and Add Step</Button>
                    </div>
                    <div style={{ marginLeft: "15px" }}>
                        <Button className='text-capitalize' onClick={() => { }}>Search</Button>
                        <div style={{
                            width: "200px",
                            height: "calc(100% - 37px)",
                            backgroundColor: "white"
                        }}>
                            <div style={{}}><span>Templates found</span></div>
                        </div>
                    </div>
                </Box>}
            </Modal>

            <Modal open={testFullCodeModal.open} onClose={() => { }}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "auto", minWidth: 700, maxHeight: "90%", maxWidth: "85%", bgcolor: "whitesmoke", boxShadow: 24, p: 4, display: "flex" }}>
                    {selectedAPINode?.apiTestResponse ? <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ width: "100%", height: "40px", backgroundColor: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h4 style={{ margin: "0 0 0 10px" }}>Test Output : </h4>
                            <Tooltip title="Retest API">
                                <IconButton onClick={handleReRunTestCode}>
                                    <RepeatOnIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div style={{ margin: "10px 0", width: "100%", flexGrow: "1", overflowY: "auto" }}>
                            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                <code>
                                    {selectedAPINode?.apiTestResponse}
                                </code>
                            </pre>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                className='text-capitalize'
                                variant="outlined"
                                style={{
                                    color: "#F07227",
                                    border: "1px solid #F07227",
                                }}
                                sx={{
                                    ":hover": {
                                        bgcolor: "#FCE9E9",
                                    },
                                }}
                                onClick={() => setTestFullCodeModal({ ...testFullCodeModal, open: false })}
                            >
                                Close
                            </Button>
                        </div>
                    </div> : <div style={{ width: "100%", maxHeight: "80vh", overflowY: "auto" }}>
                        <h1 className="text-center my-4">API Inputs</h1>
                        {/* {testFullCodeModal?.data && <DynamicForm data={testFullCodeModal.data} handleTryTest={handleTryTest} onCancel={() => setTestFullCodeModal({...testFullCodeModal, open: false})} />} */}
                        <div style={{ width: "100%" }}>
                            <h4>Format</h4>
                            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                <code>
                                    {JSON.stringify(testFullCodeModal?.data, null, 2)}
                                </code>
                            </pre>
                        </div>
                        <div style={{ width: "100%" }}>
                            <AceEditor
                                mode="json"
                                theme="github"
                                value={jsonEditorValue}
                                onChange={(newValue) => {
                                    try {
                                        const parsedValue = JSON.parse(newValue);
                                        const formattedValue = JSON.stringify(parsedValue, null, 2);
                                        setJsonEditorValue(formattedValue);
                                        setIsValidJson(true);
                                    } catch (error) {
                                        setIsValidJson(false);
                                        setJsonEditorValue(newValue);
                                    }
                                }}
                                name="json-editor"
                                editorProps={{ $blockScrolling: true }}
                                setOptions={{
                                    showLineNumbers: true,
                                    tabSize: 2,
                                }}
                                style={{ width: "100%", height: "400px" }}
                            />
                            {!isValidJson && <div style={{ color: 'red' }}>Invalid JSON</div>}

                            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                <Button
                                    className='text-capitalize'
                                    variant="outlined"
                                    style={{
                                        color: "#F07227",
                                        border: "1px solid #F07227",
                                    }}
                                    sx={{
                                        ":hover": {
                                            bgcolor: "#FCE9E9",
                                        },
                                    }}
                                    onClick={() => handleTryTest(jsonEditorValue)}
                                >
                                    Run Test
                                </Button>

                                <Button
                                    className='text-capitalize'
                                    variant="outlined"
                                    style={{
                                        color: "#F07227",
                                        border: "1px solid #F07227",
                                        marginLeft: "15px"
                                    }}
                                    sx={{
                                        ":hover": {
                                            bgcolor: "#FCE9E9",
                                        },
                                    }}
                                    onClick={() => setTestFullCodeModal({ ...testFullCodeModal, open: false })}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>}
                </Box>
            </Modal>

            {aiProjectInitialization?.initialized && <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
                <div style={{ height: "auto", width: "100%", padding: "10px 15px" }}>
                    <div style={{ border: "1px solid lightgrey", borderRadius: "8px", padding: "10px 15px" }} className='shadow'>
                        <div className='d-flex'>
                            <div style={{ backgroundColor: "white", borderRadius: "8px", width: "auto", display: "flex", flexDirection: "column" }}>
                                <div style={{ width: "120px", margin: "6px", borderRadius: "8px", backgroundColor: searchType === "project" ? "#9C8A8A" : "whitesmoke", padding: "6px 8px" }} onClick={() => setSearchType("project")}>Whole Project</div>
                                <div style={{ width: "120px", margin: "6px", borderRadius: "8px", backgroundColor: searchType === "api" ? "#9C8A8A" : "whitesmoke", padding: "6px 8px" }} onClick={() => setSearchType("api")}>Current API</div>
                            </div>

                            <div className="chatFormContainer" style={{ borderRadius: "8px", boxShadow: "none", margin: "0 10px" }}>
                                <textarea
                                    className="chatFormInput"
                                    id="stepdescription"
                                    type={"text"}
                                    rows={1}
                                    placeholder={searchType === "api" ? "Make changes at the API level" : "Make changes at the Project level"}
                                    value={userChangeQuery}
                                    onChange={(e) => setUserChangeQuery(e.target.value)}
                                // onKeyDown={handleEnterModification}
                                />
                                <IconButton
                                    style={{
                                        backgroundColor: "#FCF0E9",
                                        cursor: "default",
                                        margin: "9px",
                                        width: "46px",
                                        height: "46px",
                                    }}
                                    onClick={searchType === "project" ? handleSubmitProjectChanges : handleSubmitAPIChanges}
                                    disabled={aiProjectInitialization !== aiProjectInitializationState}

                                >
                                    <i
                                        className={"chatFormSendIcon ri-send-plane-fill"}
                                    ></i>
                                </IconButton>
                            </div>

                            {JSON.stringify(aiProjectInitialization) !== JSON.stringify(aiProjectInitializationState) && <div style={{ backgroundColor: "white", borderRadius: "8px", width: "auto", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                                <Button
                                    className='text-capitalize'
                                    variant="outlined"
                                    style={{
                                        color: "#F07227",
                                        border: "1px solid #F07227",
                                        margin: "6px"
                                    }}
                                    sx={{
                                        ":hover": {
                                            bgcolor: "#FCE9E9",
                                        },
                                    }}
                                    onClick={handleSaveAllChanges}
                                >
                                    Save
                                </Button>
                                <Button
                                    className='text-capitalize'
                                    variant="outlined"
                                    style={{
                                        color: "#F07227",
                                        border: "1px solid #F07227",
                                        margin: "6px"
                                    }}
                                    sx={{
                                        ":hover": {
                                            bgcolor: "#FCE9E9",
                                        },
                                    }}
                                    onClick={() => {
                                        setAiProjectInitialization(aiProjectInitializationState)
                                        let selected = aiProjectInitializationState.baseAPIs.find(item => item?.id === selectedAPINode?.id)
                                        setSelectedAPINode(selected)
                                        setCodeView()
                                        setChangeTemporary(false)
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>}
                            <div style={{ width: "140px" }}>
                                <Tooltip title="Reset">
                                    <IconButton className='mx-2' onClick={handleResetAPIFlow}>
                                        <RestartAltIcon sx={{ color: "orange" }} />
                                    </IconButton>
                                </Tooltip>
                                {databaseView ? <Tooltip title="View API Structure">
                                    <IconButton className='mx-2' onClick={() => setDatabaseView(false)}>
                                        <i class="ri-code-s-slash-line" style={{ height: "24px", display: "flex", alignItems: "center", color: "rgb(40, 79, 163)" }}></i>
                                    </IconButton>
                                </Tooltip> : <Tooltip title="View DB Structure">
                                    <IconButton className='mx-2' onClick={() => setDatabaseView(true)}>
                                        <i class="ri-database-2-line" style={{ height: "24px", display: "flex", alignItems: "center", color: "rgb(40, 79, 163)" }}></i>
                                    </IconButton>
                                </Tooltip>}
                                <Tooltip title="View Functions">
                                    <IconButton className='mx-2' onClick={() => setViewFunctions(true)}>
                                        <i class="ri-function-line" style={{ height: "24px", display: "flex", alignItems: "center", color: "rgb(40, 79, 163)" }}></i>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Sync Project">
                                    <IconButton className='mx-2' onClick={() => syncBackendBuilderProject()}>
                                        <i class="ri-loop-left-line" style={{ height: "24px", display: "flex", alignItems: "center", color: "orange" }}></i>
                                    </IconButton>
                                </Tooltip>

                                <input
                                    onChange={handleFileChangeSync}
                                    name="Sync Project"
                                    placeholder="Plugin File"
                                    type="file"
                                    accept=".zip"
                                    message="max Size limit 50mb"
                                    messages={["Files must be less than 50mb.", "Allowed file types: zip"]}
                                    style={{
                                        display: "none",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Modal open={viewFunctions} onClose={() => setViewFunctions(false)}>
                    <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 900, height: "auto", maxHeight: "85%", bgcolor: "background.paper", boxShadow: 24, p: 4, overflowY: "auto", display: "flex", alignItems: "flex-start" }}>
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: "4px",
                                padding: "5px",
                                border: "1px solid lightgrey",
                                margin: "5px 0"
                            }}>
                            {
                                functionsList.map((item, index) => (

                                    <List
                                        sx={{ width: '100%', bgcolor: 'background.paper', padding: "0" }}
                                        component="nav"
                                        aria-labelledby="nested-list-subheader"
                                    >

                                        <ListItemButton onClick={() => addOrRemoveTabText(index)}>
                                            <ListItemIcon>
                                                <CodeIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={item?.name} primaryTypographyProps={{ fontWeight: '600' }} />
                                            {openCodeTabList.includes(index) ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>

                                        <Collapse in={openCodeTabList.includes(index)} timeout="auto" unmountOnExit>
                                            <List component="div" sx={{ pl: 4 }}>

                                                <b>Function Description:</b> <br />
                                                <span>{item.description}</span>
                                                <div style={{ display: "flex", width: "100%" }}>
                                                    <div style={{ width: "100%", }}>
                                                        <div style={{ height: "auto", background: "#f8f5f3" }}>
                                                            <div style={{ marginTop: "10px" }}>
                                                                <div style={{ width: "100%", display: "flex", justifyContent: 'space-between', alignItems: "center", paddingLeft: "10px", backgroundColor: "whitesmoke" }}>
                                                                    <span>Function Code</span>
                                                                    <CopyToClipboard text={"Code"} onCopy={() => { }}>
                                                                        <div style={{ backgroundColor: "#FCF0E9", padding: "8px", borderRadius: "4px", cursor: "pointer" }} onClick={() => { }}>
                                                                            <Tooltip title="Copy To ClipBoard">
                                                                                <i className="ri-file-copy-line"></i>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </CopyToClipboard>
                                                                </div>

                                                                <div style={{ width: "100%", overflowX: 'auto' }}>
                                                                    <SyntaxHighlighter language="javascript" style={docco}>
                                                                        {item.code}
                                                                    </SyntaxHighlighter>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </List>
                                        </Collapse>
                                    </List>
                                ))
                            }

                        </div>
                    </Box>
                </Modal>

                {aiProjectInitialization?.initialized && databaseView && <div style={{
                    width: "100%",
                    flexGrow: 1,
                    overflow: "auto",
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    {aiProjectInitialization?.baseAPIs && (
                        <div
                            style={{
                                width: "100%",
                                height: "auto",
                                display: "flex",
                                flexWrap: "wrap",
                                zIndex: 10,
                                margin: "30px",
                                overflowY: "auto"
                            }}
                            // className="shadow"
                            id="moreDetailsDivTwo"
                        >
                            {aiProjectInitialization.baseAPIs.map((item, i) => (
                                item?.databaseTables?.map(subItem => (
                                    <div style={{ margin: "10px" }}>
                                        <div style={{ border: "1px solid grey", textAlign: "center", width: "100%" }}>{subItem?.name}</div>
                                        {subItem?.columns?.map(column => (
                                            <div
                                                key={column?.id}
                                                style={{
                                                    position: "relative",
                                                    height: "55px",
                                                    width: "100%",
                                                    backgroundColor: "white",
                                                    borderBottom: "1px solid lightgrey",
                                                    display: "flex",
                                                    justifyContent: "flex-start",
                                                    alignItems: "center",
                                                    padding: "0 30px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => { }}
                                            >
                                                {hoveredFirstItem === i && (
                                                    <IconButton
                                                        sx={{ position: "absolute", right: 0 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveAPINode(i);
                                                        }}
                                                    >
                                                        <CancelIcon sx={{ color: "red" }} />
                                                    </IconButton>
                                                )}
                                                <span style={{ textAlign: "center" }}><b>{column?.name}</b>({column.type})</span>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ))}
                        </div>
                    )}


                </div>}
                {aiProjectInitialization?.initialized && !databaseView && <div style={{
                    width: "100%",
                    flexGrow: 1,
                    overflow: "auto",
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    {aiProjectInitialization?.baseAPIs && (
                        <div style={{ width: "300px", borderRadius: "20px", overflow: "hidden", zIndex: 10, margin: "30px", overflowY: "auto" }} className='shadow' id="moreDetailsDivTwo">
                            <div style={{ position: "relative", height: "50px", width: "100%", backgroundColor: "whitesmoke", borderBottom: "1px solid lightgrey", display: "flex", justifyContent: "center", alignItems: "center", padding: "0 30px", cursor: "pointer" }}>
                                <span style={{ textAlign: "center" }}>API Functions</span>
                                <IconButton sx={{ position: "absolute", right: 0 }} onClick={(e) => {
                                    e.stopPropagation()
                                    // setStepPos(i)
                                    setIsModalOpen("api")
                                }}>
                                    <AddCircleIcon sx={{ color: "green" }} />
                                </IconButton>
                            </div>
                            {(aiProjectInitialization.baseAPIs || []).map((item, i) => (
                                <div
                                    key={item.id}
                                    style={{
                                        position: "relative",
                                        height: "55px",
                                        width: "100%",
                                        backgroundColor: decideColor(item.id),
                                        borderBottom: "1px solid lightgrey",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: "0 30px",
                                        cursor: "pointer",
                                        borderLeft: item?.id === selectedAPINode?.id ? "5px solid green" : "5px solid transparent",
                                        borderRight: aiProjectInitializationState.baseAPIs.find(elem => elem.id === item.id) ? "5px solid transparent" : "5px solid lightgreen"
                                    }}
                                    onClick={() => handleClick(item, i)}
                                    onMouseOver={() => setHoveredFirstItem(i)}
                                    onMouseLeave={() => setHoveredFirstItem()}
                                    id={item?.id}
                                >
                                    {!editableAPI && item?.databaseRequired && item.databaseRequired.toLowerCase() === "yes" && (
                                        <IconButton
                                            sx={{ position: "absolute", left: 0 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDbView({
                                                    open: true,
                                                    data: item?.databaseTables || [],
                                                    columns: item?.databaseTables[0]?.columns || [],
                                                });
                                            }}
                                        >
                                            <i className="ri-database-2-line" style={{ height: "24px", display: "flex", alignItems: "center", color: "orange" }}></i>
                                        </IconButton>
                                    )}

                                    {!editableAPI && hoveredFirstItem === i && (
                                        <IconButton
                                            sx={{ position: "absolute", right: 0 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveAPINode(i);
                                            }}
                                        >
                                            <CancelIcon sx={{ color: "red" }} />
                                        </IconButton>
                                    )}
                                    {editableAPI?.id === item?.id ? <input style={{ width: "100%", margin: "0 8px" }} value={editableAPI.apiName} type='text' onChange={(e) => setEditableAPI({ ...editableAPI, apiName: e.target.value })} /> : <span style={{ textAlign: "center" }}>{item?.apiName}</span>}
                                    {editableAPI?.id === item?.id && (<>
                                        <IconButton
                                            sx={{ position: "absolute", left: 0 }}
                                            onClick={() => setEditableAPI(null)}
                                        >
                                            {/* <i className="ri-database-2-line" style={{ height: "24px", display: "flex", alignItems: "center", color: "red" }}></i> */}
                                            <CloseIcon style={{ color: "red" }} />
                                        </IconButton>
                                        <IconButton
                                            sx={{ position: "absolute", right: 0 }}
                                            onClick={handleDoneRename}
                                        >
                                            {/* <i className="ri-database-2-line" style={{ height: "24px", display: "flex", alignItems: "center", color: "green" }}></i> */}
                                            <DoneIcon style={{ color: "green" }} />
                                        </IconButton>
                                    </>)}
                                </div>
                            ))}
                        </div>
                    )}

                    <Modal open={dbView.open} onClose={() => setDbView({ ...dbValue, open: false })}>
                        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 900, height: "auto", maxHeight: "85%", bgcolor: "background.paper", boxShadow: 24, p: 4, overflowY: "auto", display: "flex", alignItems: "flex-start" }}>
                            {dbView?.data && (
                                <div style={{ width: "300px", margin: "30px", overflow: "hidden", zIndex: 10 }} className='shadow' id="moreDetailsDivTwo">
                                    {(dbView.data || []).map((item, i) => (
                                        <div style={{ position: "relative", height: "55px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid lightgrey" }}
                                            onClick={() => setDbView({ ...dbView, columns: item.columns })}
                                            id={item?.id}
                                        >
                                            <span>{item?.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {dbView?.columns && (
                                <div style={{ width: "350px", margin: "30px", overflow: "hidden", zIndex: 10 }} className='shadow' id="moreDetailsDivTwo">
                                    {(dbView.columns || []).map((item, i) => (
                                        <div style={{ position: "relative", height: "55px", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", borderBottom: "1px solid lightgrey", padding: "0 20px" }}
                                            id={item?.id}
                                        >
                                            <span><b>{item?.name}</b>({item.type})</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Box>
                    </Modal>

                    <div style={{ width: "300px", overflowY: "auto", zIndex: 10, margin: "30px", scrollbarWidth: "none", msOverflowStyle: "none" }}>
                        {functionStepChain && functionStepChain.length > 0 && <IconButton
                            sx={{ position: "relative", left: 0 }}
                            onClick={() => {
                                // handleSetArrowBack
                                // setCodeView()
                                // setFunctionStepChain([])
                                console.log("apiListapiList ", functionStepChain)
                                updateCurrentFlag()
                            }}
                        >
                            <ArrowBackIosIcon style={{ color: "#f07227" }} />
                        </IconButton>}
                        {functionStepChain?.find(item => item.current === true)?.steps ? functionStepChain?.find(item => item.current === true)?.steps.map((item, i) => {
                            let stepDataNode = functionStepChain?.find(item => item.current === true);

                            return (
                                <div
                                    id={item.stepName}
                                    style={{
                                        position: "relative",
                                        height: "80px",
                                        width: "100%",
                                        borderBottom: "1px solid lightgrey",
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        padding: "0 30px",
                                        cursor: "pointer",
                                        marginBottom: "25px",
                                        borderLeft: item.stepNo === codeView?.stepNo ? "5px solid green" : "5px solid transparent",
                                        backgroundColor: "white"
                                    }}
                                    onClick={(item?.functionId && item?.action && item?.action.toLowerCase() === "function call") ? () => createFunctionSteps(item, i) : () => handleClickStep(item, i)} onMouseOver={() => setHoveredSecondItem(i)} onMouseLeave={() => setHoveredSecondItem()}
                                >
                                    {(i < stepDataNode?.steps.length - 1) && <Xarrow
                                        start={item.stepName}
                                        end={stepDataNode.steps[i + 1]?.stepName}
                                        path="grid"
                                        startAnchor="bottom"
                                        endAnchor="top"
                                        lineColor="#87CEEB"
                                        strokeWidth={2}
                                        showHead={false}
                                        gridBreak={"50%"}
                                    />}
                                    {!editableStep && hoveredSecondItem === i && <IconButton sx={{ position: "absolute", left: 0 }} onClick={(e) => {
                                        e.stopPropagation()
                                        // setStepModal({ open: true, data: item })
                                        handleRemoveStepNode(i)
                                    }}>
                                        <CancelIcon sx={{ color: "red" }} />
                                    </IconButton>}
                                    {!editableStep && hoveredSecondItem === i && <IconButton sx={{ position: "absolute", right: 0 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsModalOpen("step")
                                            setStepPos(i)
                                        }}>
                                        <AddCircleIcon sx={{ color: "green" }} />
                                    </IconButton>}

                                    {editableStep?.stepNo === item?.stepNo ? <input style={{ width: "100%", margin: "0 8px" }} value={editableStep.stepName} type='text' onChange={(e) => setEditableStep({ ...editableStep, stepName: e.target.value })} /> : <span style={{ textAlign: "center" }}>{i + 1}. {item?.stepName}{(item?.action && item?.action.toLowerCase() === "function call") ? `(function call)` : ''}</span>}

                                    {editableStep?.stepNo !== item?.stepNo && (item?.type === "global" ? <LanguageIcon style={{ position: "absolute", right: 30, color: "#284FA3" }} /> : <PushPinIcon style={{ position: "absolute", right: 30, color: "rgb(240, 114, 39)" }} />)}

                                    {editableStep?.stepNo === item?.stepNo && (<>
                                        <IconButton
                                            sx={{ position: "absolute", left: 0 }}
                                            onClick={() => setEditableStep(null)}
                                        >
                                            <CloseIcon style={{ color: "red" }} />
                                        </IconButton>
                                        <IconButton
                                            sx={{ position: "absolute", right: 0 }}
                                            onClick={handleDoneRenameStep}
                                        >
                                            <DoneIcon style={{ color: "green" }} />
                                        </IconButton>
                                    </>)}

                                </div>
                            )
                        })
                            :

                            <ShowSteps
                                steps={(Array.isArray(selectedAPINode?.steps) ? selectedAPINode.steps : [])}
                                selectedAPINode={selectedAPINode}
                                codeView={codeView}
                                aiProjectInitializationState={aiProjectInitializationState}
                                createFunctionSteps={createFunctionSteps}
                                handleClickStep={handleClickStep}
                                setHoveredSecondItem={setHoveredSecondItem}
                                handleRemoveStepNode={handleRemoveStepNode}
                                setIsModalOpen={setIsModalOpen}
                                setStepPos={setStepPos}
                                editableStep={editableStep}
                                setEditableStep={setEditableStep}
                                handleDoneRenameStep={handleDoneRenameStep}
                            />
                        }
                    </div>


                    <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        open={copiedText}
                        onClose={() => setCopiedText(false)}
                        message="Coped!"
                        key={"top-right"}
                    />

                    <div style={{
                        width: "40%",
                        maxWidth: "700px",
                        height: "calc(100% - 60px)",
                        borderRadius: '20px',
                        overflow: 'hidden',
                        zIndex: '10',
                        margin: '30px',
                    }}>
                        {functionStepChain && functionStepChain.length > 0 && <IconButton
                            sx={{ position: "relative", right: 0 }}
                            onClick={() => updateCurrentFlagForward()}
                        >
                            <ArrowForwardIosIcon style={{ color: "rgb(40, 79, 163)" }} />
                        </IconButton>}

                        {codeView && <div style={{ height: "100%" }}>
                            {(functionStepChain && functionStepChain.length > 0) ? (
                                <Box
                                    sx={{
                                        bgcolor: "background.paper",
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <AppBar position="static">
                                        <Tabs
                                            value={subValue}
                                            onChange={handleChangeSubValue}
                                            indicatorColor="secondary"
                                            textColor="inherit"
                                            variant="fullWidth"
                                            aria-label="full width tabs example"
                                        >
                                            <Tab label="Step Logic" {...a11yProps(0)} />
                                            <Tab label="Step Code" {...a11yProps(1)} />
                                            <Tab label="Full File Code" {...a11yProps(2)} />
                                        </Tabs>
                                    </AppBar>
                                    <SwipeableViews
                                        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                                        index={subValue}
                                        onChangeIndex={handleChangeSubIndex}
                                        style={{
                                            height: "100%",
                                            flexGrow: "1",
                                        }}
                                        containerStyle={{
                                            height: "100%"
                                        }}
                                    >
                                        <TabPanel
                                            style={{
                                                height: "100%",
                                            }}
                                            value={subValue}
                                            index={0}
                                            dir={theme.direction}
                                        >
                                            <p>
                                                {codeView?.codeDocumentation ? codeView?.codeDocumentation : codeView?.stepDescription}
                                            </p>
                                        </TabPanel>
                                        <TabPanel
                                            style={{
                                                height: "100%",
                                            }}
                                            value={subValue}
                                            index={1}
                                            dir={theme.direction}
                                        >

                                            <div style={{ width: "100%", minWidth: "400px", height: "100%", backgroundColor: "white" }} className='shadow' id="moreDetailsDivThree">
                                                <div style={{ height: "40px", width: "100%", backgroundColor: "whitesmoke", display: "flex", justifyContent: "flex-end", paddingLeft: "10px" }}>
                                                    <div className='d-flex'>
                                                        <CopyToClipboard text={codeView.code} onCopy={handleCopy}>
                                                            <Tooltip title="Copy To Clipboard">
                                                                <IconButton>
                                                                    <ContentCopyIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </CopyToClipboard>
                                                        <Tooltip title="Save Changes">
                                                            <IconButton onClick={handleUpdateCode}>
                                                                <SaveIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                <AceEditor
                                                    ref={stepCodeEditorRef}
                                                    placeholder="Placeholder Text"
                                                    mode="javascript"
                                                    theme="monokai"
                                                    name="blah2"
                                                    // onLoad={this.onLoad}
                                                    // onChange={onChangeEditortext}
                                                    fontSize={14}
                                                    lineHeight={19}
                                                    showPrintMargin={false}
                                                    showGutter={true}
                                                    highlightActiveLine={true}
                                                    value={codeView.code}
                                                    style={{
                                                        width: "100%",
                                                        height: "calc(100% - 90px)",
                                                    }}
                                                    setOptions={{
                                                        useWorker: false,
                                                        enableBasicAutocompletion: false,
                                                        enableLiveAutocompletion: false,
                                                        enableSnippets: false,
                                                        showLineNumbers: true,
                                                        tabSize: 2,
                                                    }}
                                                />
                                                <div style={{ height: "50px", backgroundColor: "white", display: "flex" }}>
                                                    <div className="chatFormContainer">
                                                        <textarea
                                                            className="chatFormInput"
                                                            id="chatFormInputTextArea"
                                                            type={"text"}
                                                            rows={1}
                                                            placeholder="Make changes at the Step level"
                                                            value={updateQueryText}
                                                            onChange={(e) => setUpdateQueryText(e.target.value)}
                                                            onKeyDown={handleEnterModification}
                                                        />
                                                        <IconButton
                                                            style={{
                                                                backgroundColor: "#FCF0E9",
                                                                cursor: "default",
                                                                margin: "9px",
                                                                width: "46px",
                                                                height: "46px",
                                                            }}
                                                            onClick={handleOnSendUpdateQuery}
                                                        >
                                                            <i
                                                                className={"chatFormSendIcon ri-send-plane-fill"}
                                                            ></i>
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel
                                            style={{
                                                height: "100%",
                                            }}
                                            value={subValue}
                                            index={2}
                                            dir={theme.direction}
                                        >

                                            <div style={{ width: "100%", minWidth: "400px", height: "100%", backgroundColor: "white" }} className='shadow' id="moreDetailsDivThree">
                                                <div style={{ height: "40px", width: "100%", backgroundColor: "whitesmoke", display: "flex", justifyContent: "flex-end", paddingLeft: "10px" }}>
                                                    <div className='d-flex'>
                                                        <CopyToClipboard text={functionStepChain?.find(item => item.current === true)?.code} onCopy={handleCopy}>
                                                            <Tooltip title="Copy To Clipboard">
                                                                <IconButton>
                                                                    <ContentCopyIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </CopyToClipboard>
                                                        <Tooltip title="Test API">
                                                            <IconButton onClick={handleTestCode}>
                                                                <PlayCircleFilledWhiteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Save Changes">
                                                            <IconButton onClick={handleUpdateCodeFullApi}>
                                                                <SaveIcon />
                                                            </IconButton>
                                                            <IconButton onClick={() => console.log("fffffffffffffffff")}>
                                                                <SaveIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                <AceEditor
                                                    ref={fullCodeEditorRef}
                                                    placeholder="Placeholder Text"
                                                    mode="javascript"
                                                    theme="monokai"
                                                    name="blah2"
                                                    // onLoad={this.onLoad}
                                                    // onChange={(value) => setSelectedAPINode({ ...selectedAPINode, api_code: value })}
                                                    fontSize={14}
                                                    lineHeight={19}
                                                    showPrintMargin={false}
                                                    showGutter={true}
                                                    highlightActiveLine={true}
                                                    value={functionStepChain?.find(item => item.current === true)?.code}
                                                    style={{
                                                        width: "100%",
                                                        height: "calc(100% - 40px)",
                                                    }}
                                                    setOptions={{
                                                        useWorker: false,
                                                        enableBasicAutocompletion: false,
                                                        enableLiveAutocompletion: false,
                                                        enableSnippets: false,
                                                        showLineNumbers: true,
                                                        tabSize: 2,
                                                    }}
                                                />
                                            </div>
                                        </TabPanel>
                                    </SwipeableViews>
                                </Box>
                            ) : (
                                <ShowCode
                                    subValue={subValue}
                                    handleChangeSubValue={handleChangeSubValue}
                                    handleChangeSubIndex={handleChangeSubIndex}
                                    theme={{ direction: 'ltr' }} // Your theme object here
                                    codeView={codeView}
                                    selectedAPINode={selectedAPINode}
                                    handleCopy={handleCopy}
                                    handleUpdateCode={handleUpdateCode}
                                    handleUpdateCodeFullApi={handleUpdateCodeFullApi}
                                    handleTestCode={handleTestCode}
                                    updateQueryText={updateQueryText}
                                    setUpdateQueryText={setUpdateQueryText}
                                    handleEnterModification={handleEnterModification}
                                    handleOnSendUpdateQuery={handleOnSendUpdateQuery}
                                    stepCodeEditorRef={stepCodeEditorRef}
                                    fullCodeEditorRef={fullCodeEditorRef}
                                    setSelectedAPINode={setSelectedAPINode}
                                />
                            )}
                        </div>
                        }
                    </div>
                </div>}

            </div>}
        </div>
    )
}

export default AiOffice;