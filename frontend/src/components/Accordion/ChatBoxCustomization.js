import { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Themes from "./Themes";
import Appearance from "./Apperance";
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import '../../App.css'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ToolTipHover from '../ToolTipHover';
import Button from '@mui/material/Button';
import PreviewButton from "./PreviewButton";
import { useDispatch, useSelector } from "react-redux";
import { updateProjectSettings } from '../../store/project/actions';
import './chatBoxCustomization.css'
import { makeStyles } from "@material-ui/core";
import themeIcon from '../../assets/images/themeIcon.png';
import appearanceIcon from '../../assets/images/appearanceIcon.png';
import gettingStartedIcon from '../../assets/images/gettingStartedIcon.png';
import preChatIcon from '../../assets/images/preChatIcon.png';
import { getOrgDetails } from "../../store/organization/actions";
import { showNotification } from "../../utils/notification";

const options = [
  {
    label: 'Email',
    value: "email"
  },
  {
    label: 'Name',
    value: "name"
  },
  {
    label: 'Phone Number',
    value: "number"
  },
];

const useStyles = makeStyles({
  root: {
    width: "50px",
    height: "24px",
    padding: "0px"
  },
  switchBase: {
    color: "#818181",
    padding: "1px",
    "&$checked": {
      "& + $track": {
        backgroundColor: "#F07227"
      }
    }
  },
  thumb: {
    color: "white",
    width: "20px",
    height: "20px",
    margin: "1px"
  },
  track: {
    borderRadius: "20px",
    backgroundColor: "#818181",
    opacity: "1 !important",
    "&:after, &:before": {
      color: "white",
      fontSize: "11px",
      position: "absolute",
      top: "6px"
    },
    "&:after": {
      content: "'On'",
      left: "8px"
    },
    "&:before": {
      content: "'Off'",
      right: "7px"
    }
  },
  checked: {
    color: "#23bf58 !important",
    transform: "translateX(26px) !important"
  }
});

const lightTheme = {
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
    text: "Type Your Message...",
  },
  chatButton: {
    bgColor: "#284FA3",
    color: "#000000",
  },
  chatHeader: {
    logo: false,
    image: "",
    bgColor: "#284FA3",
    textColor: "#FFFFFF",
    text: "ChatToAction",
    fontStyle: ""
  }
};

let defaultSurveySetting = {
  display: false,
  message: "Please introduce yourself:",
  surveyfields: ["email"],
}

export const pickTextColorBasedOnBgColorSimple = (bgColor) => {
  if ((bgColor && bgColor.length === 0) || !bgColor) return "#000000"
  var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
    '#000000' : '#FFFFFF';
}

