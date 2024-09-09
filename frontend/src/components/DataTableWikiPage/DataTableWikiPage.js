import * as React from "react";
// import "./datatable.css";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { showNotification } from '../../utils/notification';

function DataTableWikiPage({ tableHeadings, tabledata }) {
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
        "&:nth-of-type(odd)": {},
        "&:last-child td, &:last-child th": {
            border: 0,
        },
    }));

    const handleActionClick = (rowData) => {
        const link = rowData?.projectDetails?.link;
            navigator.clipboard.writeText(link).then(() => {
            console.log('Link copied to clipboard:', link);
            showNotification("success", "Link copied to clipboard")
        }).catch((error) => {
            console.error('Failed to copy link to clipboard:', error);
        });
    };
    

    return (
        <div style={{ margin: "30px 0" }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {tableHeadings && tableHeadings.length > 0  && tableHeadings.map((heading, index) => (
                                <StyledTableCell className="text-capitalize" key={index} align="center">{heading}</StyledTableCell>
                            ))}
                            <StyledTableCell className="text-capitalize" align="center">Action</StyledTableCell> {/* Action column */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tabledata && tabledata.length > 0 ? (
                            tabledata.map((item, index) => (
                                <StyledTableRow key={index}>
                                    {Object.entries(item.projectDetails).map(([key, value], index) => (
                                        <StyledTableCell key={index} align="center">
                                            {value}
                                        </StyledTableCell>
                                    ))}
                                    <StyledTableCell align="center">
                                        <Button className="text-capitalize" variant="contained" color="primary" onClick={() => handleActionClick(item)}>
                                            Copy Link
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell colSpan={tableHeadings.length + 1} align="center">
                                    No record found
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default DataTableWikiPage;
