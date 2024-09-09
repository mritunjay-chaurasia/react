import React, { useState } from "react";
import ColorPicker from "../../ColorPicker";
import "../../../App.css";
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';

function Appearance({ orgThemeSetting, setOrgThemeSetting, lightTheme, setSelectedFile }) {

  const [activeSettingBtn, setActiveSettingBtn] = useState(Object.keys(orgThemeSetting)[0]);
  const [activeSubSettingBtn, setActiveSubSettingBtn] = useState(Object.keys(orgThemeSetting[activeSettingBtn])[0]);

  const fontStyles = [
    'Serif',
    'Sans-serif	',
    'Monospace',
    'Roboto',
    "Courier New",
  ]

  const handleChangeValue = (btnValue) => {
    let tempObj = {
      ...orgThemeSetting,
      [activeSettingBtn]: {
        ...orgThemeSetting[activeSettingBtn],
        [activeSubSettingBtn]: btnValue,
      },
    };
    setOrgThemeSetting(tempObj);
  };

  const handleChangeActiveBtn = (btnValue) => {
    setActiveSettingBtn(btnValue);
    setActiveSubSettingBtn(Object.keys(lightTheme[btnValue])[0]);
  }
  const handleChangeText = (e) => {
    let tempObj = { ...orgThemeSetting };
    tempObj[activeSettingBtn] = { ...tempObj[activeSettingBtn] };
    tempObj[activeSettingBtn][activeSubSettingBtn] = e.target.value;
    setOrgThemeSetting(tempObj);
  };

  const handleChangeSubActiveBtn = (btnValue) => {
    setActiveSubSettingBtn(btnValue);
  }

  const handleChangeImage = (e) => {
    let tempObj = { ...orgThemeSetting };
    setSelectedFile(e.target.files[0]);
    setOrgThemeSetting(tempObj);
  }

  return (
    <div className="container">
      <div className="row">
        <div className="w-100 d-flex flex-wrap p-2">
          {Object.keys(lightTheme).map((item, i) => (
            <Button
              key={i}
              variant="outlined"
              className="col-12 w-auto m-1 text-capitalize"
              style={{
                backgroundColor: `${activeSettingBtn === item ? "#F3F7FF" : 'white'}`,
                color: `${activeSettingBtn === item ? "#253F7D" : "#636A7A"}`,
                border: `1px solid ${activeSettingBtn === item ? "#F07227" : "#ABABAB"}`,
                fontWeight: "bold"
              }}
              onClick={() => handleChangeActiveBtn(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      <div className="row">
        <div className="d-flex flex-column p-3" style={{ background: "#F8E4D9", borderRadius: "5px 0px 0px 5px", width: "40%" }}>
          {Object.keys(lightTheme[activeSettingBtn]).map((item, i) => (
            item !== "gradient" && <Button
              key={i} variant="outlined"
              className="col-12 w-auto m-1 text-capitalize"
              style={{
                backgroundColor: `${activeSubSettingBtn === item ? "#F3F7FF" : 'white'}`,
                color: `${activeSubSettingBtn === item ? "#253F7D" : "#636A7A"}`,
                border: `1px solid ${activeSubSettingBtn === item ? "#F07227" : "#ABABAB"}`,
                fontWeight: "bold"
              }}
              onClick={() => handleChangeSubActiveBtn(item)}
            >
              {item}
            </Button>
          ))}
        </div>

        <div className="col-6 color-picker-outer d-flex flex-column justify-content-center align-items-center p-3" style={{ background: "#FCF0E9", width: "60%", minHeight: "300px" }}>
          {
            activeSubSettingBtn.toLocaleLowerCase() === "text" ?
              <input value={orgThemeSetting?.[activeSettingBtn]?.[activeSubSettingBtn]} onChange={handleChangeText} />
              :
              activeSubSettingBtn.toLocaleLowerCase() === "image" ?
                <input style={{ width: "100%" }} type="file" accept=".png" onChange={handleChangeImage} />
                :
                activeSubSettingBtn.toLocaleLowerCase() === "logo" ?
                  <Switch checked={orgThemeSetting?.[activeSettingBtn]?.[activeSubSettingBtn]} onChange={(e, c) => handleChangeValue(c)} />
                  :
                  activeSubSettingBtn.toLocaleLowerCase() === "fontstyle" ?
                    <div style={{ border: "1px solid lightgrey", width: "100%", height: "auto", borderRadius: 5 }}>
                      {fontStyles && fontStyles.length > 0 && fontStyles.map((style, i) => <Button
                        key={i}
                        className="m-1 text-capitalize"
                        variant={orgThemeSetting?.[activeSettingBtn]?.[activeSubSettingBtn] === style ? 'contained' : 'outlined'}
                        onClick={() => handleChangeValue(style)}
                      >{style}
                      </Button>)}
                    </div>
                    :
                    <div className="d-flex flex-column" style={{
                      width: '100%',
                      height: '100%',
                      background: '#FFFFFF',
                      borderRadius: '5px',
                      padding: "15px"
                    }}>
                      <div style={{ marginBottom: "20px" }}>
                        <span style={{ color: "#636A7A", fontSize: "15px", marginRight: "20px" }}>COLOR CODE</span>
                        <input style={{ height: "37px", width: "114px", border: "1px solid #636A7A", borderRadius: "5px", padding: "15px" }} type={'text'} value={orgThemeSetting?.[activeSettingBtn]?.[activeSubSettingBtn]} onChange={(e) => handleChangeValue(e.target.value)} />
                      </div>
                      <ColorPicker
                        toggleFor={activeSettingBtn}
                        color={orgThemeSetting?.[activeSettingBtn]?.[activeSubSettingBtn]}
                        handleChangeColor={handleChangeValue}
                        style={{
                          width: "100%",
                          height: "100%"
                        }}
                      />
                    </div>
          }
        </div>
      </div>
    </div>
  );
}

export default Appearance;