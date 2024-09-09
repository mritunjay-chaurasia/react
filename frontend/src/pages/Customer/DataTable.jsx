import React, { useEffect, useState } from "react";
import "../ChatHistory/chathistory.css";
import Button from "@mui/material/Button";
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
import * as superAdminApi from '../../api/superAdmin.api';


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


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#284FA3",
        color: theme.palette.common.white,
        textTransform: "uppercase",
        fontSize: "16px",
        fontWeight: "600",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        // backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

function DataTable({ initialSortColumn, initialSortDirection }) {
    const orgDetails = useSelector((state) => state.orgDetails);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [sortColumn, setSortColumn] = useState(initialSortColumn);
    const [sortDirection, setSortDirection] = useState(initialSortDirection);

    const classes = useStyles();

    useEffect(() => {
        if (orgDetails?.selectedProject?.id) {
            (async () => {
                const response = await superAdminApi.getAllUsers({
                    page: page,
                    limit: limit,
                    searchText: searchText,
                });
                if (response && response.status) {
                    console.log('All Users ==================', response);
                    setData(response.allUsers);
                    setTotalPages(response.totalPage);
                }
            })();
        }
    }, [page, orgDetails, searchText, limit]);

    // Function to handle sorting
    const handleSort = (column) => {
        if (column === sortColumn) {
            // If the same column is clicked again, reverse the direction
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            // If a new column is clicked, set it as the sort column and default to ascending
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    // Sort the data based on the current sorting column and direction
    const sortedData = [...data].sort((a, b) => {
        // Check if the sortColumn exists in both 'a' and 'b' objects
        if (a[sortColumn] && b[sortColumn]) {
            if (sortDirection === "asc") {
                return a[sortColumn].localeCompare(b[sortColumn]);
            } else {
                return b[sortColumn].localeCompare(a[sortColumn]);
            }
        } else {
            // Handle the case where 'sortColumn' is missing in either 'a' or 'b'
            return 0; // No change in order
        }
    });

    const openUserDetails = (id) => {
        console.log("User id is ", id);

        const targetUser = sortedData.find((item) => item.id === id);
        console.log("Target User ", targetUser);
    }

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

    return (
        <>
            <div style={{height:'80vh',overflowY:'auto'}} className="chatHistoryPage">
                <div className="chatHistoryContainer">
                    <div className="chatHistoryHeader">
                        <span>Users Details</span>
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
                    <div className="chatHistoryTable">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell
                                            align="center"
                                            // onClick={() => handleSort("id")}
                                            // style={{ cursor: "pointer" }}
                                        >
                                            Id
                                        </StyledTableCell>
                                        <StyledTableCell
                                            align="center"
                                            onClick={() => handleSort("firstname")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            Name
                                        </StyledTableCell>

                                        <StyledTableCell
                                            align="center"
                                            onClick={() => handleSort("emailid")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            Email
                                        </StyledTableCell>
                                        {/* <StyledTableCell
                                            align="center"
                                            onClick={() => handleSort("timeZone")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            Timezone
                                        </StyledTableCell> */}

                                        <StyledTableCell
                                            align="center"
                                            onClick={() => handleSort("createdAt")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            Created Date
                                        </StyledTableCell>

                                        <StyledTableCell align="center">Details</StyledTableCell>
                                        {/* ... (other table headers) */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedData.length > 0 ? (
                                        <>
                                            {sortedData && sortedData.length > 0 && sortedData.map((item, i) => (
                                                <StyledTableRow key={i}>
                                                    <StyledTableCell align="center">
                                                        {i}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {item.firstname}
                                                    </StyledTableCell>

                                                    <StyledTableCell align="center">
                                                        {item.emailid}
                                                    </StyledTableCell>

                                                    {/* <StyledTableCell align="center">
                                                        {item.timeZone}
                                                    </StyledTableCell> */}

                                                    <StyledTableCell align="center">
                                                        {convertdateFormat(item.createdAt)}
                                                    </StyledTableCell>

                                                    <StyledTableCell align="center">
                                                        <Link to={`details/${item.id}`} state={item}>
                                                            <Button
                                                               className="text-capitalize"
                                                                variant="contained"
                                                                style={{
                                                                    background: "#F07227",
                                                                    borderRadius: "5px",
                                                                    width: "108px",
                                                                    height: "41px",
                                                                }}
                                                                // onClick={() => openUserDetails(item.id)}
                                                            >
                                                                Details
                                                            </Button>
                                                        </Link>
                                                    </StyledTableCell>
                                                    {/* ... (other table cells) */}
                                                </StyledTableRow>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <StyledTableRow>
                                                <StyledTableCell colSpan={6} align="center">
                                                    No record found
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
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
                                onChange={(event, page) => setPage(page)}
                            />
                        </Stack>
                    </div>
        </>
    );
}

export default DataTable;
