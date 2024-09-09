import React from 'react';
import PropTypes from 'prop-types';
import { Box, AppBar, Tabs, Tab, Tooltip, IconButton } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import AceEditor from 'react-ace';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import CopyToClipboard from 'react-copy-to-clipboard';

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
                <Box sx={{ p: 3, height: "100%" }}>
                    {children}
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

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const ShowCode = ({
  subValue,
  handleChangeSubValue,
  handleChangeSubIndex,
  theme,
  codeView,
  selectedAPINode,
  handleCopy,
  handleUpdateCode,
  handleUpdateCodeFullApi,
  handleTestCode,
  updateQueryText,
  setUpdateQueryText,
  handleEnterModification,
  handleOnSendUpdateQuery,
  stepCodeEditorRef,
  fullCodeEditorRef,
  setSelectedAPINode
}) => (
  <Box
  sx={{
    bgcolor: "background.paper",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  }}
>
  <AppBar position="static">
    <Tabs
      value={subValue}
      onChange={handleChangeSubValue}
      indicatorColor="secondary"
      textColor="inherit"
      variant="fullWidth"
      aria-label="full width tabs example"
    >
      <Tab label="Step Logic" {...a11yProps(0)} />
      <Tab label="Step Code" {...a11yProps(1)} />
      <Tab label="Full File Code" {...a11yProps(2)} />
    </Tabs>
  </AppBar>
  <SwipeableViews
    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
    index={subValue}
    onChangeIndex={handleChangeSubIndex}
    style={{
      height: "100%",
      flexGrow: "1",
    }}
    containerStyle={{
      height: "100%",
    }}
  >
    <TabPanel
      style={{
        height: "100%",
      }}
      value={subValue}
      index={0}
      dir={theme.direction}
    >
      <p>
        {codeView?.codeDocumentation ? codeView?.codeDocumentation : codeView?.stepDescription}
      </p>
    </TabPanel>
    <TabPanel
      style={{
        height: "100%",
      }}
      value={subValue}
      index={1}
      dir={theme.direction}
    >
      <div style={{ width: "100%", minWidth: "400px", height: "100%", backgroundColor: "white" }} className='shadow' id="moreDetailsDivThree">
        <div style={{ height: "40px", width: "100%", backgroundColor: "whitesmoke", display: "flex", justifyContent: "flex-end", paddingLeft: "10px" }}>
          <div className='d-flex'>
            <CopyToClipboard text={codeView.code} onCopy={handleCopy}>
              <Tooltip title="Copy To Clipboard">
                <IconButton>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </CopyToClipboard>
            <Tooltip title="Save Changes">
              <IconButton onClick={handleUpdateCode}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <AceEditor
          ref={stepCodeEditorRef}
          placeholder="Placeholder Text"
          mode="javascript"
          theme="monokai"
          name="blah2"
          fontSize={14}
          lineHeight={19}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          value={codeView.code}
          style={{
            width: "100%",
            height: "calc(100% - 90px)",
          }}
          setOptions={{
            useWorker: false,
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
        <div style={{ height: "50px", backgroundColor: "white", display: "flex" }}>
          <div className="chatFormContainer">
            <textarea
              className="chatFormInput"
              id="chatFormInputTextArea"
              type={"text"}
              rows={1}
              placeholder="Make changes at the Step level"
              value={updateQueryText}
              onChange={(e) => setUpdateQueryText(e.target.value)}
              onKeyDown={handleEnterModification}
            />
            <IconButton
              style={{
                backgroundColor: "#FCF0E9",
                cursor: "default",
                margin: "9px",
                width: "46px",
                height: "46px",
              }}
              onClick={handleOnSendUpdateQuery}
            >
              <i
                className={"chatFormSendIcon ri-send-plane-fill"}
              ></i>
            </IconButton>
          </div>
        </div>
      </div>
    </TabPanel>
    <TabPanel
      style={{
        height: "100%",
      }}
      value={subValue}
      index={2}
      dir={theme.direction}
    >
      <div style={{ width: "100%", minWidth: "400px", height: "100%", backgroundColor: "white" }} className='shadow' id="moreDetailsDivThree">
        <div style={{ height: "40px", width: "100%", backgroundColor: "whitesmoke", display: "flex", justifyContent: "flex-end", paddingLeft: "10px" }}>
          <div className='d-flex'>
            <CopyToClipboard text={selectedAPINode?.api_code} onCopy={handleCopy}>
              <Tooltip title="Copy To Clipboard">
                <IconButton>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </CopyToClipboard>
            <Tooltip title="Test API">
              <IconButton onClick={handleTestCode}>
                <PlayCircleFilledWhiteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save Changes">
              <IconButton onClick={handleUpdateCodeFullApi}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Test API">
              <IconButton onClick={() => console.log("ffffffffffffffffffff ffgas")}>
                <PlayCircleFilledWhiteIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <AceEditor
          ref={fullCodeEditorRef}
          placeholder="Placeholder Text"
          mode="javascript"
          theme="monokai"
          name="blah2"
          onChange={(value) => setSelectedAPINode({ ...selectedAPINode, api_code: value })}
          fontSize={14}
          lineHeight={19}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          value={selectedAPINode?.api_code}
          style={{
            width: "100%",
            height: "calc(100% - 40px)",
          }}
          setOptions={{
            useWorker: false,
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      </div>
    </TabPanel>
  </SwipeableViews>
</Box>
);

export default ShowCode;
