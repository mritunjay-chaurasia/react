import CheckIcon from "@mui/icons-material/Check";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { FormControl, IconButton, MenuItem, Select, TextField } from "@mui/material";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { default as React, useEffect, useState,useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import * as UserProjectApi from '../../../api/userProject.api';
import * as WikiPageApi from "../../../api/wikiPage.api";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import { showNotification } from '../../../utils/notification';
import { CircularProgress } from "@mui/material";
import MultipleSelectOption from '../../../components/MultipleSelectOption/MultipleSelectOption'
const ProjectInfoAndWiki = () => {
    const location = useLocation();
    const state = location.state;
    const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user
    const [selectedUserInfo, setSelectedUserInfo] = useState({ name: "", email: "", id: "" });
    const [userToUpdate, setUserToUpdate] = useState();
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [wikiDetails, setWikiDetails] = useState([]);
    const initialSelectedOptions = [
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
            value: "approved",
            label: "Approved"
        },
        {
          value: "pendingApproval",
          label: "Pending Approval"
        },
        {
          value: "estimatesProvided",
          label: "Estimates Provided"
        },
        {
            value: "released",
            label: "Released"
        },
        {
            value: "done",
            label: "Done"
        },
    ];
    let taskHoursList = [
        {
            key: "estAnlHrs",
            label: "Est Analysis Hrs",
        },
        {
            key: "estDevHrs",
            label: "Est Dev Hrs",
        },
        {
            key: "estQAHrs",
            label: "Est QA Hrs",
        },
        {
            key: "actAnlHrs",
            label: "Act Analysis Hrs",
        },
        {
            key: "actDevHrs",
            label: "Act Dev hrs",
        },
        {
            key: "actQAHrs",
            label: "Act QA Hrs",
        },
        {
            key: "estCost",
            label: "Estimated Cost",
        },
        {
            key: "developer",
            label: "Developer",
        },
        {
            key: "tester",
            label: "Tester",
        }
    ]
    const [allInvitedUsers, setAllInvitedUsers] = useState([]);
    const [selectedUserDetails, setSelectedUserDetails] = useState([]);
    const [selectedOptionsData, setSelectedOptionsData] = useState([]);
    const [isLoader, setIsLoader] = useState(true);
     const [selectedDetailsData, setSelectedDetailsData] = useState([]);

     const [fileilteredSelectedUsers, setFilteredSelectedUsers] = useState([]);
     const [filteredOptions, setFilteredOptions] = useState([]);
      const [filteredTaskHoursList, setFilteredTaskHoursList] = useState([]);

    useEffect(() => {
        if (state?.item?.id) {
            const getData = async () => {
                let projectId = state?.item?.id;
                const response = await WikiPageApi.getWikiPageData({ projectId: projectId });
                console.log("selectedProject ::: :::: 123", response.wikiDetails);
                setWikiDetails(response?.wikiDetails)
            };
            getData();
        }
    }, [state]);


    useEffect(() => {
        console.log('Project selectedUser', { selectedUser, state });
        // Find the selected user info based on the selectedUser ID
        if (selectedUser) {
            const user = state?.invitedUserDetails.find(item => item?.invitedUserId === selectedUser);
            if (user) {
                setSelectedUserInfo({ name: `${user.invitedUserDetails.firstname} ${user.invitedUserDetails.lastname}`, email: user.invitedUserDetails.emailid, id: user.invitedUserDetails.id });
                setUserToUpdate(user?.invitedUserDetails);
            } else {
                setSelectedUserInfo({ name: "", email: "", id: "" });
            }
        }

        let filteredList = state?.invitedUserDetails.filter(item => item.invitationStatus === "completed");
        setFilteredUsers(filteredList)

        const result = filteredList && filteredList?.length > 0 &&  filteredList.map(item => {
            const userDetails = item.invitedUserDetails;
            return {
                label: `${userDetails.firstname} ${userDetails.lastname}`,
                value: userDetails.id,
                emailid: userDetails.emailid
            };
        });
        console.log('>>>>>>>>>>>>>>>>>>   result111: ', result);
        setAllInvitedUsers(result)

    }, [selectedUser, state]);


    useEffect(()=>{
        (async()=>{
            try {
                if (state?.projectId) {
                    const projectID = state?.projectId;
                    const loadProject = await UserProjectApi.loadProject(projectID);
                    console.log('>>>>>>>>>>>>>>>>>>   loadProject: ', loadProject);

                    if (loadProject && loadProject.status && loadProject?.userProject) {
                        if(loadProject?.userProject){

                            if(loadProject?.userProject?.selectedStatus !== null ){
                                setSelectedOptionsData(loadProject.userProject?.selectedStatus)
                            } 
                            if(loadProject?.userProject?.selectedDetails !== null){
                                setSelectedDetailsData(loadProject.userProject?.selectedDetails)
                            }
                             if(loadProject?.userProject?.selectedPointUsers !== null){
                                const selectedUserIds = loadProject.userProject?.selectedPointUsers
                                let filteredList = state?.invitedUserDetails.filter(item => item.invitationStatus === "completed");
                                const result = filteredList && filteredList?.length > 0 &&  filteredList.map(item => {
                                    const userDetails = item.invitedUserDetails;
                                    return {
                                        label: `${userDetails.firstname} ${userDetails.lastname}`,
                                        value: userDetails.id,
                                        emailid: userDetails.emailid
                                    };
                                });
                                setAllInvitedUsers(result)
                                if(selectedUserIds && result?.length > 0){
                                    const userData = result.filter(item => selectedUserIds.includes(item.value));
                                    setSelectedUserDetails(userData)
                                  }
                            }
                        }
                        setIsLoader(false);
                    }
                    const userInfo = { name: `${loadProject.userProject.pointPersonUser.firstname} ${loadProject.userProject.pointPersonUser.lastname}`, email: loadProject.userProject.pointPersonUser.emailid };
                    console.log('userInfo :: :: :', loadProject.userProject.pointPersonUser);
                    setSelectedUserInfo(userInfo);

                }
            } catch (error) {
                console.error('Error fetching project details:', error);
            }
        })()
    },[state?.projectId])



    const handleUserSelect = (userId) => {
        setSelectedUser(userId);
        const dataToUpdate = {
            projectId: state.item.id,
            pointPerson: userId
        };
        console.log('update data:', dataToUpdate);
        UserProjectApi.updateProject(dataToUpdate);
    };

    useEffect(() => {
        // If selectedUserInfo changes, update the selectedUser state to the ID of the selected user
        const selectedUserId = filteredUsers.find(user => user.invitedUserDetails.firstname + ' ' + user.invitedUserDetails.lastname === selectedUserInfo.name)?.invitedUserId;
        if (selectedUserId) {
            setSelectedUser(selectedUserId);
        }
    }, [selectedUserInfo, filteredUsers]);


    const updateProjectDetails = (index, field, value) => {
        const updatedProjects = [...wikiDetails];
        updatedProjects[index].projectDetails[field] = value;
        setWikiDetails(updatedProjects);
    };

    // Function to toggle editing mode
    const handleEditButtonClick = (index, editing, field) => {
        const updatedProjects = [...wikiDetails];
        updatedProjects[index].editing = !editing;
        setWikiDetails(updatedProjects);
    };

    // Function to add a new project
    const addNewProject = () => {
        setWikiDetails([
            ...wikiDetails,
            { projectDetails: { project_name: '', link: '' }, editing: true }
        ]);
    };

    const removeProject = async (indexToRemove) => {
        console.log('Removing project', indexToRemove);
        const updatedProject = wikiDetails[indexToRemove];
        const WikiId = updatedProject?.id
        if (WikiId) {
            const responce = await WikiPageApi.deleteWikiDetails(WikiId)
            console.log('Removing project 2', responce)
            const updatedWikiDetails = [...wikiDetails];
            updatedWikiDetails.splice(indexToRemove, 1);
            setWikiDetails(updatedWikiDetails);
        } else {
            const updatedWikiDetails = [...wikiDetails];
            updatedWikiDetails.splice(indexToRemove, 1);
            setWikiDetails(updatedWikiDetails);

        }
    };

    const handleUpdateButtonClick = async (index) => {
        const updatedProject = wikiDetails[index];

        // Check if the project is being edited or it's a new project
        if (updatedProject.id) {
            // If the project already has an ID, it means it's an existing project being edited
            const idToUpdate = updatedProject.id;
            const dataToUpdate = {
                WikiId: idToUpdate,
                newDetails: updatedProject.projectDetails
            };
            console.log('Updated project details:', dataToUpdate);
            const response = await WikiPageApi.updateWikiDetails(dataToUpdate);
            console.log('Updated project details:', response);

            // Update the editing state of the project to false
            const updatedDetails = [...wikiDetails];
            updatedDetails[index].editing = false;
            setWikiDetails(updatedDetails);
        } else {
            console.log('Creating a new project:', updatedProject);

            // Prepare data to create a new project
            const dataToCreate = {
                projectId: state.item.id,
                projectDetails: {
                    "project_name": updatedProject.projectDetails.project_name,
                    "link": updatedProject.projectDetails.link
                }
            };
            console.log("Data to create new project:", dataToCreate);
            setWikiDetails(prevDetails => [
                ...prevDetails.slice(0, index), // Keep existing items before the index
                {
                    projectDetails: dataToCreate.projectDetails,
                    editing: false
                },
                ...prevDetails.slice(index + 1) // Keep existing items after the index
            ]);
            await WikiPageApi.createWikiPageData(dataToCreate);

            // Update the state with the new project details

        }
    };

    const handleSelectionChange = async(event, selectedOptions) => {
        setSelectedOptionsData(selectedOptions)
        if(state?.projectId && selectedOptions){
            const data = {
                userProjectId:state?.projectId,
                selectedOptions: selectedOptions
            };
           const response =  await UserProjectApi.updateUserProject(data);
            if (response && response.status) {
                showNotification("success", "Updated successfully")
            }
         }
        
      };
      

      const handleSelectedUserChange = async(event, selectedOptions) => {
        const userId = selectedOptions && selectedOptions.length > 0 && selectedOptions.map(item => item.value);
        setSelectedUserDetails(selectedOptions)
        if(state?.projectId && selectedOptions){
            const data = {
                userProjectId:state?.projectId,
                selectedPointUsersId: userId
            };
            const response = await UserProjectApi.updateUserProject(data);
            if (response && response.status) {
                showNotification("success", "Updated successfully")
            }
         }
      }

      const handleDetailsChange = async(event, selectedOptions) => {
        setSelectedDetailsData(selectedOptions)
        if(state?.projectId && selectedOptions){
            const data = {
                userProjectId:state?.projectId,
                selectedDetails: selectedOptions
            };
           const response =  await UserProjectApi.updateUserProject(data);
            if (response && response.status) {
                showNotification("success", "Updated successfully")
            }
         }
        
      };


    const updateFilteredData = useCallback(() => {
        const filteredSelectedUsers = Array.isArray(allInvitedUsers) && Array.isArray(selectedUserDetails)
            ? allInvitedUsers.filter(option => !selectedUserDetails.some(selected => selected.label === option.label))
            : [];
        
        const filterOptions = Array.isArray(initialSelectedOptions) && Array.isArray(selectedOptionsData)
            ? initialSelectedOptions.filter(option => !selectedOptionsData.some(selected => selected.label === option.label))
            : [];
        
        const taskHoursListData = Array.isArray(taskHoursList) && Array.isArray(selectedDetailsData)
            ? taskHoursList.filter(option => !selectedDetailsData.some(selected => selected.label === option.label))
            : [];

        setFilteredSelectedUsers(filteredSelectedUsers);
        setFilteredOptions(filterOptions);
        setFilteredTaskHoursList(taskHoursListData);
    }, [selectedUserDetails,selectedOptionsData, selectedDetailsData,allInvitedUsers]);

    useEffect(() => {
        updateFilteredData();
    }, [updateFilteredData]);
  

    return (
        <>
            {isLoader ? (
                <div className="loader-container h-100 w-100 d-flex align-items-center flex-column justify-content-center">
                <CircularProgress />
                </div>
            ) : (
            <div className='chatHistoryPage'>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
                    <div>
                        <h3>
                            Project Info
                        </h3>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <div>
                                <TableContainer component={Paper} style={{ width: '100%', margin: 'auto' }}>
                                    <Table aria-label="simple table" style={{ tableLayout: 'fixed', width: '100%' }}>
                                        <TableHead style={{ backgroundColor: '#f0f0f0' }}>
                                            <TableRow>
                                                <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                                                <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                                                <TableCell style={{ fontWeight: 'bold' }}>Point Person</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {/* {selectedUserInfo && ( */}
                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell>{selectedUserInfo?.name}</TableCell>
                                                <TableCell>{selectedUserInfo?.email}</TableCell>
                                                <TableCell>
                                                    <FormControl style={{ minWidth: '100px' }}>
                                                        <Select
                                                            labelId="demo-simple-select-autowidth-label"
                                                            id="demo-simple-select"
                                                            value={selectedUser}
                                                            onChange={(e) => handleUserSelect(e.target.value)}
                                                            style={{ height: "40px" }}
                                                        >
                                                            {filteredUsers && filteredUsers.length > 0 && filteredUsers.map(invite => (
                                                                <MenuItem style={{ color: 'black' }} key={invite.invitedUserId} value={invite.invitedUserId}>
                                                                    {`${invite.invitedUserDetails.firstname ? invite.invitedUserDetails.firstname : ""} ${invite.invitedUserDetails.lastname ? invite.invitedUserDetails.lastname : ""}`}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>
                                            {/* )} */}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h3>
                           Point Persons for Updates
                        </h3>
                        <MultipleSelectOption placeholder={"Select Users"} options={fileilteredSelectedUsers} defaultValue={selectedUserDetails} onChange={handleSelectedUserChange}  />
                              {selectedUserDetails && selectedUserDetails?.length > 0 &&
                               <TableContainer component={Paper} style={{ width: '100%', margin: 'auto' }}>
                                    <Table aria-label="simple table" style={{ tableLayout: 'fixed', width: '100%' }}>
                                        <TableHead style={{ backgroundColor: '#f0f0f0' }}>
                                            <TableRow>
                                                <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                                                <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                       {selectedUserDetails.map(user => (
                                       <TableRow key={user.value} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell>{user.label}</TableCell>
                                            <TableCell>{user.emailid}</TableCell>
                                        </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                              }
                    </div>

                    <div>
                        <h3>Add Status</h3> 
                        <div className="orgProjectBox p-5">
                        <MultipleSelectOption placeholder={"Select status..."} options={filteredOptions} defaultValue={selectedOptionsData} onChange={handleSelectionChange}  />
                        </div>
                    </div>

                    <div>
                        <h3>Add Details</h3> 
                        <div className="orgProjectBox p-5">
                        <MultipleSelectOption placeholder={"Add Details..."} options={filteredTaskHoursList} defaultValue={selectedDetailsData} onChange={handleDetailsChange}  />
                        </div>
                    </div>

                    <div>
                        <h3>Project Wiki Details</h3>
                        <div className="orgProjectBox">
                            <div>
                                {wikiDetails && wikiDetails.length > 0 && wikiDetails.map((project, index) => (
                                    <div className="d-flex mt-3 mb-3 w-100" style={{ alignItems: 'center' }} key={index}>
                                        <div className="selectedOrg w-50">
                                            <h5>Project Name</h5>
                                            <TextField
                                                className="w-75"
                                                id="outlined-basic"
                                                variant="outlined"
                                                value={project.projectDetails.project_name}
                                                onChange={(e) =>
                                                    updateProjectDetails(index, 'project_name', e.target.value)
                                                }
                                                disabled={!project.editing}
                                            />
                                        </div>
                                        <div className="selectedProject w-50">
                                            <h5>Link</h5>
                                            <TextField
                                                className="w-75"
                                                id="outlined-basic"
                                                variant="outlined"
                                                value={project.projectDetails.link}
                                                onChange={(e) => updateProjectDetails(index, 'link', e.target.value)}
                                                disabled={!project.editing}
                                            />
                                        </div>
                                        {project.editing && (
                                            <IconButton
                                                style={{ height: '56px', width: '56px' }}
                                                onClick={() => handleUpdateButtonClick(index)}
                                            >
                                                <CheckIcon />
                                            </IconButton>
                                        )}
                                        <IconButton
                                            style={{ height: '56px', width: '56px' }}
                                            onClick={() => handleEditButtonClick(index, project.editing)}
                                        >
                                            {project.editing ? <CancelIcon /> : <ModeEditIcon />}
                                        </IconButton>
                                        <IconButton
                                            style={{ height: '56px', width: '56px' }}
                                            onClick={() => removeProject(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                ))}
                                <IconButton onClick={addNewProject}>
                                    <AddIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    )
}

export default ProjectInfoAndWiki;
