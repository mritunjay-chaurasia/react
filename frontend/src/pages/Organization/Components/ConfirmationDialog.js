import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmationDialog({ open, handleClose, handleConfirm, title, text, label, matchValue }) {
    const [textValue, setTextValue] = React.useState("");

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{whiteSpace: "pre-wrap"}}>
                    {text}
                </DialogContentText>
                <TextField
                    margin="dense"
                    id="name"
                    label={label}
                    type="text"
                    fullWidth
                    variant="standard"
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button className='text-capitalize' onClick={handleClose}>Cancel</Button>
                <Button className='text-capitalize' onClick={handleConfirm} disabled={textValue !== matchValue}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
}