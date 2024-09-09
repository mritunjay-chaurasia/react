import React, { useCallback, useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { InputLabel, Select, MenuItem } from "@mui/material";
import { useSelector } from "react-redux";
import * as inviteApi from "../../api/invite.api";
import { showNotification } from "../../utils/notification";
import { socket } from "../../socket";

const style = {
    position: "absolute",
    top: "35%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    height: "350px",
    bgcolor: "#f8f5f3",
    boxShadow: 24,
    p: 5,
    borderRadius: "7px",
};

/**
 * This Page is made for Inviting user to Org
 * @params = None
 * @response : None
 * @author : Mandeep Singh
 */
function InviteUser() {
    const email = useRef();
    const user = useSelector((state) => state.user);
    const { selectedOrganization, invites } = useSelector((state) => state.orgDetails);

    const [inviteList, setInviteList] = useState([]);
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState("user");
    const [ownerEmailId, setOwnerEmailId] = useState("");

    const handleClose = () => setOpen(false);

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

    /**
    * This Function is made for handling block unblock status
    * @params = btnId(type:String),
        id(type:String) index number in fetched invitedUserList []
    * @response : None
    * @author : Mandeep Singh
    */
    const handleBlockUnblock = async (btnId, id) => {
        if (checkForUser() === "user") {
            return showNotification("error", "You are not allowed to perform this action");
        }
        const btn = document.getElementById(btnId);
        let btnValue = "";
        let btnStyle = "";
        const selectedInvite = inviteList[id];

        if (selectedInvite.userAction === "unblock") {
            btnValue = "block";
            btnStyle = `#c10041;`;
        } else {
            btnValue = "unblock";
            btnStyle = `green;`;
        }

        btn.innerHTML = btnValue;
        btn.style = btnStyle;
        let response = await inviteApi.invitationAcepted(
            selectedInvite.invitationCode,
            selectedInvite.invitedUserEmailId,
            btnValue
        );
        if (response && response.status) {
            socket.emit("userOrgActionChanged", selectedInvite.invitedUserId);
        }
        fetchInvitedList();
    };

    const checkForUser = () => {
        let userType = "owner";
        if (invites && invites.length > 0) {
            let invitedOrg = invites.find((item) => item.invitedOrgId === selectedOrganization.id);
            if (invitedOrg) {
                if (invitedOrg.assignedRole === "admin") userType = "admin";
                else userType = "user";
            }
        }
        return userType;
    };

    const convertdateFormat = (dateValue) => {
        const options = { weekday: "short", day: "2-digit", month: "short", year: "numeric" };
        const formattedDate = new Date(dateValue).toLocaleDateString("en-US", options);
        let dateAndMonth = formattedDate.split(",")[1];
        dateAndMonth = dateAndMonth.trim();
        let month = dateAndMonth.split(" ")[0];
        let date = dateAndMonth.split(" ")[1];
        let year = formattedDate.split(",")[2];
        return `${date} ${month} ${year}, ${new Date(dateValue).toLocaleTimeString()}`;
    };

    /**
     * This Function Invite User
     * @params = None
     * @response : None
     * @author : Mandeep Singh
     */
    const handleSendInvite = async (e) => {
        e.preventDefault();
        try {
            if (!role.trim().length > 0 || !email.current.value.trim() > 0) {
                showNotification("error", " Both Fields Compulsary");
                return;
            }
            
            if (email.current.value.trim() === user.userInfo.emailid)
            {
                handleClose();
                showNotification('error',`Error Can't invite self`);
                return;
            }
            if (selectedOrganization?.id) {
                const selectedOrg = selectedOrganization;
                const response = await inviteApi.inviteUserToOrg(
                    user.userInfo.id,
                    selectedOrg.id,
                    selectedOrg.organizationname,
                    email.current.value,
                    role
                );
                if (response.status) {
                    fetchInvitedList();
                    showNotification("success", "Invitation sent successfully");
                    handleClose();
                } else {
                    showNotification("error", response.message);
                    handleClose();
                }
            } else {
                showNotification("error", "Some error occured please try after some time");
                handleClose();
            }
        } catch (error) {
            if (error?.response?.status === 409) {
                showNotification("error", error.response.data.message);
            } else {
                showNotification("error", "Some error occured please try after some time");
            }
            console.log(error);
            handleClose();
        }
    };

    const fetchInvitedList = useCallback(async () => {
        try {
            let data = await inviteApi.getInvitedList(selectedOrganization.id, selectedOrganization.user);
            if (data.status) {
                setInviteList(data.foundData);
                setOwnerEmailId(data.ownerEmail);
            }
        } catch (error) {
            console.log(error);
        }
    }, [selectedOrganization]);

    const handleOpenInviteModal = () => {
        if (checkForUser() === "user") {
            return showNotification("error", "You are not allowed to invite user to this Organisation");
        }
        setOpen(true);
    };

    useEffect(() => {
        if (selectedOrganization?.id) fetchInvitedList();

        socket.on("refetchInviteList", () => {
            if (selectedOrganization?.id) fetchInvitedList();
        });

        return () => {
            socket.off("refetchInviteList");
        };
    }, [selectedOrganization, fetchInvitedList]);

    const handleRefuseAction = () => {
        showNotification("error", "You are not allowed to perform this action.");
    };

    return (
        <div style={{ padding: 30, width: "100%", height: "100%" }}>
            <div
                style={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "flex-start",
                    }}
                >
                    <Button
                       className="text-capitalize"
                        onClick={handleOpenInviteModal}
                        sx={{
                            "&.MuiButtonBase-root:hover": {
                                bgcolor: "#F07227",
                            },
                            border: "1px solid #F07227",
                            backgroundColor: "#F07227",
                            fontSize: "17px",
                            fontWeight: 700,
                            color: "white",
                            textTransform: "capitalize",
                        }}
                    >
                        Invite User
                    </Button>
                </div>
                <div style={{ margin: "30px 0" }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">Email</StyledTableCell>
                                    <StyledTableCell align="center">Status</StyledTableCell>
                                    <StyledTableCell align="center">Invited Date</StyledTableCell>
                                    <StyledTableCell align="center">Role</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <StyledTableCell sx={{ fontWeight: 900 }} align="center">
                                        {ownerEmailId}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 900 }} align="center">
                                        ---
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 900 }} align="center">
                                        ---
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 900 }} align="center">
                                        Owner
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 900 }} align="center"></StyledTableCell>
                                </TableRow>

                                {inviteList && inviteList.length > 0 ? (
                                    inviteList.map((invite, index) => (
                                        <TableRow key={"inviteUser_" + index}>
                                            <StyledTableCell align="center">{invite.invitedUserEmailId}</StyledTableCell>
                                            <StyledTableCell sx={{ textTransform: "capitalize" }} align="center">
                                                {invite.invitationStatus}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {convertdateFormat(invite.createdAt)}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ textTransform: "capitalize" }} align="center">
                                                {invite.assignedRole}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Button
                                                    className="text-capitalize"
                                                    id={`blockUnblock_btn${index}`}
                                                    onClick={
                                                        invite.invitedUserId === user.userInfo.id
                                                            ? handleRefuseAction
                                                            : () => handleBlockUnblock(`blockUnblock_btn${index}`, index)
                                                    }
                                                    sx={{
                                                        "&.MuiButtonBase-root:hover": {
                                                            bgcolor: invite.userAction === "unblock" ? "#f00051" : "#02ba02",
                                                        },
                                                        padding: "0 2rem",
                                                        width: "120px",
                                                        backgroundColor: invite.userAction === "unblock" ? "#c10041" : "green",
                                                        fontSize: "17px",
                                                        fontWeight: 700,
                                                        color: "white",
                                                        textTransform: "capitalize",
                                                    }}
                                                >
                                                    {invite.userAction === "unblock" ? "block" : "unblock"}
                                                </Button>
                                            </StyledTableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow sx={{ height: "150px" }}>
                                        <TableCell style={{ textAlign: "center" }} colSpan={5}>
                                            No Invitation Record Found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>

            <Modal
                className="chatHistroy_scrollbar"
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="chatHistory_tableContainer  ">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <strong>
                            <center>Invite New User </center>
                        </strong>
                    </Typography>
                    <form onSubmit={handleSendInvite}>
                        <InputLabel style={{ margin: "5px" }} id="input-email">
                            Email
                        </InputLabel>
                        <input
                            id="input-email"
                            name="email"
                            ref={email}
                            placeholder="Email"
                            required
                            type="email"
                            style={{
                                width: "100%",
                                height: "52px",
                                borderRadius: "5px",
                                outline: "none",
                                padding: "15px",
                                background: "white",
                                border: "1px solid #DCDCDC",
                                marginBottom: "10px",
                            }}
                        />

                        <InputLabel style={{ margin: "5px" }} id="select-label">
                            Role
                        </InputLabel>
                        <Select
                            labelId="select-label"
                            style={{
                                width: "100%",
                                height: "52px",
                                borderRadius: "5px",
                                backgroundColor: "white",
                            }}
                            variant="outlined"
                            value={role}
                            // ref={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>

                        <Button
                            className="text-capitalize"
                            type="submit"
                            sx={{
                                "&.MuiButtonBase-root:hover": {
                                    bgcolor: "#F07227",
                                },
                                border: "1px solid #F07227",
                                backgroundColor: "#F07227",
                                fontSize: "17px",
                                fontWeight: 700,
                                color: "white",
                                textTransform: "capitalize",
                                marginTop: "1.5rem",
                                marginLeft: "50%",
                                transform: "translate(-50%,0)",
                            }}
                        >
                            Send Invite
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
export default InviteUser;
