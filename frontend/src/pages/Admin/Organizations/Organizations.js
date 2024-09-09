import SubjectIcon from '@mui/icons-material/Subject';
import { FormControl, InputLabel, MenuItem, Select, Snackbar } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as OrganisationApi from '../../../api/org.api';
import './Organizations.css';
import DataTableOrganization from './DataTableOrganization.js';
import Button from "@mui/material/Button";
import Checkbox from '@mui/material/Checkbox';

const Organizations = () => {
    const { state } = useLocation();
    const [allOrganizationsDetails, setAllOrganizationsDetails] = useState([])
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [show, setShow] = useState(false);
    const [isSelected, setIsSelected] = useState(true);
    const [isClearFilter, setIsClearFilter] = useState(false);
    const [showCheckbox, setShowCheckbox] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const handleFilterClick = () => {
        setShowCheckbox(true);
    };

    const handleClearFilter = () => {
        // Implement your logic to clear the filter
        setShowCheckbox(false); // Close the checkbox after clearing the filter
        setIsChecked(false)
    };


    useEffect(() => {
        const fetchAllOrganizationsDetails = async () => {
            try {
                if (!isChecked) {
                    let data = {
                        page: page,
                        limit: limit,
                        searchText: searchText
                    }
                    console.log('allOrganizationsDetails data:', data);
                    const allOrganizations = await OrganisationApi.getAllOrgDetails(data);

                    console.log('allOrganizationsDetails:', allOrganizations);
                    setAllOrganizationsDetails(allOrganizations?.organizations)
                    setTotalPages(allOrganizations?.totalPages)
                    if (allOrganizations.totalPages < page) setPage(1)
                } else if (isChecked) {
                    let data = {
                        page: page,
                        limit: limit,
                        searchText: searchText
                    }
                    console.log('allOrganizationsDetails data:', data);
                    const allOrganizations = await OrganisationApi.getAllOrgDetailsOwner(data);

                    console.log('allOrganizationsDetails:', allOrganizations);
                    setAllOrganizationsDetails(allOrganizations?.organizations)
                    setTotalPages(allOrganizations?.totalPages)
                    if (allOrganizations.totalPages < page) setPage(1)
                }

            } catch (error) {
                // Handle the error here
                console.error('Error fetching organization details:', error);
            }
        };

        fetchAllOrganizationsDetails();
    }, [page, limit, searchText]);

    useEffect(() => {
        console.log('Organizations searchText', searchText)
    }, [searchText]);
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        console.log('Check isChecked', isChecked)
        if (isChecked) {

        }
        // Perform any other action based on checkbox state change
    };


    return (
        <>
            <div className="workOrderPage">
                <div className="workOrderListContainer">
                    <div className="workOrderHeader">
                        <span>Organizations Details</span>
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
                            <div className="workOrderListSearchBar">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                                <i style={{ cursor: 'pointer' }} className="ri-search-line"></i>
                            </div>
                            <div className="filter-workOrderList">
                                <span
                                    style={{ cursor: "pointer" }}
                                    onClick={handleFilterClick}
                                >
                                    <SubjectIcon /> Filter
                                </span>

                                {showCheckbox && (
                                    <div className="filter-options">
                                        <span>Search by owner name</span>
                                        <Checkbox
                                            checked={isChecked}
                                            onChange={handleCheckboxChange}
                                        />
                                        <Button className='text-capitalize' onClick={handleClearFilter}>Clear</Button>
                                    </div>
                                )}
                            </div>


                        </div>
                    </div>
                    <DataTableOrganization tabledata={allOrganizationsDetails} />
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
        </>
    )
}

export default Organizations;