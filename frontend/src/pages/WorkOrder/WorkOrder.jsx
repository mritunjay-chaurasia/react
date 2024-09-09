import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as WorkOrderListApi from "../../api/worklist.api";
import * as UserProjectApi from '../../api/userProject.api';
import DataTable from "../../components/DataTable/DataTable";
import { showNotification } from "../../utils/notification";
import "./workorder.css";
import { Box, FormControl, InputLabel, MenuItem, Modal, Select, Snackbar,Tooltip,Button,Pagination,Stack,IconButton} from "@mui/material";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SettingsIcon from '@mui/icons-material/Settings';
import { Paper } from "@material-ui/core";
// import { createStyles, makeStyles } from "@material-ui/core/styles";
import { TextInput } from "./TextInput.js";
import { MessageLeft, MessageRight } from "./Message";
import ToggleButtonModal from '../../components/ToggleButtonModal/ToggleButtonModal.jsx'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const useStyles = makeStyles((theme) =>
    createStyles({
        paper: {
            width: "100%",
            height: "80vh",
            // maxWidth: "500px",
            maxHeight: "700px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            position: "relative"
        },
        paper2: {
            width: "80vw",
            maxWidth: "500px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            position: "relative"
        },
        container: {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        messagesBody: {
            width: "calc( 100% - 20px )",
            margin: 10,
            overflowY: "scroll",
            height: "calc( 100% - 80px )"
        }
    })
);

const CustomComponent = ({ item }) => {
    return (
        <Link to={`details/${item.id}`} state={item}>
            <Button
                variant="contained"
                style={{
                    background: "#F07227",
                    borderRadius: "5px",
                    width: "108px",
                    height: "41px",
                }}
            >
                <i
                    className="ri-eye-line"
                    style={{
                        fontSize: "18px",
                        marginRight: "8px",
                    }}
                ></i>
                <span className="text-capitalize">View</span>
            </Button>
        </Link>
    )
}

const diffNewStyle = {
    variables: {
        light: {
            // diffViewerBackground: '#fff',
            // diffViewerColor: '#000',
            // addedBackground: '#FFFCC6',
            // addedColor: '#24292e',
            // removedBackground: '#FFFCC6',
            // removedColor: '#24292e',
            // wordAddedBackground: '#FFFCC6',
            // wordRemovedBackground: '#FFFCC6',
        },
    }
}

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90vw",
    height: "auto",
    maxheight: '80vh',
    bgcolor: "background.paper",
    boxShadow: 24,
    padding: '2rem',
    "&:focus": {
        outline: "none",
    },
    borderRadius: '10px',
};

