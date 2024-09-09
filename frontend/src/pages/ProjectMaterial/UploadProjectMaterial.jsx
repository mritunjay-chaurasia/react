import React, { useState} from "react";
import { Box, Button} from '@mui/material';
import Input from '../../components/Input/Input';
import { showNotification } from '../../utils/notification';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { addProductDocs } from "../../api/productMaterial.api";

const UploadProjectMaterial = ({setOpenModal}) => {
    const { selectedProject } = useSelector((state) => state.orgDetails);
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleSubmit = async () => {
        try {
            if (!(Array.isArray(selectedFiles) && selectedFiles.length > 0)) {
                showNotification('error', "Please select file");
                return;
            }
            let data = {
                projectId: selectedProject?.id,
            }
            var formData = new FormData();
            selectedFiles.forEach((file, index) => {
                formData.append("files", file);
            });
            formData.append("data", JSON.stringify(data));
            const response = await addProductDocs(formData)
            if (response && response.status) {
                setOpenModal(false)
                // showNotification("success", "Documents uploaded successfully")
            }
            navigate(`/project-material`)
        } catch (error) {
            console.log('Error while submiting', error);
            showNotification('error', "Some Error Occured please try after some time");

        }
    }

    const handleFileChange = (event) => {
        const fileInput = event.target;
        const files = fileInput.files;
        const maxSizeInBytes = 50 * 1024 * 1024; 
        const newFiles = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file.type.startsWith('image')) {
                if (file.size > maxSizeInBytes) {
                } else {
                    newFiles.push(file);
                }
            } else {
                newFiles.push(file);
            }
        }
        setSelectedFiles(newFiles);
    };


    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <Box noValidate sx={{ mt: 1, flexDirection: "column", width: "100%", padding: "30px", backgroundColor: "white" }}>
                    <Input
                        name="Plugin File"
                        placeholder="Plugin File"
                        type="file"
                        onChange={handleFileChange}
                        pluginFile={selectedFiles}
                        accept=".jpg, .jpeg, .mp4, .zip, .ppt, .pptx, .xls, .xlsx, .csv, .doc, .docx, .pdf, .txt"
                        multiple
                        message="max Size limit 50mb"
                        messages={[
                            "Files must be less than 50mb.",
                            "Allowed file types: .jpg, .jpeg, .mp4, .zip, .ppt, .pptx, .xls, .xlsx, .csv, .doc, .docx, .pdf, .txt"
                        ]}
                        style={{
                            width: "100%",
                            height: "70px",
                            borderRadius: "5px",
                            outline: "none",
                            padding: "15px",
                            background: "white",
                            border: "1px solid #DCDCDC",
                            margin: "10px 0",
                        }}
                    />
                    <Button
                        type="submit"
                        className='text-capitalize'
                        id='requirementSubmitButton'
                        variant="contained"
                        style={{ backgroundColor: "#F07227", fontSize: '17px', fontWeight: 600, padding: ' 5px 40px', margin: "8px 0" }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Box>
            </div>
        </>
    )
}
export default UploadProjectMaterial