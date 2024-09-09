import React from 'react'
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import SendIcon from '@mui/icons-material/Send';


const useStyles = makeStyles((theme) =>
    createStyles({
        wrapForm: {
            display: "flex",
            justifyContent: "center",
            width: "95%",
            margin: `${theme.spacing(0)} auto`
        },
        wrapText: {
            width: "100%"
        },
        button: {
            //margin: theme.spacing(1),
        },
    })
);


export const TextInput = ({ commentText, onChange, onSubmit }) => {
    const classes = useStyles();

    const handleEnter = (e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
            onSubmit(e);
        }
    };

    return (
        <>
            <div className={classes.wrapForm} noValidate autoComplete="off">
                <TextField
                    id="standard-text"
                    label="Add a comment"
                    className={classes.wrapText}
                    value={commentText}
                    onChange={onChange}
                    onKeyDown={handleEnter}
                //margin="normal"
                />
                <Button variant="contained" color="primary" className={classes.button} onClick={onSubmit}>
                    <SendIcon />
                </Button>
            </div>
        </>
    )
}



