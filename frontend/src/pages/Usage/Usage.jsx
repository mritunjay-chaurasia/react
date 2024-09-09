import React, { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import "./usage.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"

import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function UsageWithLabel(props) {
    const percentage = (props.value / props.limit) * 100;
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={percentage} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">
                    {`${Math.round(props.value)}/${props.limit}`}
                </Typography>
            </Box>
        </Box>
    );
}

UsageWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};

function Usage() {
    const { userInfo } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { planDetails } = useSelector(state => state.subscription);
    const { selectedProject, selectedOrganization, organizations } = useSelector(state => state.orgDetails);

    const [projects, setProjects] = useState(0);
    // const [planInfo, setPlanInfo] = useState();

    useEffect(() => {
        if (organizations) {
            let allProjects = 0
            organizations.forEach(org => {
                allProjects += org.allProjects.length
            });
            setProjects(allProjects)
        }
    }, [organizations]);
    
    return (
        <div className="usagePage">
            <div className="usageHeader">
                {planDetails && planDetails.planName !== "Premium" && <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <span style={{fontSize: "16px", marginBottom: "8px"}}>Current Plan - {planDetails.planName}</span>
                        <Button
                            className="text-capitalize"
                            variant="outlined"
                            style={{
                                color: "#F07227",
                                border: "1px solid #F07227",
                                
                            }}
                            sx={{
                                ":hover": {
                                    bgcolor: "#FCE9E9",
                                },
                            }}
                            onClick={() => navigate("/subscription")}
                        >
                            Upgrade Plan
                        </Button>
                    </div>
                </div>}
                {planDetails && <span>Usage</span>}
                {planDetails && <span style={{ fontSize: "20px", marginTop: "10px" }}>({new Date(planDetails.date.from).toLocaleDateString()} <b>-</b> {new Date(planDetails.date.to).toLocaleDateString()})</span>}
            </div>
            {planDetails && <div className="usageBoxContainer">
                <div className="usageBox">
                    <h4>Chats</h4>
                    <Box sx={{ width: '100%' }}>
                        <UsageWithLabel value={planDetails.used.chat} limit={planDetails.limits.chat} />
                    </Box>
                </div>

                <div className="usageBox">
                    <h4>Tasks</h4>
                    <Box sx={{ width: '100%' }}>
                        <UsageWithLabel value={planDetails.used.task} limit={planDetails.limits.task} />
                    </Box>
                </div>

                <div className="usageBox">
                    <h4>Organization</h4>
                    <Box sx={{ width: '100%' }}>
                        <UsageWithLabel value={organizations.length} limit={planDetails.limits.org} />
                    </Box>
                </div>

                <div className="usageBox">
                    <h4>Projects</h4>
                    <Box sx={{ width: '100%' }}>
                        <UsageWithLabel value={projects} limit={planDetails.limits.projectsPerOrg} />
                    </Box>
                </div>
            </div>}
        </div>
    );
}

export default Usage;