import React, { useState } from 'react';
import * as OrgApi from '../../../api/org.api';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useSelector } from "react-redux";

const darkTheme = {
    themeName: "darkTheme",
    chatBackground: {
        bgColor: '#202124',
    },
    aiChatStrip: {
        bgColor: "#3c4042",
        iconBg: "#284fa3",
    },
    myChatStrip: {
        bgColor: "#202124",
    },
    form: {
    },
    chatButton: {
        bgColor: "#284FA3",
        color: "#000000",
    },
    chatHeader: {
        bgColor: "#284FA3",
        textColor: "#FFFFFF",
    }
}

const lightTheme = {
    themeName: "lighTheme",
    chatBackground: {
        bgColor: "#f5f5f5",
    },
    aiChatStrip: {
        bgColor: "#ffffff",
        iconBg: "#284fa3",
    },
    myChatStrip: {
        bgColor: "#f5f5f5",
    },
    form: {
    },
    chatButton: {
        bgColor: "#284FA3",
        color: "#000000",
    },
    chatHeader: {
        bgColor: "#284FA3",
        textColor: "#FFFFFF",
    }
}

function Themes({ orgThemeSetting, setOrgThemeSetting, mySavedTheme }) {
    const [selectedTheme, setSelectedTheme] = useState("myTheme")

    const handleChangeTheme = (theme) => {
        if (theme === "darkTheme" || theme === "lighTheme") {
            let tempSettings = {};
            Object.keys(orgThemeSetting).forEach(key => {
                if (theme === "lighTheme") tempSettings[key] = { ...orgThemeSetting[key], ...lightTheme[key] }
                if (theme === "darkTheme") tempSettings[key] = { ...orgThemeSetting[key], ...darkTheme[key] }
            });
            setOrgThemeSetting(tempSettings);
        } 
        else setOrgThemeSetting(mySavedTheme ? mySavedTheme : lightTheme);
        setSelectedTheme(theme);
    }

    return (
        <div className='appearance_box'>
            <div className='themes_container'>
                <div className='d-flex p-2'>
                    <Stack spacing={2} direction="row">
                        <Button className='text-capitalize' variant="contained" style={{ opacity: `${selectedTheme === "myTheme" ? "" : "0.7"}`, backgroundColor: "#284FA3" }} onClick={() => handleChangeTheme("myTheme")}>My Theme</Button>
                        <Button className='text-capitalize' variant="outlined" style={{ border: `${selectedTheme === "lighTheme" ? "2px solid #757ae1" : "1px solid #1976d280"}`, opacity: `${selectedTheme === "lighTheme" ? "" : "0.7"}`, backgroundColor: "#F3F7FF" }} onClick={() => handleChangeTheme("lighTheme")}>Light</Button>
                        <Button className='text-capitalize' variant="contained" style={{ backgroundColor: `${selectedTheme === "darkTheme" ? "#1F1F1F" : "#5a5a6a"}`, opacity: `${selectedTheme === "darkTheme" ? "" : "0.7"}`, backgroundColor: "#ABABAB" }} onClick={() => handleChangeTheme("darkTheme")}>Dark</Button>
                    </Stack>
                </div>
            </div>
        </div>
    )
}

export default Themes;