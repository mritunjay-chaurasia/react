import React from 'react'
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import SendIcon from '@mui/icons-material/Send';
import AttachedFile from '../UpdateChats/AttachedFile';

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
        buttonIcons:{
          display:"flex",
          flexDirection:"row",
          alignItems:"center",
          gap:"10px"
        },
        button: {
            background: "rgb(240, 114, 39)",
            "&:hover": {
                background: "rgb(240, 114, 39)"
            },
            borderRadius: "50%", 
            width: "48px", 
            height: "48px", 
            minWidth: "unset",
            border:"none",
            cursor: "pointer",
            "&:disabled": {
                cursor: "not-allowed", 
              }
        },
        sendIcon: {
            color: "white" 
          }
    })
);


export const TextInput = ({ commentText, onChange, onSubmit,onUpdateTicketData,isLoader }) => {
    const classes = useStyles();

    // const handleEnter = (e) => {
    //     if (e.keyCode === 13 && e.shiftKey === false) {
    //         onSubmit(e);
    //     }
    // };

    return (
        <>
            <div className={classes.wrapForm} noValidate autoComplete="off">
                <TextField
                    id="standard-text"
                    label="Add a comment"
                    className={classes.wrapText}
                    value={commentText}
                    onChange={onChange}
                    // onKeyDown={handleEnter}
                    multiline
                    maxRows={4}
                //margin="normal"
                />
                <div className={classes.buttonIcons}>
                    <AttachedFile onUpdateTicketData={onUpdateTicketData}/>
                    <button variant="contained" className={classes.button} disabled={isLoader} onClick={onSubmit}>
                        <SendIcon className={classes.sendIcon} />
                    </button>
                </div>
            </div>
        </>
    )
}



