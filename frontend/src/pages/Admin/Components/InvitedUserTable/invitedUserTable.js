import React, { useState, useEffect } from 'react';
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
import Button from '@mui/material/Button';
import { useNavigate, useParams } from "react-router-dom";


function InvitedUserTable({ tabledata }) {
    const tableHeadings = ['Id', 'Name', 'Email', 'Role', 'Invitation Status', 'Action'];
    const navigate = useNavigate();
    const [showSpinner, setShowSpinner] = useState(true);

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
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSpinner(false);
        }, 3000); // 2000 milliseconds = 2 seconds

        return () => clearTimeout(timer);
    }, []);

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        "&:last-child td, &:last-child th": {
            border: 0,
        },
    }));

    const handelClickUserDetails = (item) => {
        // navigate(`/customers/details/${data}`);
        navigate(`/customers/details/${item.id}`, { state: item });
    }

    const handelClickNullDetails = () => {
        console.log('null details');
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', margin: 'auto' }}>
                <h2>Organization Users</h2>
            </div>

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
                                    {tabledata.map((item, i) => {
                                        console.log('jai baba ji ', item); // Log the item object
                                        return (
                                            <StyledTableRow key={i}>
                                                <StyledTableCell align="center">{item.id}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {item?.invitationStatus === 'pending' ? 'NA' : (item?.invitedUserDetails ? item?.invitedUserDetails?.firstname : 'NA')}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{item.invitedUserEmailId}</StyledTableCell>
                                                <StyledTableCell align="center">{item.assignedRole}</StyledTableCell>
                                                <StyledTableCell align="center">{item.invitationStatus}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Button className='text-capitalize' onClick={item?.invitationStatus === 'completed' ? () => { handelClickUserDetails(item.invitedUserDetails) } : handelClickNullDetails} variant="outlined">View</Button>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        );
                                    })}

                                </>
                            ) : (
                                <>
                                    <TableRow>
                                        <StyledTableCell colSpan={tableHeadings.length} align="center">
                                            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '20px' }}>
                                                {showSpinner ? <CircularProgress /> : 'No record found'}
                                            </Box>
                                        </StyledTableCell>
                                    </TableRow>
                                </>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}

export default InvitedUserTable;
