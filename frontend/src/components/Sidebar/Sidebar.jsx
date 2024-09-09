import React, { useEffect, useState, useCallback } from 'react';
import Logo from '../../assets/images/astorai-logo.png';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import './sidebar.css';
import { themeColors } from '../../App';
import { styled } from '@mui/material/styles';
import { listItem, otherItem, adminlistItem,liveUserArray } from '../../constants/paths';
import { useSelector } from 'react-redux';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import Badge from '@mui/material/Badge';
import { socket } from "../../socket";
import * as UsersNotificationApi from "../../api/usersNotification.api";

const Sidebar = () => {
    const location = useLocation();
    const activePath = listItem.find(item => item.path === location.pathname);
    const navigation = useNavigate();
    const [isActive, setIsActive] = useState(activePath && activePath.path || '/preview');
    const { usertype } = useSelector(state => state.user.userInfo);
    const { userInfo } = useSelector((state) => state.user);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLiveUser, setIsLiveUser] = useState(false);
    const sideBarClick = (path) => {
        setIsActive(path);
        navigation(path);
    }
    const { selectedProject, selectedOrganization } = useSelector(
        (state) => state.orgDetails
      );
    const [open, setOpen] = React.useState(false);
    const [hoveredItem, setHoveredItem] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };
    const [totalUnreadMessage, setTotalUnreadMessage]= useState(0)
    
    useEffect(() => {
        socket.on("all-users-notified", async (data) => {
            if(selectedProject && userInfo && userInfo?.id && selectedProject?.id &&  data.projectId === selectedProject?.id &&  data.notifiedBy !== userInfo.id){
                let temp = {
                    projectId: selectedProject?.id,
                    type:"comments",
                  }
                    console.log("Location>>>>>>>>>>>>>>>>  1",location.pathname)
                    if(location.pathname === '/updates'){
                        await UsersNotificationApi.updateNotification(temp)
                     }
                    const fetchResponse = await UsersNotificationApi.fetchUsersNotification(temp); 
                    if(fetchResponse && fetchResponse.status){
                        const filteredNotifications = fetchResponse && fetchResponse.userNotifications.length > 0 &&  fetchResponse.userNotifications.filter(notification =>
                            notification.type === "comments" &&
                            !notification.notifiedUsers.includes(userInfo?.id)
                        );
                        setTotalUnreadMessage(filteredNotifications.length);
                    }
            }
        });
    }, [socket,selectedProject,userInfo,location]);


      useEffect(()=>{
        (async()=>{
            if(selectedProject && selectedProject?.id && userInfo && userInfo?.id ){
                let temp = {
                    projectId: selectedProject?.id,
                    type:"comments",
                  }
                  
                  if(location.pathname === '/updates'){
                     await UsersNotificationApi.updateNotification(temp)
                  }
                  const fetchResponse = await UsersNotificationApi.fetchUsersNotification(temp); 
                  if(fetchResponse && fetchResponse.status){
                    const filteredNotifications = fetchResponse && fetchResponse.userNotifications.length > 0 &&  fetchResponse.userNotifications.filter(notification =>
                        notification.type === "comments" &&
                        !notification.notifiedUsers.includes(userInfo?.id)
                    );
                    setTotalUnreadMessage(filteredNotifications.length);
                  }
            }
        })()
       },[selectedProject,userInfo,location])

    useEffect(() => {
        usertype === 'superadmin' ? setIsAdmin(true) : setIsAdmin(false);
    }, [usertype]);

    useEffect(() => {
        if(userInfo && userInfo.isLiveUser){
            setIsLiveUser(true);
        }
    }, [userInfo]);

    const handleMouseEnter = () => {
        setHoveredItem(false)
      };
    
      const handleMouseLeave = () => {
        setHoveredItem(true)
      };

    return (
        <>
            <div id="app-sidebar" style={{ backgroundColor: themeColors.tertiaryColor }} onMouseLeave={handleMouseLeave}  onMouseEnter={handleMouseEnter} >
                <div className="sidebar-header">
                    <div className="image-container">
                        <img src={Logo} alt="Comapny logo" className='' />
                    </div>
                </div>
                <div className='sideMenuContainer'>
                    <div className="side-tabs-container">

                        {
                            isAdmin ?
                                <>
                                    {adminlistItem && adminlistItem.length > 0 && adminlistItem.map((item, index) => {
                                        return (
                                            <>
                                                {<div key={index} className={`side-tab ${(isActive === item.path) ? "active-side-tab" : ""}`} onClick={item.subTabs ? handleClick : () => sideBarClick(item.path)}>
                                                    <div className='d-flex align-items-center'>
                                                        {item.icon === "rocket" ? <RocketLaunchOutlinedIcon style={{ fontSize: 24 }} /> : <i className={item.icon} style={{ fontSize: "24px" }}></i>}
                                                        <span className='tab-text'>{item.name}</span>
                                                        {item.subTabs ? open ? <ExpandLess /> : <ExpandMore /> : null}
                                                    </div>
                                                </div>}

                                                {isAdmin && item.subTabs && item.subTabs.length > 0 && <Collapse in={open} timeout="auto" unmountOnExit sx={{
                                                    height: 'auto',
                                                    width: '100%',
                                                    minWidth: '56px',
                                                    overflow: 'hidden',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '0 0 0 16px',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer'
                                                }}>
                                                    {item.subTabs.length > 0 && item.subTabs.map((elem, i) => {
                                                        return (
                                                            <div key={i} className={`side-tab ${(isActive === elem.path) ? "active-side-tab" : ""}`} onClick={() => sideBarClick(elem.path)}>
                                                                <div className='d-flex align-items-center'>
                                                                    <i className={elem.icon} style={{ fontSize: "24px" }}></i>
                                                                    <span className='tab-text'>{elem.name}</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </Collapse>}
                                            </>
                                        );
                                    })}
                                </>
                                :
                                <>
                                    {listItem && listItem.length > 0  && listItem.map((item, index) => (
                                       <div key={index} className={`side-tab ${(isActive === item.path) ? "active-side-tab" : ""}`} onClick={() => sideBarClick(item.path)}>
                                                <div className='d-flex align-items-center'>
                                                    {item.icon === "rocket" ? <RocketLaunchOutlinedIcon style={{ fontSize: 24 }} /> 
                                                    :                             (
                                                        item.icon === "ri-refresh-line" && hoveredItem &&  totalUnreadMessage ? 
                                                           <Badge color="secondary"  variant="dot" sx={{
                                                            '& .MuiBadge-dot': {
                                                            backgroundColor: '#f17132',
                                                            },
                                                          }} >
                                                                <i className={item.icon} style={{ fontSize: "24px" }}></i>
                                                            </Badge> :
                                                            <i className={item.icon} style={{ fontSize: "24px" }}></i>
                                                        )
                                                    }
                                                    {
                                                    item.icon === "ri-refresh-line" && totalUnreadMessage ? 
                                                      <Badge color="secondary" badgeContent={totalUnreadMessage} sx={{
                                                        '& .MuiBadge-badge': {
                                                          backgroundColor: '#f17132',
                                                          margin: "-3px",
                                                        },
                                                      }}>
                                                            <span className='tab-text'>{item.name}</span>
                                                      </Badge> :
                                                        <span className='tab-text'>{item.name}</span>
                                                    }
                                                </div>
                                        </div>
                                    ))}
                                </>
                        }
                    </div>
                    <div className="side-tabs-container">
                        <div style={{ minWidth: "62px", width: "100%" }}>
                            <div style={{
                                width: 'auto',
                                height: '0px',
                                border: '1px solid #E0E0E0',
                            }} />
                        </div>
                        {!isAdmin &&
                                otherItem
                                    .filter(item => isLiveUser ? item.name !== 'Backend Builder' : true) // Filter based on isLiveUser flag
                                    .map((item, index) => (
                                    item.tabMenu && (
                                        <div key={index} className={`side-tab ${(isActive === item.path) ? "active-side-tab" : ""}`} onClick={() => sideBarClick(item.path)}>
                                        <div className='d-flex align-items-center'>
                                            <i className={item.icon} style={{ fontSize: "24px" }}></i>
                                            <span className='tab-text'>{item.name}</span>
                                        </div>
                                        </div>
                                    )
                                    ))
                                }

                    </div>
                </div>
            </div>
            <Outlet />
        </>
    );
}

export default Sidebar;