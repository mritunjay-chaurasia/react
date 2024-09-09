import React, { useState, useEffect } from "react";
import { IconButton, Box } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";


const SelectedFilesName = ({ selectedFiles, setSelectedFiles }) => {
  const [selectedFilesName, setSelectedFilesName] = useState([]);

  useEffect(() => {
    if (
      selectedFiles &&
      selectedFiles.key === "files" &&
      selectedFiles.value.length > 0
    ) {
      const names = [];
      for (const file of Object.values(selectedFiles.value)) {
        names.push({ name: file.name });
      }
      setSelectedFilesName(names);
    }
  }, [selectedFiles]);

  const handleRemoveFile = (fileName) => {
    const filteredFiles = selectedFilesName.filter(file => file.name !== fileName);
    setSelectedFilesName(filteredFiles);

    const filteredAllFiles = Array.from(selectedFiles.value).filter(
      file => file.name !== fileName
    );
      setSelectedFiles(prevSelectedFiles => ({
        ...prevSelectedFiles,
        value: filteredAllFiles
      }));
  };

  return (
    <>
      <div className="selected-fileList d-flex flex-wrap flex-row">
        {selectedFiles &&
          selectedFiles.key === "files" &&
          selectedFilesName.length > 0 &&
          selectedFilesName.map((file, index) => {
            return (
              <Box
                key={file.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px",
                  margin: "5px",
                }}
              >
                <div>{file.name}</div>
                <IconButton onClick={() => handleRemoveFile(file.name)}>
                  <ClearIcon />
                </IconButton>
              </Box>
            );
          })}
      </div>
    </>
  );
};

export default SelectedFilesName;
