import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    IconButton,
    MenuItem,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOrganization, getOrgDetails } from "../../store/organization/actions";
import {
    deleteOrganization,
    deleteProject,
    insertProject,
    switchOrg,
    switchProject,
} from "../../store/organization/organizationSlice";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CheckIcon from "@mui/icons-material/Check";
// import { addProject } from "../../store/project/actions";
import * as ProjectApi from "../../api/userProject.api";
import * as OrgApi from "../../api/org.api";
import * as UserProjectApi from "../../api/userProject.api";
import "./organization.css";
import { showNotification } from "../../utils/notification";
import ConfirmationDialog from "./Components/ConfirmationDialog";
import { useNavigate } from "react-router-dom";


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "450px",
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
};

function Organization() {
    const dispatch = useDispatch();
    const orgDetails = useSelector((state) => state.orgDetails);
    const { selectedOrganization, invites, organizations } = useSelector((state) => state.orgDetails);
    const { planDetails } = useSelector((state) => state.subscription);

    const navigate = useNavigate()

    const [selectedOrg, setSelectedOrg] = useState({});
    const [selectedProject, setSelectedProject] = useState({});
    const [allMyOrgs, setAllMyOrgs] = useState([]);
    const [allOrgProjects, setAllOrgProjects] = useState([]);
    const [open, setOpen] = useState(false);
    const [addProjectModal, setAddProjectModal] = useState(false);
    const [orgNameEditing, setOrgNameEditing] = useState(false);
    const [projectNameEditing, setProjectNameEditing] = useState(false);
    const [projectData, setProjectData] = useState({
        projectname: "My Project",
    });
    const [orgData, setOrgData] = useState({
        companyname: "",
        companywebsite: "",
        projectname: "My Project",
    });

    const [projectDelete, setProjectDelete] = useState(false);
    const [orgDelete, setOrgDelete] = useState(false);


    useEffect(() => {
        if (orgDetails?.selectedOrganization?.id) {
            setSelectedOrg(orgDetails.selectedOrganization);
            setAllOrgProjects(orgDetails.selectedOrganization.allProjects);
        }
        if (orgDetails?.selectedProject?.id) setSelectedProject(orgDetails.selectedProject);

        if (orgDetails?.organizations) setAllMyOrgs(orgDetails.organizations);
    }, [orgDetails]);

    const handleSwitchOrg = (e) => {
        dispatch(switchOrg(e.target.value));
    };
    const handleSwitchProject = (e) => {
        dispatch(switchProject(e.target.value));
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddOrganization = (e) => {
        e.preventDefault();
        dispatch(addOrganization(orgData));
        setOpen(false);
    };

    const checkForUser = () => {
        let userType = "owner";
        if (invites && invites.length > 0) {
            let invitedOrg = invites.find((item) => item.invitedOrgId === selectedOrganization.id);
            if (invitedOrg) {
                if (invitedOrg.assignedRole === "admin") userType = "admin";
                else userType = "user";
            }
        }
        return userType;
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        try {
            const response = await ProjectApi.addProject({ orgId: selectedOrg?.id, ...projectData });
            if (response && response.status) {
                dispatch(insertProject(response?.project));
                showNotification("success", "Project Added Successfully");
            }
            setAddProjectModal(false);
        } catch (err) {
            setAddProjectModal(false);
            if (err?.response?.data?.message) showNotification("error", err.response.data.message);
        }
    };

    const updateOrg = async () => {
        try {
            const response = await OrgApi.updateOrganization({
                orgId: orgDetails.selectedOrganization.id,
                organizationname: selectedOrg.organizationname,
            });
            if (response && response.status) {
                showNotification("success", response.message);
                dispatch(getOrgDetails());
            }
            setOrgNameEditing(false);
        } catch (error) {
            showNotification("error", error.message);
            setOrgNameEditing(false);
        }
    };

    const updateProject = async () => {
        try {
            const response = await UserProjectApi.updateProject({
                projectId: orgDetails.selectedProject.id,
                projectname: selectedProject.projectname,
            });
            if (response && response.status) {
                showNotification("success", response.message);
                dispatch(getOrgDetails());
            }
            setProjectNameEditing(false);
        } catch (error) {
            showNotification("error", error.message);
            setProjectNameEditing(false);
        }
    };

    const refuseActionNotifty = () => {
        showNotification("error", "You are not allowed to perform this action");
    };

    const handleDeleteProject = async () => {
        if (selectedOrg.allProjects.length === 1) {
            setProjectDelete(false);
            return showNotification("error", "You can't delet last project");
        }
        const response = await UserProjectApi.deleteProject(selectedProject?.id)
        if (response && response.status) {
            setProjectDelete(false);
            showNotification("success", "Project Deleted Successfully!");
            dispatch(deleteProject(selectedProject?.id))
        }
        else showNotification("error", "Something went wrong, Please try again later!");
    }

    const handleDeleteOrg = async (e) => {
        if (organizations.length === 1) {
            setOrgDelete(false);
            return showNotification("error", "You can't delet last Organization");
        }
        const response = await OrgApi.deleteOrganization(selectedOrganization?.id)
        if (response && response.status) {
            setOrgDelete(false);
            showNotification("success", "Organization Deleted Successfully!");
            dispatch(deleteOrganization(selectedOrganization?.id))
        }
        else showNotification("error", "Something went wrong, Please try again later!");
    }

    const handleAddOrg = () => {
        // planDetails
        // if (checkForUser() === "user") return refuseActionNotifty();
        // if (planDetails && organizations.length >= planDetails.limits.org) return showNotification("info", "Upgrade your plan to add more organization", 8,
        //     <Button
        //         variant="outlined"
        //         style={{
        //             color: "#F07227",
        //             border: "1px solid #F07227",
        //         }}
        //         sx={{
        //             ":hover": {
        //                 bgcolor: "#FCE9E9",
        //             },
        //         }}
        //         onClick={() => navigate("/subscription")}
        //     >
        //         Upgrade
        //     </Button>)
        setOpen(true)

    }

    const handleCheckAddProject = () => {
        // planDetails
        if (checkForUser() === "user") return refuseActionNotifty();
        // if (planDetails && selectedOrganization.allProjects.length >= planDetails.limits.projectsPerOrg) return showNotification("info", "Upgrade your plan to add more projects", 8,
        //     <Button
        //         variant="outlined"
        //         style={{
        //             color: "#F07227",
        //             border: "1px solid #F07227",
        //         }}
        //         sx={{
        //             ":hover": {
        //                 bgcolor: "#FCE9E9",
        //             },
        //         }}
        //         onClick={() => navigate("/subscription")}
        //     >
        //         Upgrade
        //     </Button>)
        setAddProjectModal(true)

    }

    return (
        <>
            <Modal
                open={open || addProjectModal}
                onClose={addProjectModal ? () => setAddProjectModal(false) : handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <form onSubmit={addProjectModal ? handleAddProject : handleAddOrganization}>
                    <Box sx={style}>
                        {addProjectModal ? (
                            <>
                                <TextField
                                    id="outlined-basic"
                                    label="Project Name"
                                    variant="outlined"
                                    style={{ margin: "10px 0", width: "100%" }}
                                    required
                                    value={projectData.projectname}
                                    onChange={(e) =>
                                        setProjectData({
                                            ...projectData,
                                            projectname: e.target.value,
                                        })
                                    }
                                />
                                <Button
                                    className="text-capitalize"
                                    variant="outlined"
                                    style={{ height: "56px", width: "100%", margin: "15px 0" }}
                                    type="submit"
                                    onClick={handleAddProject}
                                >
                                    Add
                                </Button>
                            </>
                        ) : (
                            <>
                                <Typography
                                    id="modal-modal-title"
                                    variant="h5"
                                    component="h2"
                                    style={{ marginBottom: "15px" }}
                                >
                                    Add Organization
                                </Typography>
                                <FormControl style={{ width: "100%" }}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Organization Name"
                                        variant="outlined"
                                        style={{ margin: "10px 0", width: "100%" }}
                                        required
                                        value={orgData.companyname}
                                        onChange={(e) => setOrgData({ ...orgData, companyname: e.target.value })}
                                    />
                                    <TextField
                                        id="outlined-basic"
                                        label="Website"
                                        variant="outlined"
                                        style={{ margin: "10px 0", width: "100%" }}
                                        required
                                        value={orgData.companywebsite}
                                        onChange={(e) => setOrgData({ ...orgData, companywebsite: e.target.value })}
                                    />
                                    <TextField
                                        id="outlined-basic"
                                        label="Project Name"
                                        variant="outlined"
                                        style={{ margin: "10px 0", width: "100%" }}
                                        required
                                        value={orgData.projectname}
                                        onChange={(e) => setOrgData({ ...orgData, projectname: e.target.value })}
                                    />
                                </FormControl>
                                <Button
                                    className="text-capitalize"
                                    variant="outlined"
                                    style={{ height: "56px", width: "100%", margin: "15px 0" }}
                                    type="submit"
                                >
                                    Add Organization
                                </Button>
                            </>
                        )}
                    </Box>
                </form>
            </Modal>
            <div className="myOrganizationPage">
                <div className="myOrganizationBox">
                    <div className="w-100 d-flex justify-content-end mb-3">
                        <Button
                            className="addKeysButton text-capitalize"
                            variant="outlined"
                            style={{
                                color: "#F07227",
                                border: "1px solid #F07227",
                                marginRight: "10px",
                                fontSize: "17px",
                                fontWeight: 700,
                            }}
                            sx={{
                                ":hover": {
                                    bgcolor: "#FCE9E9",
                                },
                            }}
                            onClick={handleAddOrg}
                        >
                            <i className="ri-organization-chart" style={{ marginRight: "10px" }}></i>
                            Add Org
                        </Button>
                        <Button
                            className="addIntegrationButton text-capitalize"
                            variant="contained"
                            style={{ backgroundColor: "#F07227", fontSize: "17px", fontWeight: 700 }}
                            onClick={handleCheckAddProject}
                        >
                            <i className="ri-robot-line" style={{ marginRight: "10px" }}></i>
                            Add Project
                        </Button>
                    </div>
                    <div className="orgProjectBox">
                        {/* <div className="d-flex mt-3 mb-3 w-100">
                            <div className="selectedOrg w-50">
                                <h5>Organisation</h5>
                                {selectedOrg?.id && (
                                    <TextField
                                        className="w-75"
                                        select
                                        defaultValue={selectedOrg.id}
                                        value={selectedOrg.id}
                                        onChange={handleSwitchOrg}
                                    >
                                        {allMyOrgs.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.organizationname}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    
                                )}
                                
                            </div>
                            <div className="selectedProject w-50">
                                <h5>Project</h5>
                                {selectedProject?.id && (
                                    <TextField
                                        className="w-75"
                                        select
                                        defaultValue={selectedProject.id}
                                        value={selectedProject.id}
                                        onChange={handleSwitchProject}
                                    >
                                        {allOrgProjects.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.projectname}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            </div>
                        </div> */}
                        <div className="d-flex mt-3 mb-3 w-100">
                            <div className="selectedOrg w-50">
                                <h5>Organisation</h5>
                                <TextField
                                    className="w-75"
                                    id="outlined-basic"
                                    variant="outlined"
                                    value={selectedOrg?.organizationname ? selectedOrg.organizationname : ""}
                                    onChange={(e) =>
                                        setSelectedOrg({
                                            ...selectedOrg,
                                            organizationname: e.target.value,
                                        })
                                    }
                                    disabled={!orgNameEditing}
                                />
                                <IconButton
                                    style={{ height: "56px", width: "56px" }}
                                    onClick={
                                        orgNameEditing
                                            ? updateOrg
                                            : () =>
                                                checkForUser() === "user"
                                                    ? refuseActionNotifty()
                                                    : setOrgNameEditing(true)
                                    }
                                >
                                    {orgNameEditing ? <CheckIcon /> : <ModeEditIcon />}
                                </IconButton>
                            </div>
                            <div className="selectedProject w-50">
                                <h5>Project</h5>
                                <TextField
                                    className="w-75"
                                    id="outlined-basic"
                                    variant="outlined"
                                    value={selectedProject?.projectname ? selectedProject.projectname : ""}
                                    onChange={(e) =>
                                        setSelectedProject({
                                            ...selectedProject,
                                            projectname: e.target.value,
                                        })
                                    }
                                    disabled={!projectNameEditing}
                                />

                                <IconButton
                                    style={{ height: "56px", width: "56px" }}
                                    onClick={
                                        projectNameEditing
                                            ? updateProject
                                            : () =>
                                                checkForUser() === "user"
                                                    ? refuseActionNotifty()
                                                    : setProjectNameEditing(true)
                                    }
                                >
                                    {projectNameEditing ? <CheckIcon /> : <ModeEditIcon />}
                                </IconButton>
                            </div>
                        </div>
                    </div>
                    <Button
                        className="text-capitalize"
                        variant="contained"
                        style={{ backgroundColor: "#C70000", fontSize: "15px", fontWeight: 600, height: "52px", margin: "20px 0" }}
                        onClick={() => setOrgDelete(true)}
                    >
                        <i className="ri-delete-bin-6-line" style={{ marginRight: "10px" }}></i>
                        Delete Organization
                    </Button>
                    <Button
                       className="text-capitalize"
                        variant="contained"
                        style={{ backgroundColor: "#C70000", fontSize: "15px", fontWeight: 600, height: "52px", margin: "20px 0 20px 20px" }}
                        onClick={() => setProjectDelete(true)}
                    >
                        <i className="ri-delete-bin-6-line" style={{ marginRight: "10px" }}></i>
                        Delete Project
                    </Button>
                    <ConfirmationDialog
                        open={orgDelete}
                        handleClose={() => setOrgDelete(false)}
                        handleConfirm={handleDeleteOrg}
                        title={"Delete This Organization?"}
                        text={`All settings and data associated with this organization, including projects, repositories, tasks, etc., will be permanently deleted and cannot be restored. Are you sure you want to delete this organization?\nTo confirm, type exact name of the Organization in the box below. (${selectedOrganization.organizationname})`}
                        label={"Organization Name"}
                        matchValue={selectedOrg.organizationname}
                    />
                    <ConfirmationDialog
                        open={projectDelete}
                        handleClose={() => setProjectDelete(false)}
                        handleConfirm={handleDeleteProject}
                        title={"Delete This Project?"}
                        text={`All settings and data associated with this project, including repositories, tasks, etc., will be permanently deleted and cannot be restored. Are you sure you want to delete this project?\nTo confirm, type exact name of the Project in the box below. (${selectedProject.projectname})`}
                        label={"Project Name"}
                        matchValue={selectedProject.projectname}
                    />
                </div>
            </div>
        </>
    );
}
export default Organization;
