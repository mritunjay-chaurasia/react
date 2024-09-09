import { Box, Modal, TextField, Typography } from '@mui/material'
import React from 'react'
import styles from './AddCardModal.module.css';
import Billing from './Components/Billing';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "auto",
    bgcolor: 'background.paper',
    border: 'none',
    p: 4,
    borderRadius: "8px",
};

function AddCardModal({ visible, selectedPlan, handleClose, user, setUser }) {
    console.log("selectedPlanselectedPlanselectedPlan", selectedPlan)
    console.log("issssss", user)
    return (<Modal
        open={visible}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <Billing user={user} setUser={setUser} handleClose={handleClose} selectedPlan={selectedPlan} />
        </Box>
    </Modal>
    )
}

export default AddCardModal;