import { useState, useEffect } from 'react';
import './deployment.css'
import { EMBED_DOMAIN } from '../../constants';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { Snackbar } from '@mui/material';
import wordpress from '../../assets/images/wordpress.png'
import javascript from '../../assets/images/javascript.png'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const Deployment = () => {
    const orgDetails = useSelector((state) => state.orgDetails);

    const [projectToken, setProjectToken] = useState("")
    const [copiedText, setCopiedText] = useState(false);
    const [activeInstallationtype, setActiveInstallationtype] = useState("js");

    useEffect(() => {
        setProjectToken(orgDetails?.selectedProject?.projecttoken)
    }, [orgDetails])


    let code = `<script src="${EMBED_DOMAIN}/index.js" projectToken="${projectToken}"></script>`

    const handleCopy = () => {
        setCopiedText(true)
        setTimeout(() => setCopiedText(false), 2000);
    }

    const JsInstallation = () => {
        return (
            <>
                <div className='scriptContainer'>
                    <span className='scriptLabel'>Copy Snippet</span>
                    <CopyToClipboard text={code} onCopy={handleCopy}>
                        <div className='scriptBox'>
                            <span>
                                {code}
                            </span>
                        </div>
                    </CopyToClipboard>
                </div>
                <CopyToClipboard text={code} onCopy={handleCopy}>
                    <div className='scriptCopyBtn' onClick={handleCopy}>
                        <i className="ri-file-copy-line"></i>
                        <span>COPY TO CLIPBOARD</span>
                    </div>
                </CopyToClipboard>
            </>
        )
    }

    const WordPressInstallation = () => {
        return (
            <>
                <div style={{ width: "100%", height: "250px" }} className="d-flex justify-content-center align-items-center">
                    <p>Coming soon</p>
                </div>
            </>
        )
    }

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={copiedText}
                onClose={() => setCopiedText(false)}
                message="Coped!"
                key={"top-right"}
            />
            <div className="deploymentPage">
                <div className='deploymentBox'>
                    <span className='deploymentBoxHeading'>Installation Software</span>
                    <div className='installationTypeDiv'>
                        <div
                            className={`installationType ${activeInstallationtype === "js" ? "activeInstallationType" : ""}`}
                            onClick={() => setActiveInstallationtype("js")}
                        >
                            <img src={javascript} alt="javascript" /><span>JavaScript</span>
                        </div>
                        <div
                            className={`installationType ${activeInstallationtype === "wordpress" ? "activeInstallationType" : ""}`}
                            onClick={() => setActiveInstallationtype("wordpress")}
                        >
                            <img src={wordpress} alt="wordpress" /><span>WordPress</span>
                        </div>
                    </div>
                    {(activeInstallationtype === "js") && <JsInstallation />}
                    {(activeInstallationtype === "wordpress") && <WordPressInstallation />}
                </div>
            </div>
        </>
    );
}

export default Deployment;