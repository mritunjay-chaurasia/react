import React from 'react';
import { useLocation } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const OrganizationOwnerTable = ({ ownerDetails }) => {
  const location = useLocation();

  function createData(name, email) {
    return { name, email };
  }

  const rows = [ownerDetails].length > 0 && [ownerDetails].map((owner) => createData(owner.firstname + ' ' + owner.lastname, owner.emailid));

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', margin: 'auto' }}>
        <h2>Organization Owner Details</h2>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <TableContainer component={Paper} style={{ width: '80%', margin: 'auto' }}>
          <Table aria-label="simple table">
            <TableHead style={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows && rows.length > 0 && rows.map((row) => (
                <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default OrganizationOwnerTable;
