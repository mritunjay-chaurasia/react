import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Button,
  styled,
  CircularProgress,
  Modal,
  Box,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { showNotification } from "../../utils/notification";
import { BACKEND_URL } from "../../constants";
import DisplayMediaFile from "../DisplayMediaFile/DisplayMediaFile"

function ProductMaterialTable({ tableHeadings, tabledata, loading }) {
  const [viewDocs, setViewDocs] = useState(false);
  const [previewDocs, setPreviewDocs] = useState([]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#284FA3",
      color: theme.palette.common.white,
      textTransform: "uppercase",
      fontSize: "16px",
      fontWeight: "600",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {},
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${year}`;
  }

  function getFileExtension(filename) {
    // Use the lastIndexOf method to find the last dot in the filename
    const lastDotIndex = filename.lastIndexOf(".");

    // If a dot is found, return the substring from the dot to the end of the string
    if (lastDotIndex !== -1) {
      return filename.substring(lastDotIndex + 1);
    }
    return "";
  }

  const downloadDocs = async (file) => {
    if (file && file.length > 0) {
      const filename = file[0];
      const currentDate = new Date();
      const formattedDate = currentDate
        .toISOString()
        .replace(/[-:.]/g, "")
        .slice(0, 15);
      const extension = getFileExtension(filename);
      const downloadFilename = `${formattedDate}.${extension}`;
      console.log("Downloading document:  extension", extension);
      console.log("Downloading document:", filename);
      const url = `${BACKEND_URL}/chatImages/${filename}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok.");

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a temporary link element
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = downloadFilename;

        // Trigger the download using a mouse event
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke the object URL to free up memory
        window.URL.revokeObjectURL(blobUrl);

        showNotification("success", "File download started");
      } catch (error) {
        console.error("Error downloading file:", error);
        showNotification("error", "Error downloading file");
      }
    } else {
      console.error("No file to download");
      showNotification("error", "No file to download");
    }
  };

  const handleOpenNewTab = () => {
    setViewDocs(false);
    const url = `${BACKEND_URL}/chatImages/${previewDocs}`;
    window.open(url, "_blank");
  };

  return (
    <div style={{ margin: "30px 0" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {tableHeadings &&
                tableHeadings.length > 0 &&
                tableHeadings.map((heading, index) => (
                  <StyledTableCell
                    className="text-capitalize"
                    key={index}
                    align="center"
                  >
                    {heading}
                  </StyledTableCell>
                ))}
              <StyledTableCell className="text-capitalize" align="center">
                Action
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tabledata && tabledata.length > 0 ? (
              tabledata.map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell align="center">
                    {formatDate(item.createdAt)}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {item.productAddBy.firstname +
                      " " +
                      item.productAddBy.lastname}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                  <div className="d-flex flex-column align-items-center justify-content-center gap-4">
                    {item.docs.length > 0 &&
                      item.docs.map((doc, docIndex) => (
                        <div key={docIndex}>
                          {doc}
                        </div>
                      ))}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {item.docs.length > 0 &&
                      item.docs.map((doc, docIndex) => (
                        <div key={docIndex}>
                            <Button
                              onClick={() => {
                                setViewDocs(true);
                                setPreviewDocs([doc]);
                              }}
                              className="text-capitalize"
                              variant="contained"
                              color="primary"
                              sx={{ margin: 1, backgroundColor: '#F07227', '&:hover': { backgroundColor: '#d86020' } }}
                            >
                              Preview
                            </Button>
                            <Button
                              onClick={() => downloadDocs([doc])}
                              className="text-capitalize"
                              variant="contained"
                              color="primary"
                              sx={{ margin: 1, backgroundColor: '#F07227', '&:hover': { backgroundColor: '#d86020' } }}
                            >
                              Download
                            </Button>
                        </div>
                      ))}
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell
                  colSpan={tableHeadings.length + 1}
                  align="center"
                >
                  {loading ? <CircularProgress /> : <p>No record found</p>}
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={viewDocs}
        onClose={() => setViewDocs(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflowY: "auto" }}
      >
        <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '725px',
          maxHeight: '80vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          padding: '2rem',
          borderRadius: '10px',
          overflow: 'auto',
        }}
          onClick={handleOpenNewTab}
        >
          <DisplayMediaFile commentItem={previewDocs} />
        </Box>
      </Modal>
    </div>
  );
}

export default ProductMaterialTable;
