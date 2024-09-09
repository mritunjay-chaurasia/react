import React, { useState,useEffect } from 'react';
import "./datatable.css";
import { CircularProgress } from '@mui/material';
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from '@mui/material/Box';
import MultipleSelectCheckmarks from '../MultipleSelectCheckmarks'

function DataTable({ tableHeadings, tabledata, workOrderStatusList,allOrgUsers,checkedReporters,setCheckedReporters,checkedModes,setCheckedModes,checkedStatuses,setCheckedStatuses,checkedAssignees,setCheckedAssignees,checkedCreatedDates,setCheckedCreatedDates,setIsCheckedCreatedDates,isCheckedCreatedDates ,applyFilter,loading}) {


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "#284FA3",
            color: theme.palette.common.white,
            textTransform: "uppercase",
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
            // backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        "&:last-child td, &:last-child th": {
            border: 0,
        },
    }));

    return (
        <div style={{ margin: "30px 0" }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        {tableHeadings.map((heading, index) => (
                          !["Id", "Task", "Action"].includes(heading) ? (
                            <StyledTableCell align="center" key={index}>
                              <div>
                                {applyFilter ? <MultipleSelectCheckmarks heading={heading} workOrderStatusList={workOrderStatusList} allOrgUsers={allOrgUsers}  checkedReporters={checkedReporters} setCheckedReporters={setCheckedReporters} checkedModes={checkedModes} setCheckedModes={setCheckedModes} checkedStatuses={checkedStatuses} setCheckedStatuses={setCheckedStatuses} checkedAssignees={checkedAssignees} setCheckedAssignees={setCheckedAssignees} checkedCreatedDates={checkedCreatedDates} setCheckedCreatedDates={setCheckedCreatedDates} setIsCheckedCreatedDates={setIsCheckedCreatedDates} isCheckedCreatedDates={isCheckedCreatedDates}/> : <span>{heading}</span> }
                              </div>
                            </StyledTableCell>
                          ) : (
                            <StyledTableCell align="center" key={index}>{heading}</StyledTableCell>
                          )
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                            <>
                                {tabledata.length > 0 ? (
                                tabledata.map((item, i) => (
                                    <StyledTableRow key={i}>
                                    {Object.keys(item).map((elemKey, index) => (
                                        elemKey !== "usertype" && (
                                        <StyledTableCell align="center" key={index}>
                                            {item[elemKey] ? item[elemKey] : ""}
                                        </StyledTableCell>
                                        )
                                    ))}
                                    </StyledTableRow>
                                ))
                                ) : (
                                <TableRow>
                                    <StyledTableCell colSpan={tableHeadings.length} align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '20px' }}>
                                       {loading ?  <CircularProgress /> :<p>No record found</p>}
                                    </Box>
                                    </StyledTableCell>
                                </TableRow>
                                )}
                            </>
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    )
}

export default DataTable;
