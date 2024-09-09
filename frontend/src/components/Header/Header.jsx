import React, { useState, useEffect,useCallback } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminlistItem, listItem, otherItem } from '../../constants/paths';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './header.css';
import { themeColors } from '../../App';
import { logout } from '../../store/user/userSlice';
import { insertProject, switchOrg, switchProject } from '../../store/organization/organizationSlice';
import { Button, Divider, FormControl, Modal, TextField } from '@mui/material';
import Verify from '../VerifyAccount/Verify';
import * as ProjectApi from "../../api/userProject.api";
import * as OrgApi from "../../api/org.api";
import { socket } from "../../socket";
import * as UserProjectApi from "../../api/userProject.api";
import { showNotification } from '../../utils/notification';
import { addOrganization } from '../../store/organization/actions';
import Notifications from '../Notifications/Notifications'
import Badge from '@mui/material/Badge';
import * as UsersNotificationApi from "../../api/usersNotification.api";
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


const Header = () => {
    const { userInfo, isLoading } = useSelector((state) => state.user);
    const orgDetails = useSelector((state) => state.orgDetails);
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const stateData = queryParameters.get('state');
    const parsedStateData = stateData ? JSON.parse(decodeURIComponent(stateData)) : null;
    const [activePath, setActivePath] = useState('Preview');
    const [isItSubPath, setIsItSubPath] = useState(false);
    const [allOrgs, setAllOrgs] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState({});
    const [selectedProject, setSelectedProject] = useState({});
    const [addOrgModal, setAddOrgModal] = useState(false);
    const [addProjectModal, setAddProjectModal] = useState(false);
    const { dataFrom } = location.state || {};
    const [projectData, setProjectData] = useState({
        projectname: "My Project",
    });
    const [orgData, setOrgData] = useState({
        orgName: "",
        projectname: "My Project",
    });
    const [displayList, setDisplayList] = useState(false);
    const [totalUnreadMessage, setTotalUnreadMessage]= useState(0)
    // ----------------------1-------------------------
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [fetchAllNotification , setFetchAllNotification] = useState([]);

    const { usertype } = useSelector(state => state.user.userInfo);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        usertype === 'superadmin' ? setIsAdmin(true) : setIsAdmin(false);
    }, [usertype]);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        try {
            let adminlistItemNew = []
            adminlistItem && adminlistItem.length > 0 && adminlistItem.map(item => {
                if (item.subTabs && item.subTabs.length > 0) adminlistItemNew.push(...item.subTabs)
                else adminlistItemNew.push(item)
            })

            let firstList = (isAdmin ? adminlistItemNew : listItem).find(item => item.path === `/${pathname.split('/')[1]}`)
            let secondList = otherItem.find(item => item.path === `/${pathname.split('/')[1]}`)
            if (pathname.split('/')[2]) {
                let subItems = firstList ? firstList : secondList
                let activeSubPath = subItems.subPaths.find(item => item.path === `/${pathname.split('/')[2]}`)
                setActivePath(activeSubPath.name);
                setIsItSubPath(true);
            } else {
                setActivePath((firstList && firstList.name) ? firstList.name : (secondList && secondList.name) ? secondList.name : 'Preview');
                setIsItSubPath(false);
            }
        } catch (error) {
            console.log("Error ", error);
        }
    }, [pathname, navigate])
    useEffect(() => {
        setAllOrgs(orgDetails.organizations || []);
        if (orgDetails?.selectedOrganization?.id) {
            setSelectedOrg(orgDetails.selectedOrganization);
            setSelectedProject(orgDetails.selectedProject);
        }
    }, [orgDetails])

      useEffect(() => {
        socket.on("all-users-notified", async (data) => {
            if(selectedProject && userInfo && userInfo?.id && selectedProject?.id &&  data.projectId === selectedProject?.id && data.notifiedBy !== userInfo.id ){
                let temp = {
                    projectId: selectedProject?.id,
                    type:"comments",
                  }
                //   console.log("Location>>>>>>>>>>>>>>>>  2", location.pathname);
                  if(location.pathname === '/updates'){
                    await UsersNotificationApi.updateNotification(temp)
                  }
                    const fetchAllNotification = await UsersNotificationApi.fetchUsersNotification(temp); 
                    if(fetchAllNotification && fetchAllNotification.status){
                        setTotalUnreadMessage(fetchAllNotification.count);
                        setFetchAllNotification(fetchAllNotification.userNotifications)
                    }
            }

        });
      }, [socket,selectedProject,userInfo,location]);

    useEffect(()=>{
        (async()=>{
            if(selectedProject && selectedProject?.id && userInfo && userInfo?.id){
                let tempData = {
                    projectId: selectedProject?.id,
                    type:"comments",
                }
                if(location.pathname === '/updates'){
                     await UsersNotificationApi.updateNotification(tempData)
                }
                const fetchAllNotification = await UsersNotificationApi.fetchUsersNotification(tempData); 
                if(fetchAllNotification && fetchAllNotification.status){
                    setTotalUnreadMessage(fetchAllNotification.count);
                    setFetchAllNotification(fetchAllNotification.userNotifications)
                }
            }
        })()
       },[selectedProject,userInfo,location])

       function stringToColor(string) {
        let hash = 0;
        let i;
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = "#";
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
      
        return color;
      }
      
      function stringAvatar(name) {
        return {
          sx: {
            bgcolor: stringToColor(name),
          },
          children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
        };
      }


    const handleLogout = () => {
        dispatch(logout());

        queryParameters.delete("q");
        const newUrl = `${window.location.pathname}?${queryParameters.toString()}`;
        window.history.replaceState({}, document.title, newUrl);
    }

    // ----------------------2-------------------------
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const open2 = Boolean(anchorEl2);
    const handleClick2 = (event) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleClose2 = () => {
        setAnchorEl2(null);
    };

    // ----------------------3-------------------------
    const [anchorEl3, setAnchorEl3] = React.useState(null);
    const open3 = Boolean(anchorEl3);
    const handleClick3 = (event) => {
        setAnchorEl3(event.currentTarget);
    };
    const handleClose3 = () => {
        setAnchorEl3(null);
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


    const handleAddOrganization = (e) => {
        e.preventDefault();
        dispatch(addOrganization(orgData));
        showNotification("success", "Organisation Added Successfully");
        setAddOrgModal(false);
    };

    async function handleDropDown() {
        try {
          setDisplayList(!displayList); 
      
          if (!selectedProject?.id) {
            console.error("Project ID is missing");
            return;
          }
      
          let tempData = {
            projectId: selectedProject.id,
          };
      
          const updatedNotification = await UsersNotificationApi.updateNotification(tempData);
          if (updatedNotification && updatedNotification.status) {
            const remainingData = await UsersNotificationApi.fetchUsersNotification(tempData);
            if (remainingData && remainingData.status) {
              setTotalUnreadMessage(remainingData.count);
              setFetchAllNotification(remainingData.userNotifications);
            }
          }
        } catch (error) {
          console.error("Error updating notifications:", error);
        }
      }
      
    return (
        <div className='appBody'>
            <div className='appHeader' style={{ backgroundColor: themeColors.tertiaryColor }}>
                <div className='d-flex align-items-center'>
                {isItSubPath && (
                        <IconButton
                            style={{ width: "36px", height: "36px" }}
                            onClick={() => (dataFrom && dataFrom === 'createWorkOrder') ? navigate("/workOrder") : (parsedStateData ? navigate("/workOrder") : navigate(-1))}
                        >
                            <i className="ri-arrow-left-s-line"></i>
                        </IconButton>
                    )}

                    <span className='pageHeadeing'>{activePath}</span>
                    {
                        !isAdmin && <div className='d-flex' style={{ marginLeft: "40px" }} >
                            <div
                                id="basic-button"
                                aria-controls={open2 ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open2 ? 'true' : undefined}
                                onClick={handleClick2}
                                style={{ marginRight: "10px", cursor: "pointer" }}
                            >
                                {selectedOrg.organizationname ? selectedOrg.organizationname : "Org1"}
                                <i className="ri-arrow-drop-down-line"></i>
                            </div>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl2}
                                open={open2}
                                onClose={handleClose2}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                {allOrgs && allOrgs.length > 0 && allOrgs.map(org => <MenuItem key={org.id} selected={selectedOrg.id === org.id} onClick={() => {
                                    dispatch(switchOrg(org.id));
                                    handleClose2();
                                }}>{org.organizationname ? org.organizationname : "Org1"}</MenuItem>)}
                                <Divider style={{ background: "grey" }} />
                                <MenuItem onClick={() => {
                                    // navigate("/myorganization");
                                    handleClose2();
                                    setAddOrgModal(true)
                                }}>Add Org</MenuItem>
                            </Menu>

                            <div
                                id="basic-button"
                                aria-controls={open3 ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open3 ? 'true' : undefined}
                                onClick={handleClick3}
                                style={{ marginRight: "10px", cursor: "pointer" }}
                            >
                                {selectedProject.projectname}
                                <i className="ri-arrow-drop-down-line"></i>
                            </div>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl3}
                                open={open3}
                                onClose={handleClose3}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                {selectedOrg?.allProjects && selectedOrg.allProjects.map(project => <MenuItem key={project.id} selected={selectedProject.id === project.id} onClick={() => {
                                    dispatch(switchProject(project.id));
                                    handleClose3();
                                }}>{project.projectname}</MenuItem>)}
                                <Divider style={{ background: "grey" }} />
                                <MenuItem onClick={() => {
                                    // navigate("/myorganization");
                                    handleClose3();
                                    setAddProjectModal(true)
                                }}>Add Project</MenuItem>
                            </Menu>
                        </div>
                    }


                    <Modal
                        open={addOrgModal || addProjectModal}
                        onClose={addProjectModal ? () => setAddProjectModal(false) : () => setAddOrgModal(false)}
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
                                            className='text-capitalize'
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
                                                value={orgData.orgName}
                                                onChange={(e) => setOrgData({ ...orgData, orgName: e.target.value })}
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
                                            className='text-capitalize'
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

                </div>
                <div className='profileMenuContainer'>
                    {/* <IconButton style={{ width: "42px", height: "42px" }}>
                        <i className="profilemenuIcon ri-moon-line"></i>
                    </IconButton>
                    <IconButton style={{ width: "42px", height: "42px" }}>
                        <Badge badgeContent={4} color="primary">
                            <i className="profilemenuIcon ri-notification-3-line"></i>
                        </Badge>
                    </IconButton> */}
                    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center',gap:"15px" }}>
                        <div style={{position:"relative"}}>
                        { totalUnreadMessage ? 
                           <Badge color="secondary" badgeContent={totalUnreadMessage} sx={{'& .MuiBadge-badge': { backgroundColor: '#f17132',},}}>
                                     <NotificationsIcon onClick={handleDropDown} style={{cursor: "pointer",color:"#bdbdbd"}} />
                             </Badge> : 
                             <NotificationsIcon totalUnreadMessage={totalUnreadMessage} onClick={handleDropDown} style={{cursor: "pointer",color:"#bdbdbd"}} />
                        }
                       
                         <Notifications totalUnreadMessage={totalUnreadMessage} userId={ userInfo.id}  fetchAllNotification={fetchAllNotification} displayList={displayList} setDisplayList={setDisplayList} position={"absolute"} top={"35px"} right={"0px"} setTotalUnreadMessage={setTotalUnreadMessage} setFetchAllNotification={setFetchAllNotification} />
                        </div>
    
                       <div onClick={handleClick} style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                        <Tooltip title="Account settings">
                            {userInfo?.firstname && userInfo?.lastname ? (
                                    <Avatar
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            fontSize: "14px",
                                        }}
                                        {...stringAvatar(`${userInfo.firstname} ${userInfo.lastname}`)}
                                    />
                                ) : (
                                    <Avatar style={{ width: "32px", height: "32px", fontSize: "14px" }} />
                                )}
                        </Tooltip>
                        <Typography
                            size="small"
                            sx={{ minWidth: 100, cursor: "pointer",color:"black" }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}>{`${(userInfo?.firstname || "")}`}</Typography>
                       </div>
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        {/* <MenuItem onClick={() => navigate("/myprofile")}>
                            <ListItemIcon>
                                <PersonAdd fontSize="small" />
                            </ListItemIcon>
                            My Profile
                        </MenuItem> */}
                        {
                            !isAdmin && <MenuItem onClick={() => navigate("/myorganization")}>
                                <ListItemIcon>
                                    <CorporateFareIcon fontSize="small" />
                                </ListItemIcon>
                                My Organization
                            </MenuItem>
                        }
                        <MenuItem onClick={() => navigate("/usage")}>
                            <ListItemIcon>
                                <DataUsageIcon fontSize="small" />
                            </ListItemIcon>
                            Usage
                        </MenuItem>
                        <MenuItem onClick={() => navigate("/profilesetting")}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Profile Setting
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Log Out
                        </MenuItem>
                    </Menu>
                </div>
            </div>
                
                  
            {
                !isLoading && !userInfo?.emailverified ? <Verify /> : null
            }
            <div className='appContent'>
                <Outlet />
            </div>

        </div>
    );
}

export default Header;