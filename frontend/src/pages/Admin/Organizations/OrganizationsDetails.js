import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import OrganizationOwnerTable from '../Components/OrganizationOwnerTable/OrganizationOwnerTable';
import * as OrganisationApi from '../../../api/org.api';
import InvitedUserTable from '../Components/InvitedUserTable/invitedUserTable'
import ProjectDetailsTable from '../Components/ProjectDetailsTable/ProjectDetailsTable';
import { FormControl, InputLabel, MenuItem, Select, Snackbar } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const OrganizationsDetails = () => {

    const [invitedUserDetails, setInvitedUserDetails] = useState([])
    const [projectsDetails, setProjectsDetails] = useState([])
    const location = useLocation();
    const organisationDetails = location.state?.customData; // Accessing customData from location state
    console.log('my custom data :: :: :', organisationDetails)
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        const fetchOrganizationsDetails = async () => {
            try {
                let data = {
                    page: page,
                    limit: limit,
                    id: organisationDetails?.id
                }
                const Organizations = await OrganisationApi.getOrgDetailsById(data);
                console.log('Organizations 123 :: ::::',
                    Organizations
                );

                setInvitedUserDetails(Organizations?.invites)
                setProjectsDetails(Organizations?.organization?.allProjects)
                setTotalPages(Organizations?.totalCount)
                // if (Organizations.totalPages < page) setPage(1)

            } catch (error) {
                console.error('Error fetching organization details:', error);
            }
        };
        fetchOrganizationsDetails();
    }, [limit, page]);

    return (
        <>
            <div className='chatHistoryPage'>
                <div>
                    <OrganizationOwnerTable ownerDetails={organisationDetails?.ownerUserDetails} />
                </div>
                <div>
                    <div className="d-flex">
                    </div>
                    <InvitedUserTable tabledata={invitedUserDetails} />
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
                <div>
                    <ProjectDetailsTable tabledata={projectsDetails} invitedUserDetails={invitedUserDetails} />
                </div>
            </div>
        </>
    )
}

export default OrganizationsDetails