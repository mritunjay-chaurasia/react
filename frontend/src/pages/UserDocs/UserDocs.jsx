import * as React from "react";
import { useEffect, useState } from "react";
import "./userdocs.css";
import Button from "@mui/material/Button";
import * as ChatHistoryApi from "../../api/chathistory.api";
import * as AdminApi from "../../api/superAdmin.api";
import { styled } from "@mui/material/styles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DataTable from "../../components/DataTable/DataTable";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select } from "@mui/material";




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

const CustomComponent = ({ item, actionFunction }) => {
    return (
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
    )
}

function UserDocs() {
    const orgDetails = useSelector((state) => state.orgDetails);
    const { usertype } = useSelector(state => state.user.userInfo);

    const [chatHistoryData, setChatHistoryData] = useState([]);
    const [page, setPage] = useState(localStorage.getItem('userDocsPage') ? localStorage.getItem('userDocsPage') : 1);
    const [limit, setLimit] = useState(localStorage.getItem('userDocsLimit') ? localStorage.getItem('userDocsLimit') : 10);
    const [searchText, setSearchText] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [openDocViewerModal, setOpenDocViewerModal] = useState(false);
    const [viewingDocument, setViewingDocument] = useState("");

    let tableHeadings = ["Customer Name", "Email", "Date", "Project", "Doc Type", "Action"]

    const classes = useStyles();

    const descriptionElementRef = React.useRef(null);

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

    useEffect(() => {
        if (openDocViewerModal) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [openDocViewerModal]);

    useEffect(() => {
        (async () => {
            const response = await AdminApi.getAllDocs({
                page: page,
                limit: limit,
                searchText: searchText,
            });
            if (response && response.status) {
                // Assuming you have 'chatHistoryData' containing your JSON data
                const formattedData = response?.allDocs.map((item) => ({
                    userName: `${item?.userdetails?.firstname}`,
                    sessionId: item?.userdetails.emailid,
                    createdAt: convertdateFormat(item.createdAt),
                    project: item.projecttype,
                    type: item.istechnical ? "technical" : "business",
                    customComponent: (<Button
                        variant="contained"
                        style={{
                            background: "#F07227",
                            borderRadius: "5px",
                            width: "108px",
                            height: "41px",
                        }}
                        onClick={() => {
                            setOpenDocViewerModal(true);
                            setViewingDocument(item.data)
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
                    </Button>),
                }));
                setChatHistoryData(formattedData);
                setTotalPages(response.totalPage);
                if (response.totalPage < page) setPage(1)
            }
        })();
    }, [page, searchText, limit]);

    useEffect(() => {
        // Store page and limit in localStorage
        localStorage.setItem("userDocsPage", page);
        localStorage.setItem("userDocsLimit", limit);
      }, [page, limit]);


    return (
        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <>
                <div className="chatHistoryPage">
                    <div className="chatHistoryContainer">
                        <div className="chatHistoryHeader">
                            <span>Full Chat History</span>
                            <div className="d-flex">
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
                                <div className="chatHistorySearchBar">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />
                                    <i className="ri-search-line"></i>
                                </div>
                            </div>
                        </div>
                        <Dialog
                            open={openDocViewerModal}
                            onClose={() => setOpenDocViewerModal(false)}
                            scroll={"paper"}
                            aria-labelledby="scroll-dialog-title"
                            aria-describedby="scroll-dialog-description"
                        >
                            <DialogTitle id="scroll-dialog-title">Documentation</DialogTitle>
                            <DialogContent dividers={true}>
                                <DialogContentText
                                    id="scroll-dialog-description"
                                    ref={descriptionElementRef}
                                    tabIndex={-1}
                                    sx={{whiteSpace: "pre-wrap"}}
                                >
                                    {viewingDocument}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button className="text-capitalize" onClick={() => setOpenDocViewerModal(false)}>Close</Button>
                            </DialogActions>
                        </Dialog>
                        <DataTable tableHeadings={tableHeadings} tabledata={chatHistoryData} />
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
                    </div>
                </div>
            </>
        </div>
    )
}

export default UserDocs;