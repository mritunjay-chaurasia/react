import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from "react-router-dom";


function DataTableOrganization({ tabledata }) {
    const tableHeadings = ['Id', 'Organization Name', 'Owner', 'Status', 'Created At', 'Action'];
    const navigate = useNavigate();

    console.log("tabledatatabledata", tabledata);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "#284FA3",
            color: theme.palette.common.white,
            fontSize: "16px",
            fontWeight: "600",
            textTransform: 'capitalize',
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        "&:last-child td, &:last-child th": {
            border: 0,
        },
    }));

    const handelClickOrginationDetails = (data) => {
        navigate('/Organizations/details', { state: { customData: data } });
    }
    

    return (
        <div style={{ margin: "30px 0" }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {tableHeadings && tableHeadings.length > 0 && tableHeadings.map((item, index) => (
                                <StyledTableCell key={index} align="center">
                                    {item}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tabledata.length > 0 ? (
                            <>
                                {tabledata.map((item, i) => (
                                    <StyledTableRow key={i}>
                                        <StyledTableCell align="center">{item.id}</StyledTableCell>
                                        <StyledTableCell align="center">{item.organizationname}</StyledTableCell>
                                        <StyledTableCell align="center">{item.ownerUserDetails.firstname + ' ' + item.ownerUserDetails.lastname}</StyledTableCell>
                                        <StyledTableCell align="center">{item.status}</StyledTableCell>
                                        <StyledTableCell align="center">{new Date(item.createdAt).toLocaleString()}</StyledTableCell>
                                        <StyledTableCell align="center">
                                        <Button className="text-capitalize" onClick={()=>{handelClickOrginationDetails(item)}} variant="outlined">View</Button>
                                        </StyledTableCell>

                                    </StyledTableRow>
                                ))}
                            </>
                        ) : (
                            <>
                                <TableRow>
                                    <StyledTableCell colSpan={tableHeadings.length} align="center">
                                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '20px' }}>
                                            <CircularProgress />
                                        </Box>
                                    </StyledTableCell>
                                </TableRow>
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default DataTableOrganization;
