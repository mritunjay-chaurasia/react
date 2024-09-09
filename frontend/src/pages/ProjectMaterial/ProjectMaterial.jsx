import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { Stack, Button,Modal,Box } from "@mui/material";
import * as React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ProductMaterialTable from "../../components/ProductMaterialTable/ProductMaterialTable";
import { showNotification } from "../../utils/notification";
import { fetchProductDocs } from "../../api/productMaterial.api";
import UploadProjectMaterial from "./UploadProjectMaterial";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
//   width: "500px",
  height: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
  border: "none",
  outline: "none",
};  

const ProjectMaterial = () => {
  let tableHeadings = ["Date","Uploaded By", "Document",];
  const [allProductDocs, setAllProductDocs] = useState([]);
  const navigate = useNavigate();
  const { selectedProject } = useSelector((state) => state.orgDetails);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    (async () => {
      if (selectedProject && selectedProject.id) {
        const data = {
          page: page,
          limit: limit,
          projectId: selectedProject?.id,
        };
        const response = await fetchProductDocs(data);
        if (response && response.status) {
          setAllProductDocs(response.allProductDocs);
          setTotalPages(response.totalPage);
          if (response.allProductDocs.length === 0) setLoading(false);
          if (response.totalPage < page) setPage(1);
        }
      }
    })();
  }, [selectedProject, page,openModal]);
  return (
    <>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="upload-modal-title"
        aria-describedby="upload-modal-description"
      >
        <Box sx={modalStyle}>
          <UploadProjectMaterial
            setOpenModal={setOpenModal}
          />
        </Box>
      </Modal>
      <div className="workOrderPage">
        <div className="workOrderListContainer">
          {userInfo?.usertype !== "superadmin" && (
            <div className="createWorkOrderListBtnContainer">
              <Button
                variant="contained"
                style={{
                  background: "#F07227",
                  borderRadius: "5px",
                  width: "auto",
                  height: "41px",
                }}
                onClick={() => setOpenModal(true)}
              >
                <span className="text-capitalize">Upload</span>
              </Button>
            </div>
          )}
          <ProductMaterialTable
            tableHeadings={tableHeadings}
            tabledata={allProductDocs}
            loading={loading}
          />
          <div className="workOrderListTablePagination">
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                variant="outlined"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    "&.Mui-selected": {
                      background: "#284FA3",
                      color: "white",
                    },
                  },
                }}
                page={Number(page)}
                onChange={(event, page) => setPage(page)}
              />
            </Stack>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectMaterial;
