import React, { useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import './index.css'

function ChatSurvey({ prechatSurveySetting }) {

    const [showEmailInput, setShowEmailInput] = useState(false);
    const [showNameInput, setShowNameInput] = useState(false);
    const [showPhoneInput, setShowPhoneInput] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { surveyfields } = prechatSurveySetting;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {
        const hasEmail = prechatSurveySetting.surveyfields.includes('email') && prechatSurveySetting.surveyfields.some(item => item !== '');
        setShowEmailInput(hasEmail);

        const hasName = prechatSurveySetting.surveyfields.includes('name') && prechatSurveySetting.surveyfields.some(item => item !== '');
        setShowNameInput(hasName);

        const phoneNumber = prechatSurveySetting.surveyfields.includes('number') && prechatSurveySetting.surveyfields.some(item => item !== '');
        setShowPhoneInput(phoneNumber);
    }, [surveyfields]);


    const handleSubmit = async (event) => {
        event.preventDefault();
    };


    return (
        <>
            <div className="d-flex justify-content-center previewPreChatSurvey">
                <div className="previewPreChatFormBox">
                    <div className='d-flex justify-content-end p-2'>
                        <CloseIcon style={{ cursor: 'pointer' }} onClick={() => {}} />
                    </div>
                    <div className="d-flex flex-column align-items-center previewPreChatForm" style={{ paddingBottom: "40px" }}>
                        <AccountCircleIcon className='previewPreChatUserIcon d-flex justify-content-center' style={{ margin: '0 0 15px 0' }} />
                        <h4 className="w-auto">{prechatSurveySetting.message}</h4>
                        <div className="mt-3 d-flex justify-content-center">
                            {showEmailInput && (
                                <TextField
                                    id="emailid"
                                    label="Email"
                                    placeholder="Enter your email"
                                    name="emailid"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    style={{width: "235px"}}
                                    required
                                    />
                                    )}
                        </div>
                        <div className="mt-3 d-flex justify-content-center">
                            {showNameInput && (
                                <TextField
                                id="name"
                                    label="Name"
                                    placeholder="Your name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    style={{width: "235px"}}
                                    required
                                    />
                                    )}
                        </div>
                        <div className="mt-3 d-flex justify-content-center">
                            {showPhoneInput && (
                                <TextField
                                    id="phonenumber"
                                    label="Phone number"
                                    placeholder="Phone number"
                                    name="phonenumber"
                                    type="tel"
                                    inputMode="numeric"
                                    value={formData.phoneNumber}
                                    style={{width: "235px"}}
                                    onChange={handleInputChange}
                                    />
                                    )}
                        </div>
                        <div className="mt-3 d-flex justify-content-center">
                            <Button
                                className='text-capitalize'
                                size="large"
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting}
                                onClick={handleSubmit}
                                style={{ backgroundColor: "#00d4d5", width: "235px" }}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default ChatSurvey;