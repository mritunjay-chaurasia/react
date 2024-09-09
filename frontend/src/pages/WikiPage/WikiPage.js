import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import * as React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/DataTable/DataTable";
import * as WikiPageApi from "../../api/wikiPage.api";
import DataTableWikiPage from "../../components/DataTableWikiPage/DataTableWikiPage";
import { showNotification } from '../../utils/notification';

const WikiPage = () => {
    const { selectedProject, selectedOrganization } = useSelector((state) => state.orgDetails);
    const { userInfo } = useSelector(state => state.user);
    const navigate = useNavigate();
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
    const [workOrderStatusList, setWorkOrderStatusList] = useState([
        {
            value: "draft",
            label: "Draft"
        },
        {
            value: "sentToDev",
            label: "Sent To Developer"
        },
        {
            value: "inProgress",
            label: "In Progress"
        },
        {
            value: "rejected",
            label: "Rejected"
        },
        {
            value: "todo",
            label: "ToDo"
        },
        {
            value: "reopened",
            label: "Reopened"
        },
        {
            value: "qa",
            label: "QA"
        },
        {
            value: "codeReview",
            label: "Code Review"
        },
        {
            value: "readyToRelease",
            label: "Ready To Release"
        },
        {
            value: "realeaseApproved",
            label: "Realease Approved"
        },
        {
            value: "released",
            label: "Released"
        },
    ]);
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
    const [wikiDetails,setWikiDetails] = useState([])
    let tableHeadings = ["Name", "Link"]
    // useEffect(() => {
    const fetchData = async () => {
        const dataToCreate = {}
        dataToCreate.projectId = 1
        dataToCreate.projectDetails = {
            "project_name": "astray",
            "link": "app.astray.co"
        }
        await WikiPageApi.createWikiPageData(dataToCreate);
        console.log("selectedProject ::: ::::", { selectedProject, dataToCreate });
    };

    // const getData = async () => {
    //     let projectId = selectedProject.id
    //     const responce = await WikiPageApi.getWikiPageData({ projectId: projectId });
    //     console.log("selectedProject ::: :::: 123", responce.wikiDetails);
    // };

    useEffect(() => {
        if (selectedProject?.id) {
            const getData = async () => {
                let projectId = selectedProject.id;
                const response = await WikiPageApi.getWikiPageData({ projectId: projectId });
                console.log("selectedProject ::: :::: 123", response?.wikiDetails);
                setWikiDetails(response?.wikiDetails?.reverse())
            };
            getData();
        }
    }, [selectedProject]);

    return (
        <>
            {/* <button onClick={fetchData}>
                balle balle
            </button> */}
            {/* <button onClick={getData}>
                balle balle 2
            </button> */}
            <div className="workOrderPage">
                <div className="workOrderListContainer">
                    {/* <div className="workOrderHeader"> */}
                        {/* <span>Wiki table</span> */}
                        {/* <div className="d-flex"> */}
                            {/* <FormControl sx={{ mr: 2 }}>
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
                            </FormControl> */}
                            {/* <div className="workOrderListSearchBar">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                                <i className="ri-search-line"></i>
                            </div> */}
                        {/* </div> */}
                    {/* </div> */}
                    <DataTableWikiPage tableHeadings={tableHeadings} tabledata={wikiDetails} />
                    {/* <div className="workOrderListTablePagination">
                        <Stack spacing={2}>
                            <Pagination
                                // count={totalPages}
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
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default WikiPage