export default function ChatBoxCustomization() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { selectedProject, selectedOrganization, invites } = useSelector((state) => state.orgDetails);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [responsiveClass, setResponsiveClass] = useState('');
  const [changesMade, setChangesMade] = useState(false);

  const [orgThemeSetting, setOrgThemeSetting] = useState(lightTheme);
  const [selectedFile, setSelectedFile] = useState(null);
  const [prechatSurveySetting, setPrechatSurveySetting] = useState(defaultSurveySetting);

  const [isSavingThemeSettings, setIsSavingThemeSettings] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handelChatSurvey = (event) => {
    setPrechatSurveySetting({ ...prechatSurveySetting, display: !prechatSurveySetting.display });
  };

  const handleSaveSettings = async () => {
    setIsSavingThemeSettings(true);
    try {
      let data = new FormData();
      data.append('projectid', selectedProject.id)
      data.append('projectsettings', JSON.stringify({
        themesettings: orgThemeSetting,
        surveysettings: prechatSurveySetting
      }))
      if (selectedFile && selectedFile.name) data.append('file', selectedFile, selectedFile.name);

      dispatch(updateProjectSettings(data));
      dispatch(getOrgDetails())
      setIsSavingThemeSettings(false);
    } catch (err) {
      setIsSavingThemeSettings(false);
    }
  }

  const handleCancelSettings = () => {
    setPrechatSurveySetting(selectedProject?.surveysettings || defaultSurveySetting);
    setOrgThemeSetting(selectedProject?.themesettings || lightTheme);
  }

  const handleChangeSurveyFields = (value) => {
    let tempArr = [...prechatSurveySetting.surveyfields];
    const index = tempArr.indexOf(value);

    if (index === -1) {
      // Value not found, add it to the array
      tempArr.push(value);
    } else {
      // Value found, remove it from the array
      tempArr.splice(index, 1);
    }
    setPrechatSurveySetting({ ...prechatSurveySetting, surveyfields: tempArr })
  };

  useEffect(() => {
    setOrgThemeSetting(selectedProject.themesettings || lightTheme);
    setPrechatSurveySetting(selectedProject.surveysettings || defaultSurveySetting);
  }, [selectedProject])

  useEffect(() => {
    if ((JSON.stringify(selectedProject?.themesettings) !== JSON.stringify(orgThemeSetting)) || (JSON.stringify(selectedProject?.surveysettings) !== JSON.stringify(prechatSurveySetting))) setChangesMade(true)
    else setChangesMade(false);
  }, [orgThemeSetting, prechatSurveySetting, selectedProject])


  //checking screen Width
  useEffect(() => {
    const checkScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    }

    window.addEventListener('resize', checkScreenWidth);

    checkScreenWidth()
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
      if (screenWidth < 680) setResponsiveClass('flex-column justify-content-center align-items-center');
      else setResponsiveClass('');
    }
  }, [screenWidth]);

  const checkForUser = () => {
    let userType = "owner"
    if (invites && invites.length > 0) {
      let invitedOrg = invites.find(item => item.invitedOrgId === selectedOrganization.id)
      if (invitedOrg) {
        if (invitedOrg.assignedRole === "admin") userType = "admin"
        else userType = "user"
      }
    }
    return userType;
  }

  const refuseActionNotifty = () => {
    showNotification("error", "You are not allowed to perform this action")
  }

  return (
    <div className={`d-flex shadow ${responsiveClass}`} style={{ backgroundColor: 'white', borderRadius: '8px' }}>
      <div className="" style={{ borderRadius: "8px 0 0 8px", width: "60%" }}>
        <Accordion style={{ borderTopLeftRadius: "8px" }} expanded={expanded === 'themePanel'} onChange={handleChange('themePanel')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            style={{ height: "60px", borderBottom: "1px solid lightgrey" }}
          >
            <img style={{ height: "25px", margin: "auto 10px" }} src={themeIcon} alt="theme" />
            <Typography style={{ color: "#000", fontSize: "20px", fontWeight: "600" }}>Themes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Themes orgThemeSetting={orgThemeSetting} setOrgThemeSetting={setOrgThemeSetting} mySavedTheme={selectedProject?.themesettings} />
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'appearancePanel'} onChange={handleChange('appearancePanel')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            style={{ height: "60px", borderBottom: "1px solid lightgrey" }}
          >
            <img style={{ height: "25px", margin: "auto 10px" }} src={appearanceIcon} alt="Appearance" />
            <Typography style={{ color: "#000", fontSize: "20px", fontWeight: "600" }}>Appearance</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Appearance
              setOrgThemeSetting={setOrgThemeSetting}
              orgThemeSetting={orgThemeSetting}
              lightTheme={lightTheme}
              setSelectedFile={setSelectedFile}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'gettingStartedPanel'} onChange={handleChange('gettingStartedPanel')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            style={{ height: "60px", borderBottom: "1px solid lightgrey" }}
          >
            <img style={{ height: "25px", margin: "auto 10px" }} src={gettingStartedIcon} alt="Getting Started" />
            <Typography style={{ color: "#000", fontSize: "20px", fontWeight: "600" }}>Getting Started</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <p>Coming Soon</p>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'preChatPanel'} onChange={handleChange('preChatPanel')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            style={{ height: "60px", borderBottom: "1px solid lightgrey" }}
          >
            <img style={{ height: "25px", margin: "auto 10px" }} src={preChatIcon} alt="Pre Chat survey" />
            <Typography style={{ color: "#000", fontSize: "20px", fontWeight: "600" }}>Pre Chat Survey</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="container row">
              <div className="col p-3">
                <div className="row mb-3">
                  <div className="col-md-4 border-right">
                    <h6>Display:</h6>
                  </div>
                  <div className="col-md-8">
                    <Switch
                      classes={{
                        root: classes.root,
                        switchBase: classes.switchBase,
                        thumb: classes.thumb,
                        track: classes.track,
                        checked: classes.checked
                      }}
                      checked={prechatSurveySetting.display}
                      onChange={handelChatSurvey}
                      name="checkedA"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                    <ToolTipHover text="Ask your visitor for their name, email, or phone before the conversation starts. The visitor will see this field when they send their first message on your chat. The survey will be mandatory for them.">
                      <HelpOutlineIcon />
                    </ToolTipHover>
                  </div>
                </div>
                <div className="row">
                  <div className="row-md-4 border-right">
                    <h6>Survey Fields:</h6>
                  </div>
                  <div className="row-md-8">
                    <Box
                      className="d-flex align-items-center"
                      component="form"
                      style={{ background: "transparent", padding: "5px", margin: "10px 0", width: "100%", height: "77px", border: "1px solid #E0E0E0", borderRadius: '5px' }}
                    >
                      {options && options.length > 0 && options.map((item, i) => (
                        <div
                          key={i}
                          className="d-flex justify-content-center align-items-center"
                          style={{
                            padding: '10px 20px',
                            width: '84px',
                            height: '37px',
                            background: '#F3F7FF',
                            border: `1px solid ${(prechatSurveySetting.surveyfields.indexOf(item.value) !== -1) ? '#F07227' : "#ABABAB"}`,
                            borderRadius: '5px',
                            margin: "5px"
                          }}
                          onClick={() => handleChangeSurveyFields(item.value)}
                        >{item.value}</div>
                      ))}
                    </Box>
                  </div>
                </div>
              </div>
              <div className="col p-3">
                <div className="row-md-4 border-right">
                  <h6>Message:</h6>
                </div>
                <div className="row-md-8">
                  <Box
                    component="form"
                    sx={{
                      '& > :not(style)': { width: '100%', maxWidth: "35ch" },
                    }}
                    noValidate
                    autoComplete="off"
                    style={{ background: "transparent", padding: "10px 0" }}
                  >
                    <TextField onChange={(e) => setPrechatSurveySetting({ ...prechatSurveySetting, message: e.target.value })} id="outlined-basic" defaultValue='Please introduce yourself:' className='padd-0' variant="outlined" />
                  </Box>
                </div>

              </div>
            </div>
          </AccordionDetails>
        </Accordion>

        <div className="savePreviewSettingsDiv p-3 mt-3">
          <Button disabled={!changesMade} variant="contained" onClick={handleCancelSettings} className="cancelPreviewSettingsBtn text-capitalize" style={{ backgroundColor: "#F5F5F5" }}>
            <span>Cancel</span>
          </Button>
          <Button disabled={!changesMade} variant="contained" onClick={checkForUser() === "user" ? refuseActionNotifty : handleSaveSettings} className="savePreviewSettingsBtn text-capitalize" style={{ backgroundColor: "#F07227", marginLeft: "20px" }}>
            {isSavingThemeSettings ? <CircularProgress size={'1.5rem'} /> : <span>Save</span>}
          </Button>
        </div>
      </div>

      <div className="d-flex align-items-start chatBoxPreviewContainer" style={{ width: "40%" }}>
        <div className="w-100 d-flex flex-column" style={{ borderRadius: "0 8px 8px 0", position: "sticky", top: 0 }}>
          <div className="w-100 d-flex align-items-center p-3" style={{ backgroundColor: "white", height: "60px", borderRadius: "0 8px 0 0" }}>
            <h5 style={{ color: "#000" }}>Preview:</h5>
          </div>
          <PreviewButton orgThemeSetting={orgThemeSetting} prechatSurveySetting={prechatSurveySetting} selectedFile={selectedFile} />
        </div>
      </div>
    </div>
  );
}
