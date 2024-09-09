import React, { useState } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import * as WorkOrderListApi from '../../api/worklist.api';
import { useEffect } from 'react';
import { Box, Button, Divider, Modal, Pagination, Stack } from '@mui/material';
import { Snackbar, Tooltip, makeStyles } from '@material-ui/core';
import CopyToClipboard from 'react-copy-to-clipboard';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ReactDiffViewer from 'react-diff-viewer';
import { useSelector } from 'react-redux';

const diffNewStyle = {
    variables: {
        light: {
            diffViewerBackground: '#fff',
            // diffViewerColor: '#000',
            addedBackground: '#FFFCC6',
            addedColor: '#24292e',
            // removedBackground: '#FFFCC6',
            // removedColor: '#24292e',
            wordAddedBackground: '#FFFCC6',
            wordRemovedBackground: '#FFFCC6',
        },
    }
}

const useStyles = makeStyles(() => ({
    ul: {
        "& .MuiPaginationItem-root": {
            "&.Mui-selected": {
                background: "#284FA3",
                color: "white",
            },
        },
    },
}));

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

/**
 * This Component Show All Work Order History
 * @params = None
 * @response : None
 * @author : Mandeep Singh
 */
function WorkOrderHistory() {
    const { selectedProject, selectedOrganization } = useSelector((state) => state.orgDetails);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [requirementData, setRequirementData] = useState();
    const [history, setHistory] = useState([]);
    const [copiedText, setCopiedText] = useState(false);
    const [showModal, setShowModal] = useState(false);



    const headings = [
        "USER NAME",
        "EMAIL",
        "DATE",
        "PROJECT",
        "ACTION"
    ]
    const classes = useStyles();


    useEffect(() => {
        getWorkOrderHistory();
    }, [page, searchText, limit]);



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
        dateAndMonth = dateAndMonth?.trim();
        let month = dateAndMonth.split(" ")[0];
        let date = dateAndMonth.split(" ")[1];
        let year = formattedDate.split(",")[2];
        return `${date} ${month} ${year}, ${new Date(
            dateValue
        ).toLocaleTimeString()}`;
    };

    const showWorkorderhistory = (dataToshow) => {
        console.log("Data to show :_:_:_::::::::::::::::::::;================", dataToshow);
        setRequirementData(dataToshow);
        setShowModal(true);

    }

    const handleCopy = () => {
        setCopiedText(true)
        setTimeout(() => setCopiedText(false), 2000);
    }

    const handleClose = () => {
        setShowModal(false);
    }


    /**
     * This Function Fetch All Work Order history then format it for rendering in data table
     * @params = None
     * @response : None
     * @author : Mandeep Singh
     */
    const getWorkOrderHistory = async () => {
        try {
            let data = {
                page: page,
                limit: limit,
                orgId: selectedOrganization?.id,
                projectId: selectedProject?.id,
                searchText: ""
            }
            const workOrderHistory = await WorkOrderListApi.getOrgWorkOrderList(data);

            //creating history data

            console.log("WorkHistory========================", workOrderHistory);
            if (workOrderHistory && workOrderHistory.status) {
                const formatedHistory = workOrderHistory?.allWorkOrderHistory.map((item) => ({
                    userName: `${item?.ownerdetails?.firstname}`,
                    emailId: item?.ownerdetails?.emailid,
                    createdat: convertdateFormat(item?.createdAt),
                    project: item.projectId,
                    customComponent: (<Button
                        variant="contained"
                        style={{
                            background: "#F07227",
                            borderRadius: "5px",
                            width: "108px",
                            height: "41px",
                        }}
                        onClick={() => {
                            // setOpenDocViewerModal(true);
                            showWorkorderhistory(item?.history)
                        }}
                    >
                        <i
                            className="ri-eye-line"
                            style={{
                                fontSize: "18px",
                                marginRight: "8px",
                            }}
                        ></i>
                        <span className='text-capitalize'>View</span>
                    </Button>),
                }));

                setHistory(formatedHistory);
                setTotalPages(workOrderHistory.totalPage)
                if (workOrderHistory.totalPage < page) setPage(1)
            }
        } catch (error) {
            console.log("Error While Creating Work Order History data ===============", error);
        }
    }
    return (
        <div>
            <div style={{ float: 'right', marginBottom: '1rem', marginRight: '1rem' }} className="chatHistorySearchBar">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <i className="ri-search-line"></i>
            </div>
            <div style={{width:'100%',padding:'2rem'}}>
                <DataTable tableHeadings={headings} tabledata={history} />
            </div>
            <div className="chatHistoryTablePagination">
                <Stack spacing={2}>
                    <Pagination
                        count={totalPages}
                        variant="outlined"
                        shape="rounded"
                        classes={{
                            root: classes.ul,
                        }}
                        page={Number(page)}
                        onChange={(event, page) => setPage(page)}
                    />
                </Stack>
            </div>
            {/* To show copied success msg */}
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={copiedText}
                onClose={() => setCopiedText(false)}
                message="Coped!"
                key={"top-right"}
            />
            
            {/*================================================== Showing work order history details======================================================== */}
            <Modal
                open={showModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ overflowY: 'auto' }}
            >
                <Box sx={style}>
                    {
                        requirementData && <div style={{
                            width: "100%",
                            height: "80vh",
                            overflowY: 'auto',
                            borderRadius: "8px",
                            padding: "15px",
                            // border: "1px solid lightgrey",
                            background: "#FFFFFF",
                            boxShadow: "inset 0px 6px 8px #EEF5FA",
                            fontSize: "17px",
                            color: "#2F3F4C",
                        }}>
                            <b style={{ fontSize: "20px" }}>Blockers:</b><br />
                            We can't proceed with the development until below questions are answered:<br />
                            {requirementData?.blockers && requirementData.blockers.length > 0 &&
                                <ul>
                                    {requirementData?.blockers.map((text, i) => <li key={i}>{text}</li>)}
                                </ul>
                            }<br />
                            <br />

                            <b style={{ fontSize: "20px" }}>Requirements:</b><br />
                            {requirementData.requirements} <br />
                            <br />

                            <b style={{ fontSize: "20px" }}>Solution summary:</b><br />
                            Following changes are needed in different layers:<br />
                            <b>Frontend: </b>{requirementData.solutionsummary.frontend}<br />
                            <b>Backend: </b>{requirementData.solutionsummary.backend}<br />
                            <b>Database: </b>{requirementData.solutionsummary.database}<br />
                            <br />

                            <b style={{ fontSize: "20px" }}>Suggested implementation:</b><br />
                            Based on the analysis we recommend the following changes:<br />
                            <b>Frontend:</b><br />
                            {requirementData['suggestedimplementation']['frontend']?.instruction ? requirementData['suggestedimplementation']['frontend'].instruction : ""}<br /><br />
                            {requirementData['suggestedimplementation']['frontend']?.code && <div style={{ marginTop: "10px" }}>
                                <div style={{ width: "100%", display: "flex", justifyContent: 'space-between', alignItems: "center", paddingLeft: "10px", backgroundColor: "whitesmoke" }}>
                                    {requirementData['suggestedimplementation']['frontend']?.filename ? requirementData['suggestedimplementation']['frontend'].filename : ""}
                                    <CopyToClipboard text={requirementData['suggestedimplementation']['frontend']?.code} onCopy={handleCopy}>
                                        <div style={{ backgroundColor: "#FCF0E9", padding: "8px", borderRadius: "4px", cursor: "pointer" }} onClick={() => { }}>
                                            <Tooltip title="Copy To ClipBoard">
                                                <i className="ri-file-copy-line"></i>
                                            </Tooltip>
                                        </div>
                                    </CopyToClipboard>
                                </div>

                                <SyntaxHighlighter language="javascript" style={docco}>
                                    {requirementData['suggestedimplementation']['frontend']?.code}
                                </SyntaxHighlighter>
                            </div>}
                            <br />

                            <b>Backend:</b><br />
                            {requirementData['suggestedimplementation']['backend']?.instruction ? requirementData['suggestedimplementation']['backend'].instruction : ""}<br /><br />

                            <div style={{ width: "100%", display: "flex" }}>
                                <div style={{ width: "50%" }}>
                                    <h3 style={{ backgroundColor: "#fff", paddingTop: "20px" }}>Previous Code</h3>
                                    <div style={{ marginTop: "10px" }}>
                                        <div style={{ width: "100%", display: "flex", justifyContent: 'space-between', alignItems: "center", paddingLeft: "10px", backgroundColor: "whitesmoke" }}>
                                            {requirementData['suggestedimplementation']['backend']?.filename ? requirementData['suggestedimplementation']['backend'].filename : ""}
                                            <CopyToClipboard text={requirementData['suggestedimplementation']['backend']?.previouscode} onCopy={handleCopy}>
                                                <div style={{ backgroundColor: "#FCF0E9", padding: "8px", borderRadius: "4px", cursor: "pointer" }} onClick={() => { }}>
                                                    <Tooltip title="Copy To ClipBoard">
                                                        <i className="ri-file-copy-line"></i>
                                                    </Tooltip>
                                                </div>
                                            </CopyToClipboard>
                                        </div>

                                        <SyntaxHighlighter language="javascript" style={docco}>
                                            {requirementData['suggestedimplementation']['backend']?.previouscode}
                                        </SyntaxHighlighter>
                                    </div>
                                    {/* <div style={{ whiteSpace: "pre-wrap", height: "auto", background: "#f8f5f3" }}>{requirementData['suggestedimplementation']['backend']?.previouscode}</div> */}
                                </div>
                                <Divider orientation="vertical" sx={{ margin: "0 8px", borderColor: "gray" }} />
                                <div style={{ width: "50%", }}>
                                    <h3 style={{ backgroundColor: "#fff", paddingTop: "20px" }}>Updated Code</h3>
                                    <div style={{ height: "auto", background: "#f8f5f3" }}>
                                        <div style={{ marginTop: "10px" }}>
                                            <div style={{ width: "100%", display: "flex", justifyContent: 'space-between', alignItems: "center", paddingLeft: "10px", backgroundColor: "whitesmoke" }}>
                                                {requirementData['suggestedimplementation']['backend']?.filename ? requirementData['suggestedimplementation']['backend'].filename : ""}
                                                <CopyToClipboard text={requirementData['suggestedimplementation']['backend']?.code} onCopy={handleCopy}>
                                                    <div style={{ backgroundColor: "#FCF0E9", padding: "8px", borderRadius: "4px", cursor: "pointer" }} onClick={() => { }}>
                                                        <Tooltip title="Copy To ClipBoard">
                                                            <i className="ri-file-copy-line"></i>
                                                        </Tooltip>
                                                    </div>
                                                </CopyToClipboard>
                                            </div>


                                            <ReactDiffViewer showDiffOnly={false} oldValue={requirementData['suggestedimplementation']['backend']?.previouscode} newValue={requirementData['suggestedimplementation']['backend']?.code} hideLineNumbers={true} splitView={true} styles={diffNewStyle} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <br />

                            <b>Database:</b><br />
                            {requirementData['suggestedimplementation']['database']?.instruction ? requirementData['suggestedimplementation']['database'].instruction : ""}<br /><br />
                            {requirementData['suggestedimplementation']['database']?.code && <div style={{ marginTop: "10px" }}>
                                <div style={{ width: "100%", display: "flex", justifyContent: 'space-between', alignItems: "center", paddingLeft: "10px", backgroundColor: "whitesmoke" }}>
                                    {requirementData['suggestedimplementation']['database']?.filename ? requirementData['suggestedimplementation']['database'].filename : ""}
                                    <CopyToClipboard text={requirementData['suggestedimplementation']['database']?.code} onCopy={handleCopy}>
                                        <div style={{ backgroundColor: "#FCF0E9", padding: "8px", borderRadius: "4px", cursor: "pointer" }} onClick={() => { }}>
                                            <Tooltip title="Copy To ClipBoard">
                                                <i className="ri-file-copy-line"></i>
                                            </Tooltip>
                                        </div>
                                    </CopyToClipboard>
                                </div>

                                <SyntaxHighlighter language="javascript" style={docco}>
                                    {requirementData['suggestedimplementation']['database']?.code}
                                </SyntaxHighlighter>
                            </div>}
                            <br />
                            <b style={{ fontSize: "20px" }}>Assumptions:</b><br />
                            {requirementData?.assumptions && requirementData.assumptions.length > 0 &&
                                <ul>
                                    {requirementData?.assumptions.map((text, i) => <li key={i}>{text}</li>)}
                                </ul>
                            }
                        </div>
                    }
                </Box>
            </Modal>

        </div>
    )
}

export default WorkOrderHistory