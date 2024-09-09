import React, { useEffect, useState } from "react";
import {
  MenuItem,
  Checkbox,
  ListItemText,
  IconButton,
  Menu,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import './style.css'
function MultipleSelectCheckmarks({
  heading,
  workOrderStatusList,
  allOrgUsers,
  checkedReporters,
  setCheckedReporters,
  checkedModes,
  setCheckedModes,
  checkedStatuses,
  setCheckedStatuses,
  checkedAssignees,
  setCheckedAssignees,
  checkedCreatedDates,
  setCheckedCreatedDates,
  setIsCheckedCreatedDates,isCheckedCreatedDates
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  let mode = [
    { label: "AI", value: "ai" },
    { label: "hybrid", value: "hybrid" },
  ];


const foundObject = isCheckedCreatedDates.find(item => typeof item === 'object' && 'startDate' in item && 'endDate' in item);



  const [selectionRange, setSelectionRange] = useState(foundObject ? foundObject : {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [selectedDate, setSelectedDate] = useState(selectionRange);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
    const startDateString = ranges.selection.startDate.toLocaleString();
    const endDateString = ranges.selection.endDate.toLocaleString();
    setIsDateSelected(true);
    setSelectedDate({
      startDate: startDateString,
      endDate: endDateString,
      key: 'selection',
    })
  };
  
  const handleClick = (heading, event) => {
    setAnchorEl(event.currentTarget);
    setSelectedType(heading);
  };

  const handleClose = () => {
    setAnchorEl(null);

  };
  const handleRenderDates = () => {
    if(selectedType === "Created Date" && selectionRange){
      setIsCheckedCreatedDates([selectionRange])
      setCheckedCreatedDates([selectedDate])
    }
  };

  const handleMenuItemClick = (value, type) => {
    let newCheckedArray = [];
    
    switch (type) {
      case "Reporter":
        newCheckedArray = [...checkedReporters];
        break;
      case "Mode":
        newCheckedArray = [...checkedModes];
        break;
      case "Status":
        newCheckedArray = [...checkedStatuses];
        break;
      case "Assigned To":
        newCheckedArray = [...checkedAssignees];
        break;
      case "Created Date":
        newCheckedArray = [...checkedCreatedDates];
        break;
      default:
        break;
    }
  
    // Check if the value is already in the array
    const isChecked = newCheckedArray.includes(value);
  
    // If the value is already checked, remove it; otherwise, add it
    if (isChecked) {
      newCheckedArray = newCheckedArray.filter((item) => item !== value);
    } else {
      newCheckedArray.push(value);
    }
  
    // Update the state based on the type
    switch (type) {
      case "Reporter":
        setCheckedReporters(newCheckedArray);
        break;
      case "Mode":
        setCheckedModes(newCheckedArray);
        break;
      case "Status":
        setCheckedStatuses(newCheckedArray);
        break;
      case "Assigned To":
        setCheckedAssignees(newCheckedArray);
        break;
      case "Created Date":
        setCheckedCreatedDates(newCheckedArray);
        break;
      default:
        break;
    }
  };

  
  

  return (
    <>
      <IconButton onClick={(e) => handleClick(heading, e)} sx={{ padding: 0,color:"white" }}>
        <span style={{fontSize:"16px",fontWeight:"600"}}>{heading}</span>
        <ArrowDropDownIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "demo-multiple-checkbox-label",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            maxHeight: 435,
            overflowY: "auto",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            // mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 10,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
      >

        {allOrgUsers && allOrgUsers.length > 0 &&
          selectedType === "Reporter" &&
          allOrgUsers.length > 0 &&
          allOrgUsers.map((user, index) => (
            <MenuItem key={index} onClick={() => handleMenuItemClick(user.id,"Reporter")}>
              <Checkbox type="checkbox" checked={checkedReporters.includes(user.id)} value={user.id} id={`checkbox-${index}`} />
              <ListItemText sx={{color:"black"}} primary={user.firstname} />
            </MenuItem>
          ))}

          {mode && mode.length > 0 &&
                selectedType === "Mode" &&
                mode.length > 0 &&
                mode.map((item, index) => (
                  <MenuItem key={index} onClick={() => handleMenuItemClick(item.value,"Mode")}>
                    <Checkbox type="checkbox" checked={checkedModes.includes(item.value)} value={item.value} id={`checkbox-${index}`} />
                    <ListItemText primary={item.label} />
                  </MenuItem>
            ))}
              {
                selectedType === "Status" && (
                  <>
                    {workOrderStatusList && workOrderStatusList.length > 0 ? (
                      workOrderStatusList.map((item, index) => (
                        <MenuItem key={index} onClick={() => handleMenuItemClick(item.value, "Status")}>
                          <Checkbox type="checkbox" checked={checkedStatuses.includes(item.value)} value={item.value} id={`checkbox-${index}`} />
                          <ListItemText primary={item.label} />
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem>
                        <ListItemText primary="No options" />
                      </MenuItem>
                    )}
                  </>
                )
              }
              
              {allOrgUsers && allOrgUsers.length > 0 &&
                selectedType === "Assigned To" &&
                allOrgUsers.length > 0 &&
                allOrgUsers.map((user, index) => (
                  <MenuItem key={index} onClick={() => handleMenuItemClick(user.id,"Assigned To")}>
                    <Checkbox type="checkbox" checked={checkedAssignees.includes(user.id)} value={user.id} id={`checkbox-${index}`} />
                    <ListItemText sx={{color:"black"}} primary={user.firstname} />
                  </MenuItem>
            ))}

            {selectedType === "Created Date" &&
               <div className="d-flex flex-column">
               <DateRangePicker
                 ranges={[selectionRange]}
                 onChange={handleSelect}
                 showDateDisplay={true}
                 showPreview={true}
               />
               <button className={`date-range-apply ${!isDateSelected ? 'disabled' : ''}`} onClick={handleRenderDates} disabled={!isDateSelected}>Apply</button>
             </div>
            }
      </Menu>
    </>
  );
}

export default MultipleSelectCheckmarks;
