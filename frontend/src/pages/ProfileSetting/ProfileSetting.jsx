import React, { useEffect, useRef, useState } from "react";
import { Button, Grid } from "@mui/material";
import "./profileSetting.css";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../../utils/notification";
import * as authApi from "../../api/auth.api";
// import PhoneInput from "react-phone-input-2";
import { logout, updateMe } from "../../store/user/userSlice";
import { CFormInput } from "@coreui/react";

function ProfileSetting() {
    const { userInfo } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    // const [phone, setPhone] = useState(0);

    const email = useRef();
    const firstname = useRef();
    const lastname = useRef();
    // const lName = useRef();
    const old_pwd = useRef();
    const [password, setPassword] = useState("");
    const [passValid, setPassValid] = useState(false);

    useEffect(() => {
        email.current.value = userInfo?.emailid;
        firstname.current.value = userInfo?.firstname;
        lastname.current.value = userInfo?.lastname;
        // setPhone(userInfo?.phoneno);
    }, [userInfo]);

    // const handlePhone = (e) => {
    //     setPhone(e);
    // };

    /**
     * This Function Handle Users detail Update
     * @response : None
     * @author : Mandeep Singh
     */
    const handleUpdate = async () => {
        let response;
        if (
            firstname.current.value.trim().length > 0
            //&&  lName.current.value.trim().length > 0 &&
            // phone.trim().length > 0
        ) {
            try {
                response = await authApi.updateUser(
                    firstname.current.value,
                    lastname.current.value,
                    userInfo?.source,
                    userInfo?.emailid,
                    // phone,
                    userInfo?.usertype
                );

                if (response.status) {
                    dispatch(updateMe(response.user));
                    showNotification("success", "Profile Updated Successfully");
                }
            } catch (error) {
                if (error.message) {
                    showNotification("error", error?.message);
                } else {
                    showNotification("error", "Some Error occurred, please try after sometime");
                    console.log("error", error);
                }
            }
        } else {
            showNotification("error", `Name can't be empty`);
        }
    };

    /**
     * This Function Update Users Password from Profile Setting
     * @response : None
     * @author : Mandeep Singh
     */
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!passValid) {
            showNotification("error", "Invalid Password !");
            return;
        }

        let response;
        try {
            response = await authApi.changePasswordFromProfile(
                userInfo?.emailid,
                old_pwd.current.value,
                password
            );
            if (response?.status) {
                showNotification("success", response.message);
                old_pwd.current.value = "";
                // password = "";
                setTimeout(() => {
                    dispatch(logout());
                }, 1200);
            }

            // if (!response?.response.data.status) {
            //     showNotification("error", response?.response.data.message);
            // }
        } catch (error) {
            if (error?.response?.data?.message) {
                showNotification("error", error?.response.data.message);
            } else {
                showNotification("error", "Some Error occurred, please try after sometime");
                console.log("error", error);
            }
        }
    };

    /**
     * This function test if password meets set requirements
     * @params = pass:string
     * @response : Boolean
     * @author : Mandeep Singh
     */
    const passwordValid = (pass) => {
        const regEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

        if (regEx.test(pass)) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * This function is middleware to set password in stat and checking password is valid or not it also set custom validity of input field
     * @params = p:string
     * @response : None
     * @author : Mandeep Singh
     */
    const checkPassword = (p) => {
        const passwordId = document.getElementById("passwordId");
        setPassword(p);
        const v = passwordValid(p);

        if (!v) {
            passwordId.setCustomValidity(
                "Password Must contains at least one digit ,one special character and length between 8 and 16 characters."
            );
        } else {
            passwordId.setCustomValidity("");
        }
        setPassValid(v);
    };

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <form onSubmit={handleChangePassword} className="profileSetting_holder">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <CFormInput
                            ref={firstname}
                            autoComplete="given-name"
                            name="firstName"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            autoFocus
                            feedbackInvalid="Please provide a Name."
                            type="text"
                            className="form-control input-style"
                            aria-describedby="emailHelp"
                            placeholder="Name"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CFormInput
                            ref={lastname}
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="family-name"
                            feedbackInvalid="Please provide a Name."
                            type="text"
                            className="form-control input-style"
                            aria-describedby="emailHelp"
                            placeholder="Name"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CFormInput
                            ref={email}
                            disabled
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            className="form-control input-style"
                            id="email"
                            placeholder="Email"
                        />
                    </Grid>
                </Grid>

                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "1rem",
                    }}
                >
                    <Button
                        className="text-capitalize"
                        onClick={handleUpdate}
                        type="button"
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
                        Update Details
                    </Button>
                </div>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <CFormInput
                            name="oldPassword"
                            required
                            ref={old_pwd}
                            placeholder="Old Password"
                            type="text"
                            fullWidth
                            id="firstName"
                            label="Old Password"
                            autoFocus
                            feedbackInvalid="Please provide a Name."
                            className="form-control input-style"
                            aria-describedby="emailHelp"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CFormInput
                            name="newPassword"
                            id="passwordId"
                            required
                            onChange={(e) => checkPassword(e.target.value)}
                            placeholder="New Password"
                            type="text"
                            fullWidth
                            label="New Password"
                            feedbackInvalid="Please provide a Name."
                            className="form-control input-style"
                            aria-describedby="emailHelp"
                        />
                    </Grid>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "1rem",
                        }}
                    >
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
                            }}
                        >
                            Update Password
                        </Button>
                    </div>
                </Grid>
                {/* <div style={{ width: "100%" }}>
                    <div style={{ display: "inline-block" }} className="profileSetting_field">
                        <label htmlFor="oldPassword">
                            <strong>Old Password</strong>
                        </label>
                        <input
                            name="oldPassword"
                            required
                            ref={old_pwd}
                            placeholder="Old Password"
                            type="text"
                            style={{
                                width: "100%",
                                height: "52px",
                                borderRadius: "5px",
                                outline: "none",
                                padding: "15px",
                                background: "white",
                                border: "1px solid #DCDCDC",
                            }}
                        />
                    </div>

                    <div style={{ display: "inline-block" }} className="profileSetting_field">
                        <label htmlFor="newPassword">
                            <strong>New Password</strong>
                        </label>
                        <input
                            name="newPassword"
                            id="passwordId"
                            required
                            onChange={(e) => checkPassword(e.target.value)}
                            placeholder="New Password"
                            type="text"
                            style={{
                                width: "100%",
                                height: "52px",
                                borderRadius: "5px",
                                outline: "none",
                                padding: "15px",
                                background: "white",
                                border: "1px solid #DCDCDC",
                            }}
                        />
                    </div>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "1rem",
                        }}
                    >
                        <Button
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
                            }}
                        >
                            Update Password
                        </Button>
                    </div>
                </div> */}
            </form>
        </div>
    );
}

export default ProfileSetting;
