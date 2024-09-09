import React, { useState, useRef } from 'react';
import './flowchart.css'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import {
    TransformWrapper,
    TransformComponent,
} from "react-zoom-pan-pinch";
import { ButtonGroup } from '@mui/material';

// import customer_confirmation_flowchart_transparent from '../../assets/images/customer_confirmation_flowchart_transparent.png';
// import feedback_flowchart_transparent from '../../assets/images/feedback_flowchart_transparent.png';
// import flowchart_job_posting from '../../assets/images/flowchart_job_posting.png';
// import flowchart_profile_setup from '../../assets/images/flowchart_profile_setup.png';
// import forgot_password_flowchart_transparent from '../../assets/images/forgot_password_flowchart_transparent.png';
// import login_flowchart_transparent from '../../assets/images/login_flowchart_transparent.png';
// import reset_password_flowchart_transparent from '../../assets/images/reset_password_flowchart_transparent.png';
// import save_card from '../../assets/images/save_card.png';
// import subscription_purchase_flowchart_transparent from '../../assets/images/subscription_purchase_flowchart_transparent.png';
// import technician_profile_settings_flowchart_transparent from '../../assets/images/technician_profile_settings_flowchart_transparent.png';
// import technician_register_flowchart_transparent from '../../assets/images/technician_register_flowchart_transparent.png';

import customer_confirmation from '../../assets/svgs/customer_confirmation.svg';
import feedback_flowchart_transparent from '../../assets/svgs/feedback_flowchart_transparent.svg';
import forgot_password_flowchart_transparent from '../../assets/svgs/forgot_password_flowchart_transparent.svg';
import job_posting from '../../assets/svgs/job_posting.svg';
import profile_setup from '../../assets/svgs/profile_setup.svg';
import reset_password_flowchart from '../../assets/svgs/reset_password_flowchart.svg';
import save_card from '../../assets/svgs/save_card.svg';
import subscription_purchase from '../../assets/svgs/subscription_purchase.svg';
import technical_profile_setting_flowchart_transparent from '../../assets/svgs/technical_profile_setting_flowchart_transparent.svg';
import technician_register from '../../assets/svgs/technician_register.svg';
import user_login_flowchart_transparent from '../../assets/svgs/user_login_flowchart_transparent.svg';

const Controls = ({ zoomIn, zoomOut, resetTransform }) => (
    <div style={{ position: "absolute", bottom: 0, margin: "10px" }}>
        <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={() => zoomIn()} ><AddIcon /></Button>
            <Button onClick={() => zoomOut()} ><RemoveIcon /></Button>
            <Button onClick={() => resetTransform()}><CloseIcon /></Button>
        </ButtonGroup>
    </div>
);

function FlowChart() {
    const [previewImage, setPreviewImage] = useState({ isOpen: false, img: null });

    const imageArray = [
        {
            name: "Customer Confirmation",
            img: customer_confirmation
        },
        {
            name: "Feedback",
            img: feedback_flowchart_transparent
        },
        {
            name: "Forgot Password",
            img: forgot_password_flowchart_transparent
        },
        {
            name: "Job Posting",
            img: job_posting
        },
        {
            name: "Profile Setup",
            img: profile_setup
        },
        {
            name: "Reset Password",
            img: reset_password_flowchart
        },
        {
            name: "Save Card",
            img: save_card
        },
        {
            name: "Subscription Purchase",
            img: subscription_purchase
        },
        {
            name: "Technician Profile Settings",
            img: technical_profile_setting_flowchart_transparent
        },
        {
            name: "Technician Register",
            img: technician_register
        },
        {
            name: "Login",
            img: user_login_flowchart_transparent
        },
    ]

    const handleClickImage = (image) => {
        setPreviewImage({ isOpen: true, img: image })
    }

    const transformComponentRef = useRef(null);

    const zoomToImage = () => {
        if (transformComponentRef.current) {
            const { zoomToElement } = transformComponentRef.current;
            zoomToElement("imgExample");
        }
    };

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", maxHeight: "calc(100vh - 105px)" }}>
            <div style={{ padding: "30px", width: "100%", height: "100%", maxHeight: "100%", display: "flex" }}>
                <div className='flowPreviewDiv' style={{ width: previewImage.isOpen ? "35%" : "100%", overflowY: "auto" }}>
                    {imageArray && imageArray.length > 0 && imageArray.map(item => <Button className='text-capitalize' variant="outlined" style={{
                        color: "#F07227",
                        border: "1px solid #F07227",
                        padding: "8px",
                        cursor: "pointer",
                        margin: "10px"
                    }}
                        sx={{
                            ":hover": {
                                bgcolor: "#FCE9E9",
                            }
                        }} onClick={() => handleClickImage(item.img)}>{item.name}</Button>)}
                </div>
                {(previewImage && previewImage.isOpen) && <div className='flowChartwDiv' style={{ width: previewImage.isOpen ? "75%" : "100%", position: "relative" }}>
                    <CloseIcon style={{ position: "absolute", top: 0, right: 0, margin: "5px", cursor: "pointer" }} onClick={() => setPreviewImage({ isOpen: false, img: null })} />

                    <TransformWrapper
                        ref={transformComponentRef}
                    >
                        {(utils) => (
                            <React.Fragment>
                                <Controls {...utils} />
                                <TransformComponent
                                    wrapperStyle={{ height: "100%", width: "100%" }}
                                    contentStyle={{ height: "100%", width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "10px" }}
                                    >
                                    <img src={previewImage.img} alt="flow chart" style={{ maxHeight: "100%", maxWidth: "100%", padding: "10px", cursor: "pointer", margin: "15px" }} />
                                </TransformComponent>
                            </React.Fragment>
                        )}
                    </TransformWrapper>
                </div>}
            </div>
        </div>
    )
}

export default FlowChart;