function WorkOrder() {
    const { selectedProject, selectedOrganization } = useSelector((state) => state.orgDetails);
    const { userInfo } = useSelector(state => state.user);
    const navigate = useNavigate();
    const classes = useStyles();

    const [workOrderList, setWorkOrderList] = useState([]);
    const [page, setPage] = useState(localStorage.getItem('workOrderListPage') ? localStorage.getItem('workOrderListPage') : 1);
    const [limit, setLimit] = useState(localStorage.getItem('workOrderListLimit') ? localStorage.getItem('workOrderListLimit') : 10);
    const [searchText, setSearchText] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [requirementData, setRequirementData] = useState();
    const [copiedText, setCopiedText] = useState(false);
    const [workOrderListData, setWorkOrderListData] = useState([]);
    const [allOrgUsers, setAllOrgUsers] = useState([]);
    const [viewCommentBox, setViewCommentBox] = useState(false);
    const [currentWorkOrder, setCurrentWorkOrder] = useState();
    const [commentText, setCommentText] = useState("");
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
    const [workOrderStatusList, setWorkOrderStatusList] = useState([])
    const [loading, setLoading] = useState(true);
    let tableHeadings = ["Id", "Task", "Reporter", "Mode", "Status", "Assigned To", "Created Date", "Action"]
    const [checkedReporters, setCheckedReporters] = useState([]);
    const [checkedModes, setCheckedModes] = useState([]);
    const [checkedStatuses, setCheckedStatuses] = useState([]);
    const [checkedAssignees, setCheckedAssignees] = useState([]);
    const [checkedCreatedDates, setCheckedCreatedDates] = useState([]);
    const [isCheckedCreatedDates, setIsCheckedCreatedDates] = useState([]);
    const [openModal,setOpenModal] = useState(false);
    const [applyFilter, setApplyFilter] = useState(false);
    const [toggle, setToggle] = useState(false);
    // const showWorkorderhistory = (dataToshow) => {
    //     setRequirementData(dataToshow);
    //     setShowModal(true);
    // }
   
    const handleCopy = () => {
        setCopiedText(true)
        setTimeout(() => setCopiedText(false), 2000);
    }


    useEffect(() => {
        (async()=>{
            if(selectedProject && selectedProject.id){
                const loadProject = await UserProjectApi.loadProject(selectedProject.id);
                console.log("fetchProject>>>>>>>>>>>>>>>>> ",loadProject?.userProject)
                setToggle(loadProject?.userProject?.hideReleasedStatus)
                setWorkOrderStatusList(loadProject?.userProject?.selectedStatus)
            }
        })()
    }, [selectedProject?.id,allOrgUsers])

    useEffect(()=>{
        if(!applyFilter){
            setCheckedReporters([]);
            setCheckedModes([]);
            setCheckedStatuses([]);
            setCheckedAssignees([]);
            setCheckedCreatedDates([]);
            setIsCheckedCreatedDates([]);
            setSearchText('');
        }
    },[applyFilter])

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
        return `${date} ${month} ${year}, ${new Date(
            dateValue
        ).toLocaleTimeString()}`;
    };

    const changeTicketStatus = async (id, status) => {
        try {
            const response = await WorkOrderListApi.changeWorkOrderStatus({ workOrderId: id, status: status })

            if (response.status) {
                setWorkOrderListData((prev) => {
                    return prev.map(elem => {
                        if (elem.id === response.updateWorkOrderList.id) return { ...elem, status: response.updateWorkOrderList.status }
                        else return elem
                    })
                })
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
                console.log("dddddddddddddddddddddddddddddddd", response.workOrder)
                setWorkOrderListData((prev) => {
                    return prev.map(elem => {
                        if (elem.id === response.workOrder.id) return { ...elem, assignedToUser: response.workOrder.assignedToUser, assignedTo: response.workOrder.assignedTo }
                        else return elem
                    })
                })

                showNotification('success', "Assigned to developer");
            }
        } catch (error) {
            console.log("Error While Sending information to Developers", error);
            showNotification('error', "Some Error Occured please try after some time");
        }
    }

    const addComment = async () => {
        let data = {
            workOrderId: currentWorkOrder?.id,
            text: commentText
        }
        const response = await WorkOrderListApi.addComment(data);
        if (response && response.status) {
            setCurrentWorkOrder(prev => {
                return {
                    ...prev, comments: [...prev.comments, {
                        ...response.comment, commentBy: {
                            firstname: userInfo?.firstname,
                            // lastname: userInfo?.lastname
                        }
                    }]
                }
            })
        }
        setCommentText("")
    }

    const handleMouseDown = (event,item) => {
        if (event.button === 1) { // Middle click
            const stateData = JSON.stringify({ key: 'new-tab' }); // Your state data
            const encodedStateData = encodeURIComponent(stateData);
            window.open(`/workOrder/details/${item?.workOrderId}?state=${encodedStateData}`, '_blank');
        } else if (event.button === 0) { // Left click
            navigate(`/workOrder/details/${item?.workOrderId}`);
        }
    };

    useEffect(() => {
        console.log("requirementData second :::", requirementData)
        if (requirementData?.mode === 'ai') {
            setWorkOrderStatusList(workOrderStatusListForAi)
        }
    }, [requirementData])


    useEffect(() => {

        console.log("changinggggggggggggggggggggg", workOrderListData)

        if (!Array.isArray(workOrderListData)) {
            return;
        }
        
        let tempList = [...workOrderListData]
        const formattedData = tempList && tempList.length > 0 && tempList.map((item) => ({
            id: `${item?.workOrderId}`,
            name: (<div style={{ maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",margin:"0 auto" }}>
                <span title={item?.taskName}>{item?.taskName}</span>
            </div>),
            createdBy: `${item?.createdByUser?.firstname ? item.createdByUser.firstname : ""}`,
            mode: item.mode,
            status: (
                <FormControl fullWidth>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select"
                        value={item.status}
                        onChange={((e) => changeTicketStatus(item.id, e.target.value))}
                        autoWidth
                        style={{ height: "40px" }}
                    >
                        {workOrderStatusList && workOrderStatusList.length > 0 &&workOrderStatusList.map(elem => <MenuItem value={elem.value}>{elem.label}</MenuItem>)}
                    </Select>
                </FormControl>
            ),
            assignedTo: (
                <FormControl fullWidth>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select"
                        value={item.assignedTo !== null ? item.assignedTo : 'unassigned'}
                        onChange={(e) => assignTicketToUser(e.target.value === 'unassigned' ? null : e.target.value, item.id)}
                        // onChange={((e) => assignTicketToUser(e.target.value, item.id))}
                        autoWidth
                        style={{ height: "40px" }}
                    >
                    <MenuItem value="unassigned" style={{ color: "black" }}>Unassigned</MenuItem>
                    {allOrgUsers && allOrgUsers.length > 0 && allOrgUsers.map((user) => (
                        <MenuItem key={user.id} style={{ color: "black" }} value={user.id}>
                            {user.firstname ? user.firstname : ""}
                        </MenuItem>
                    ))}
                        {/* {allOrgUsers.map(user => <MenuItem style={{color:"black"}} value={user.id}>{`${user.firstname ? user.firstname : ""}`}</MenuItem>)} */}
                    </Select>
                </FormControl>
            ),
            createdAt: `${convertdateFormat(item?.createdAt)}`,
            customComponent: (<Button
                variant="contained"
                style={{
                    background: "#F07227",
                    borderRadius: "5px",
                    width: "108px",
                    height: "41px",
                }}
                onMouseDown={(e)=>handleMouseDown(e,item)}
                // onClick={() => navigate(`/workOrder/details/${item?.workOrderId}`)}
            >
                <i
                    className="ri-eye-line"
                    style={{
                        fontSize: "18px",
                        marginRight: "8px",
                    }}
                ></i>
                <span className="text-capitalize">View</span>
            </Button>),
            // comments: (
            //     <Button
            //         variant="outlined"
            //         style={{
            //             color: "#F07227",
            //             border: "1px solid #F07227",
            //             borderRadius: "5px",
            //             width: "108px",
            //             height: "41px",
            //         }}
            //         sx={{
            //             ":hover": {
            //                 bgcolor: "#FCE9E9",
            //             }
            //         }}
            //         onClick={() => {
            //             setViewCommentBox(true);
            //             setCurrentWorkOrder(item)
            //         }}
            //     >
            //         Comments
            //     </Button>
            // ),
        }));
        setWorkOrderList(formattedData);

        

    }, [toggle,workOrderListData, allOrgUsers])


    useEffect(() => {
        if (selectedProject?.id) {
            (async () => {
                let data = {
                    page: page,
                    limit: limit,
                    orgId: selectedOrganization?.id,
                    projectId: selectedProject?.id,
                    searchText: searchText,
                    filterReporterUser: checkedReporters ? checkedReporters : [],
                    filterMode: checkedModes ? checkedModes : [],
                    filterStatusData: checkedStatuses ? checkedStatuses : [],
                    filterAssignToData: checkedAssignees ? checkedAssignees : [],
                    filterCreatedDate: checkedCreatedDates ? checkedCreatedDates : [],
                }
                const response = await WorkOrderListApi.getOrgWorkOrderList(data);
                if (response && response.status) {
                    setWorkOrderListData(response?.allWorkOrderList ? response.allWorkOrderList : [])
                    if(response.allWorkOrderList.length === 0){
                        setLoading(false)
                    }
                    setTotalPages(response.totalPage);
                    if (response.totalPage < page) setPage(1)
                }
            })();
        }
    }, [toggle,page, selectedProject, searchText, limit,checkedReporters,checkedModes,checkedStatuses,checkedAssignees,checkedCreatedDates]);



    useEffect(() => {
        // Store page and limit in localStorage
        localStorage.setItem("workOrderListPage", page);
        localStorage.setItem("workOrderListLimit", limit);
    }, [page, limit]);

    useEffect(() => {
        if (selectedOrganization?.id) {
            (async () => {
                const response = await WorkOrderListApi.getAllOrgUsers(selectedOrganization?.id)
                if (response && response.status && response.allOrgUser) {
                    setAllOrgUsers(response.allOrgUser);
                }
            })();
        }
    }, [selectedOrganization]);



    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={copiedText}
                onClose={() => setCopiedText(false)}
                message="Coped!"
                key={"top-right"}
            />
            <div className="workOrderPage">
                <div className="workOrderListContainer">
                    <div className="workOrderHeader">
                        <div className="d-flex align-items-center">
                            <FormControl sx={{ mr: 2 }}>
                                <InputLabel id="demo-simple-select-autowidth-label">Limit</InputLabel>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    value={limit}
                                    onChange={((e) => setLimit(e.target.value))}
                                    autoWidth
                                    label="Limit"
                                    style={{ height: "40px" }}
                                >
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                </Select>
                            </FormControl>
                            <div className="workOrderListSearchBar">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                                <i className="ri-search-line"></i>
                            </div>
                            <div className="setting-icons" style={{position:"relative"}}>
                                <SettingsIcon onClick={()=>setOpenModal(!openModal)} style={{cursor:"pointer"}} />
                                <ToggleButtonModal setToggle={setToggle} toggle={toggle} setOpenModal={setOpenModal}  openModal={openModal} position={"absolute"} top={"40px"} right={"0px"} />
                            </div>
                            <Tooltip title={applyFilter ? "Clear filter" : "Apply filter"}>
                                <IconButton aria-label="filter-tasks" onClick={()=>setApplyFilter(!applyFilter)}>
                                {applyFilter ? (
                                        <FilterAltOffIcon style={{ color: "black", fontWeight: "bold" }} />
                                    ) : (
                                        <FilterAltIcon />
                                )}
                                </IconButton>
                            </Tooltip>
                            {userInfo?.usertype !== "superadmin" && <div>
                                <Button
                                    variant="contained"
                                    style={{
                                        background: "#F07227",
                                        borderRadius: "5px",
                                        width: "auto",
                                        height: "41px",
                                    }}
                                    onClick={() => navigate("/workOrder/createWorkOrder")}
                                >
                                    <span className="text-capitalize">Create Task</span>
                                </Button>
                            </div>}
                        </div>
                    </div>

                    <DataTable tableHeadings={tableHeadings} tabledata={workOrderList} setWorkOrderListData={setWorkOrderListData} workOrderStatusList={workOrderStatusList} allOrgUsers={allOrgUsers}  checkedReporters={checkedReporters}  setCheckedReporters={setCheckedReporters}  checkedModes={checkedModes} setCheckedModes={setCheckedModes} checkedStatuses={checkedStatuses} setCheckedStatuses={setCheckedStatuses} setCheckedAssignees={setCheckedAssignees} checkedAssignees={checkedAssignees} checkedCreatedDates={checkedCreatedDates} setCheckedCreatedDates={setCheckedCreatedDates} setIsCheckedCreatedDates={setIsCheckedCreatedDates} isCheckedCreatedDates={isCheckedCreatedDates} applyFilter={applyFilter} loading={loading} />
                    <div className="workOrderListTablePagination">
                        <Stack spacing={2}>
                            <Pagination
                                count={totalPages}
                                variant="outlined"
                                shape="rounded"
                                sx={{
                                    "& .MuiPaginationItem-root": {
                                        "&.Mui-selected": {
                                            background: "#284FA3",
                                            color: "white",
                                        },
                                    }
                                }
                                }
                                page={Number(page)}
                                onChange={(event, page) => setPage(page)}
                            />
                        </Stack>
                    </div>
                </div>
            </div>

            <Modal
                open={viewCommentBox}
                onClose={() => setViewCommentBox(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ overflowY: 'auto' }}
            >
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "700px",
                    height: "auto",
                    minHeight: "500px",
                    maxheight: '80vh',
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    padding: '2rem',
                    "&:focus": {
                        outline: "none",
                    },
                    borderRadius: '10px',
                }}>
                    <div className={classes.container}>
                        <Paper className={classes.paper} zDepth={2}>
                            <Paper id="style-1" className={classes.messagesBody}>

                                {(currentWorkOrder?.comments || []).map(comment => (
                                    <MessageLeft
                                        message={comment.text}
                                        timestamp={""}
                                        // photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
                                        displayName={`${comment.commentBy.firstname}`}
                                        avatarDisp={false}
                                    />
                                ))}
                            </Paper>
                            <TextInput
                                commentText={commentText}
                                onSubmit={addComment}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                        </Paper>
                    </div>
                </Box>
            </Modal>


            {/* 
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ overflowY: 'auto' }}
            >
                <Box sx={style}>
                    {
                        requirementData && <div style={{
                            width: "100%",
                            // height: "auto",
                            borderRadius: "8px",
                            maxHeight: "80vh",
                            overflowY: "auto",
                            padding: "15px",
                            background: "#FFFFFF",
                            fontSize: "17px",
                            color: "#2F3F4C",
                        }}>

                            <b style={{ fontSize: "20px" }}>Requirements:</b><br />
                            {requirementData.requirements} <br />
                            <br />

                            <b style={{ fontSize: "20px" }}>Solution summary:</b><br />
                            Following changes are needed in different layers:<br />
                            <b>Frontend: </b>{requirementData?.solutionsummary?.frontend ? requirementData.solutionsummary.frontend : ""}<br />
                            <b>Backend: </b>{requirementData?.solutionsummary?.backend ? requirementData.solutionsummary.backend : ""}<br />
                            <b>Python: </b>{requirementData?.solutionsummary?.python ? requirementData.solutionsummary.python : ""}<br />
                            <b>Database: </b>{requirementData?.solutionsummary?.database ? requirementData.solutionsummary.database : ""}<br />
                            <br />

                            <b style={{ fontSize: "20px" }}>Suggested implementation:</b><br />
                            Based on the analysis we recommend the following changes:<br />
                            <b>Frontend:</b><br />
                            {
                                (requirementData && requirementData.suggestedimplementation && requirementData.suggestedimplementation.frontend && requirementData.suggestedimplementation.frontend.length > 0) && requirementData['suggestedimplementation'].frontend.map(suggestion => {
                                    return (
                                        <>
                                            {((suggestion?.instructions && suggestion.instructions.length > 0) || suggestion?.originalCode || suggestion?.newcode) && <div style={{
                                                width: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                borderRadius: "4px",
                                                padding: "5px",
                                                border: "1px solid lightgrey",
                                                margin: "5px 0"
                                            }}>
                                                {suggestion.instructions && suggestion.instructions.length > 0 && <>
                                                    <b>Instructions:</b>
                                                    <ol>
                                                        {suggestion.instructions.map(instr => <li>{instr}</li>)}
                                                    </ol>
                                                </>}
                                                <div style={{ display: "flex" }}>
                                                    {suggestion?.newcode && <div style={{ width: "100%", }}>
                                                        <h3 style={{ backgroundColor: "#fff", paddingTop: "20px" }}>Updated Code</h3>
                                                        <div style={{ height: "auto", background: "#f8f5f3" }}>
                                                            <div style={{ marginTop: "10px" }}>
                                                                <div style={{ width: "100%", display: "flex", justifyContent: 'space-between', alignItems: "center", paddingLeft: "10px", backgroundColor: "whitesmoke" }}>
                                                                    {suggestion?.fileName ? suggestion.fileName : ""}
                                                                    <CopyToClipboard text={suggestion?.newcode} onCopy={handleCopy}>
                                                                        <div style={{ backgroundColor: "#FCF0E9", padding: "8px", borderRadius: "4px", cursor: "pointer" }} onClick={() => { }}>
                                                                            <Tooltip title="Copy To ClipBoard">
                                                                                <i className="ri-file-copy-line"></i>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </CopyToClipboard>
                                                                </div>

                                                                <div style={{ width: "100%", overflowX: 'auto' }}>
                                                                    <ReactDiffViewer oldValue={suggestion?.originalCode} newValue={suggestion?.newcode} hideLineNumbers={true} splitView={true} styles={diffNewStyle} compareMethod={DiffMethod.WORDS} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>}

                                                </div>
                                            </div>}
                                        </>
                                    )
                                })}
                            <br />

                            <b>Backend:</b><br />
                            {
                                (requirementData && requirementData.suggestedimplementation && requirementData.suggestedimplementation.backend && requirementData.suggestedimplementation.backend.length > 0) && requirementData['suggestedimplementation'].backend.map(suggestion => {
                                    return (
                                        <>
                                            {((suggestion?.instructions && suggestion.instructions.length > 0) || suggestion?.originalCode || suggestion?.newcode) && <div style={{
                                                width: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                borderRadius: "4px",
                                                padding: "5px",
                                                border: "1px solid lightgrey",
                                                margin: "5px 0"
                                            }}>
                                                {suggestion.instructions && suggestion.instructions.length > 0 && <>
                                                    <b>Instructions:</b>
                                                    <ol>
                                                        {suggestion.instructions.map(instr => <li>{instr}</li>)}
                                                    </ol>
                                                </>}
                                                <div style={{ display: "flex" }}>
                                                    {suggestion?.newcode && <div style={{ width: "100%", }}>
                                                        <h3 style={{ backgroundColor: "#fff", paddingTop: "20px" }}>Updated Code</h3>
                                                        <div style={{ height: "auto", background: "#f8f5f3" }}>
                                                            <div style={{ marginTop: "10px" }}>
                                                                <div style={{ width: "100%", display: "flex", justifyContent: 'space-between', alignItems: "center", paddingLeft: "10px", backgroundColor: "whitesmoke" }}>
                                                                    {suggestion?.fileName ? suggestion.fileName : ""}
                                                                    <CopyToClipboard text={suggestion?.newcode} onCopy={handleCopy}>
                                                                        <div style={{ backgroundColor: "#FCF0E9", padding: "8px", borderRadius: "4px", cursor: "pointer" }} onClick={() => { }}>
                                                                            <Tooltip title="Copy To ClipBoard">
                                                                                <i className="ri-file-copy-line"></i>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </CopyToClipboard>
                                                                </div>

                                                                <div style={{ width: "100%", overflowX: 'auto' }}>
                                                                    <ReactDiffViewer oldValue={suggestion?.originalCode} newValue={suggestion?.newcode} hideLineNumbers={true} splitView={true} styles={diffNewStyle} compareMethod={DiffMethod.WORDS} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>}

                                                </div>
                                            </div>}
                                        </>
                                    )
                                })}

                            <br />
                            <b>Python:</b><br />
                            {
                                (requirementData && requirementData.suggestedimplementation && requirementData.suggestedimplementation.python && requirementData.suggestedimplementation.python.length > 0) && requirementData['suggestedimplementation'].python.map(suggestion => {
                                    return (
                                        <>
                                            {((suggestion?.instructions && suggestion.instructions.length > 0) || suggestion?.originalCode || suggestion?.newcode) && <div style={{
                                                width: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                borderRadius: "4px",
                                                padding: "5px",
                                                border: "1px solid lightgrey",
                                                margin: "5px 0"
                                            }}>
                                                {suggestion.instructions && suggestion.instructions.length > 0 && <>
                                                    <b>Instructions:</b>
                                                    <ol>
                                                        {suggestion.instructions.map(instr => <li>{instr}</li>)}
                                                    </ol>
                                                </>}
                                                <div style={{ display: "flex" }}>
                                                    {suggestion?.newcode && <div style={{ width: "100%", }}>
                                                        <h3 style={{ backgroundColor: "#fff", paddingTop: "20px" }}>Updated Code</h3>
                                                        <div style={{ height: "auto", background: "#f8f5f3" }}>
                                                            <div style={{ marginTop: "10px" }}>
                                                                <div style={{ width: "100%", display: "flex", justifyContent: 'space-between', alignItems: "center", paddingLeft: "10px", backgroundColor: "whitesmoke" }}>
                                                                    {suggestion?.fileName ? suggestion.fileName : ""}
                                                                    <CopyToClipboard text={suggestion?.newcode} onCopy={handleCopy}>
                                                                        <div style={{ backgroundColor: "#FCF0E9", padding: "8px", borderRadius: "4px", cursor: "pointer" }} onClick={() => { }}>
                                                                            <Tooltip title="Copy To ClipBoard">
                                                                                <i className="ri-file-copy-line"></i>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </CopyToClipboard>
                                                                </div>

                                                                <div style={{ width: "100%", overflowX: 'auto' }}>
                                                                    <ReactDiffViewer oldValue={suggestion?.originalCode} newValue={suggestion?.newcode} hideLineNumbers={true} splitView={true} styles={diffNewStyle} compareMethod={DiffMethod.WORDS} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>}

                                                </div>
                                            </div>}
                                        </>
                                    )
                                })}


                            <br />
                            <br />
                            <br />

                        </div>
                    }
                </Box>
            </Modal> */}
        </>
    );
}
export default WorkOrder;
