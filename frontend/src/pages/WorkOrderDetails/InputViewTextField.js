import React, { useEffect, useState } from "react";
import { Typography, Input, MenuItem, Avatar } from "@mui/material";
import { Select, makeStyles } from "@material-ui/core";
import PersonIcon from "@mui/icons-material/Person";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0]?.[0] ?? ""}${
      name.split(" ")[1]?.[0] ?? ""
    }`,
  };
}

const useStyles = makeStyles({
  root: {
    height: "100%",
    width: "100%",
    minHeight: "32px",
    "&:hover": {
      backgroundColor: "#efefef",
    },
    ":MuiInputBase-root": {
      padding: 0,
    },
  },
  selectInput: {
    width: "100%",
    "& .MuiSelect-select": {
      width: "100%",
      height: "100%",
      minHeight: "32px",
      padding: "5px 24px 5px 8px",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
    },
  },
});

const InputViewTextField = ({
  type,
  text,
  onChange,
  handleUpdateData,
  options,
  style,
}) => {
  const classes = useStyles();

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const [currUser, setCurrUser] = useState({});
  const [open, setOpen] = useState(true);

  const handleDoubleClick = () => {
    if (value !== "Coming soon") setIsEditing(true);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    if (e.target.value === "none") e.target.value = "";
    onChange(e);
  };

  const handleBlur = (e) => {
    handleUpdateData(e);
    setIsEditing(false);
  };

  useEffect(() => {
    if (type === "statusSelect") console.log("texttexttexttext", text, options);
    setValue(text);
  }, [text]);

  useEffect(() => {
    if (options && options.length > 0) {
      let user = options.find((user) => user.id === value);
      if (user) setCurrUser(user);
    }
  }, [value, options]);

  if (type === "selectPriority") {
    return (
      <div className={classes.root}>
        {isEditing ? (
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            defaultValue="none"
            onChange={(e) => {
              handleChange(e);
              handleUpdateData(e);
            }}
            // onBlur={handleBlur}
            value={value ?? "none"}
            className={classes.selectInput}
            displayEmpty
            open={open}
            onClose={() => {
              setOpen(false);
              // handleBlur()
            }} // Disable closing the select
            onOpen={() => setOpen(true)} // Enable opening the select
          >
            <MenuItem style={{ fontSize: "14px" }} value="none">
              None
            </MenuItem>
            {options.map((item) => (
              <MenuItem style={{ fontSize: "14px" }} value={item.value}>
                {" "}
                {item?.value && <img
                  style={{ height: "16px", marginRight: "8px" }}
                  src={`https://rtesoftwares.atlassian.net/images/icons/priorities/${item.value}.svg`}
                />}
                {" "}
                <span>{item.label}</span>
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Typography
            sx={{
              width: "100%",
              height: "100%",
              minHeight: "32px",
              padding: "5px 8px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
            }}
            onClick={handleDoubleClick}
          >
            {" "}
            {value && <img
              style={{ height: "16px", marginRight: "8px" }}
              src={`https://rtesoftwares.atlassian.net/images/icons/priorities/${value}.svg`}
            />}
            {" "}
            {value && value.length > 0 ? value : "None"}
          </Typography>
        )}
      </div>
    );
  }

  if (type === "statusSelect") {
    return (
      <div className={classes.root}>
        {value && (
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // label="Age"
            onChange={(e) => {
              handleChange(e);
              handleUpdateData(e);
            }}
            value={value}
            style={{ ...style }}
            className={classes.selectInput}
          >
            {options.map((item) => (
              <MenuItem style={{ fontSize: "14px" }} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        )}
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className={classes.root}>
        {isEditing ? (
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            defaultValue="none"
            onChange={(e) => {
              handleChange(e);
              handleUpdateData(e);
            }}
            // onBlur={handleBlur}
            value={value ?? "none"}
            className={classes.selectInput}
            displayEmpty
            open={open}
            onClose={() => {
              setOpen(false);
              // handleBlur()
            }} // Disable closing the select
            onOpen={() => setOpen(true)} // Enable opening the select
          >
            <MenuItem style={{ fontSize: "14px" }} value="none">
              <Avatar
                style={{
                  width: "32px",
                  height: "32px",
                  fontSize: "14px",
                  marginRight: "8px",
                }}
              >
                <PersonIcon />
              </Avatar>
              Unassigned
            </MenuItem>
            {options.map((user) => (
              <MenuItem style={{ fontSize: "14px" }} value={user.id}>
                <Avatar
                  style={{
                    width: "32px",
                    height: "32px",
                    fontSize: "14px",
                    marginRight: "8px",
                  }}
                  {...stringAvatar(`${user.firstname} ${user.lastname ?? ""}`)}
                />
                {`${user.firstname} ${user.lastname ?? ""}`}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Typography
            sx={{
              width: "100%",
              height: "100%",
              minHeight: "32px",
              padding: "5px 8px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
            }}
            onClick={handleDoubleClick}
          >
            {currUser && currUser?.firstname ? (
              <>
                <Avatar
                  style={{
                    width: "32px",
                    height: "32px",
                    fontSize: "14px",
                    marginRight: "8px",
                  }}
                  {...stringAvatar(
                    `${currUser.firstname} ${currUser.lastname ?? ""}`
                  )}
                />
                {`${currUser.firstname} ${currUser.lastname ?? ""}`}
              </>
            ) : (
              <>
                <Avatar
                  style={{
                    width: "32px",
                    height: "32px",
                    fontSize: "14px",
                    marginRight: "8px",
                  }}
                >
                  <PersonIcon />
                </Avatar>
                Unassigned
              </>
            )}
          </Typography>
        )}
      </div>
    );
  }

  return (
    <>
      <div className={classes.root}>
        {isEditing ? (
          <Input
            style={{ ...style }}
            sx={{
              width: "100%",
              height: "100%",
              minHeight: "32px",
              padding: "5px 8px",
              fontSize: "12px",
              "& .MuiInputBase-input": {
                padding: 0,
              },
            }}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
            disabled={value === "Coming soon"}
          />
        ) : (
          <Typography
            style={{ ...style }}
            sx={{
              width: "100%",
              height: "100%",
              minHeight: "32px",
              // padding: "5px 8px",
              fontSize: "14px",
              color: value === "Coming soon" ? "grey" : "black",
            }}
            onClick={handleDoubleClick}
          >
            {value}
          </Typography>
        )}
      </div>
    </>
  );
};

export default InputViewTextField;
