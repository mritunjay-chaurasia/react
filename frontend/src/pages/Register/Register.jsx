import Logo from "../../assets/images/astorai-logo.png";
import "./register.css";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import * as AuthApi from "../../api/auth.api";
import { CForm, CFormInput } from "@coreui/react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch } from "react-redux";
import { register } from "../../store/user/actions";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import TickOrCross from "./TickOrCross";
import { CircularProgress } from "@mui/material";
import * as inviteApi from "../../api/invite.api";
import { showNotification } from "../../utils/notification";
import { emailRegExp } from "../../constants/index";
import ValidatorModel from "../../components/ValidatorModel";
import PasswordValidator from "../../components/PasswordValidator";



import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {


  const dispatch = useDispatch();
  const [validated, setValidated] = useState(false);
  // const [confirmPasswordStat, handleConfirmPasswordField] = useState("");
  const [passNotValid, IspassValid] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [userExists, setUserExists] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [userDetails, setUserDetails] = useState({
    emailid: "",
    password: "",
    firstname: "",
    lastname: "",
    source: "Platform",
    // phoneno: "",
    usertype: "Individual",
  });
  // const [isPhoneInValid, setIsPhoneInValid] = useState(false);
  const [information, setInformation] = useState({
    projectname: "Project1",
    icon: "geeker",
    companyname: "",
    companywebsite: "",
  });
  const [alertMessageEmail, setAlertMessageEmail] = useState("");
  const [pwModelVisible, setPwModelVisible] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const invite = params.get("invite");
  const [alertMessagePassword, setAlertMessagePassword] = useState("");
  const [isLoader, setIsLoader] = useState(true);
  const [userInviteDetails, setUserInviteDetails] = useState({});



  useEffect(() => {
    (async () => {
      try {
        if (invite) {
          const response = await inviteApi.checkIfInvited(invite);
          if (response.status) {
            // showNotification("success", response.message);
            setUserInviteDetails(response.inviteDetails)
            setUserDetails({
              ...userDetails,
              emailid: response.inviteDetails.invitedUserEmailId,
            });
          } else {
            showNotification("error", response.message);
          }
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.status === 401) {
          showNotification("error", error?.response?.data.message);
        } else {
          showNotification(
            "error",
            "Some error occurred please try after sometime"
          );
        }
      }
    })();
  }, [invite]);

  // const handlePhoneChange = (phone) => {
  //   setIsPhoneInValid(false);
  //   setUserDetails({ ...userDetails, phoneno: phone });
  //   if(phone && phone.length < 12){
  //       setIsPhoneInValid(true);
  //   }
  // };

  // toggle password show or hide
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoader(false);
    }, 500);
  }, []);

  // useEffect(() => {
  //   (() => {
  //     if (userDetails.password === confirmPassword) {
  //       handleConfirmPasswordField("");
  //     } else if (userDetails.password !== confirmPassword) {
  //       handleConfirmPasswordField("Both Passwords Need To Be Same");
  //     }
  //   })();
  // }, [confirmPassword, userDetails.password]);

  const CheckIfUserExists = async (mail) => {
    try {
      let res = await AuthApi.checkUserExists(mail);
      if (res) setUserExists("Looks Good !");
    } catch (error) {
      console.log("error is ", error);
      setUserExists("Email Already Registered");
    }
  };

  const handleEmailChange = async (e) => {
    if (!emailRegExp.test(e.target.value)) {
      setAlertMessageEmail("Invalid Email type");
    } else if (emailRegExp.test(e.target.value)) {
      setAlertMessageEmail("");
    } else if (e.target.value && e.target.value.length > 70)
      setAlertMessageEmail("Maximum length is 70 characters.");
    else {
      setAlertMessageEmail("");
    }
    setUserDetails({ ...userDetails, emailid: e.target.value });
    CheckIfUserExists(e.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      setIsLoading(false);
      e.preventDefault();
      e.stopPropagation();
      if (userDetails.password === "") {
        setAlertMessagePassword("Password is mandatory.");
      }
      if (alertMessageEmail.length > 0) {
        return;
      }
      // if (userDetails && userDetails.phoneno.length < 12) {
      //   setIsPhoneInValid(true);
      // }
      if (userDetails.emailid === "") {
        return setAlertMessageEmail("Email is mandatory.");
      }
    } else {
      // if (userDetails && userDetails.phoneno.length < 12) {
      //   setIsPhoneInValid(true);
      //   setIsLoading(false);
      //   return true;
      // }
      // if(confirmPassword && userDetails.password !== confirmPassword){
      //   setIsLoading(false);
      //    return true
      // }
      if (
        alertMessageEmail === "Invalid Email type" ||
        alertMessagePassword === "Invalid Password"
      ) {
        setIsLoading(false);
        return true;
      }
      try {
        let dataToSend = { ...userDetails, information: information, invite };
          dispatch(register(dataToSend));
          setIsLoading(false);
          // location.search = "";
          if(userInviteDetails?.invitedOrgId) 
            localStorage.setItem("selectedOrg", userInviteDetails?.invitedOrgId);
      } catch (error) {
        setIsLoading(false);
        console.log("Error Is " + error);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (


    <div className="container">
      {isLoader ? (
        <div className="loader-container h-100 w-100 d-flex align-items-center flex-column justify-content-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col col-xl-6 col-md-8 col-sm-10">
            <div className="text-center">
              <img
                style={{ height: "100px" }}
                src={Logo}
                className="profile-image-pic  mt-5"
                alt="profile"
              />
            </div>
            <div className="card mb-5 mt-2" style={{ maxWidth: "550px" }}>
              <Container component="main" sx={{ padding: "30px" }}>
                <Box
                  sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <h3 className="text-center text-dark">Register</h3>
                  <CForm
                    noValidate
                    validated={validated}
                    className="d-flex flex-column card-body cardbody-color p-lg-4"
                    onSubmit={handleRegister}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <CFormInput
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
                          value={userDetails.firstname}
                          onChange={(e) =>
                            setUserDetails({
                              ...userDetails,
                              firstname: e.target.value,
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CFormInput
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
                          value={userDetails.lastname}
                          onChange={(e) =>
                            setUserDetails({
                              ...userDetails,
                              lastname: e.target.value,
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <CFormInput
                          required
                          fullWidth
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          type="email"
                          className="form-control input-style"
                          id="email"
                          aria-describedby="emailHelp"
                          placeholder="Email"
                          value={userDetails.emailid}
                          onChange={handleEmailChange}
                          disabled={invite}
                          onBlur={() => CheckIfUserExists(userDetails.emailid)}
                        />

                        {alertMessageEmail !== "" && (
                          <div className="input-error-msg">{alertMessageEmail}</div>
                        )}

                        {userExists === "Looks Good !" ? (
                          <></>
                        ) : (
                          <span style={{ color: "#dc3545", fontSize: " .875em" }}>
                            {" "}
                            {userExists}
                          </span>
                        )}


                      </Grid>
                      <Grid item xs={12}>
                        <div style={{ position: "relative" }} className="mb-2 ">
                          <CFormInput
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            autoComplete="new-password"
                            type={passwordType}
                            className="form-control input-style"
                            id="password"
                            placeholder="Password"
                            value={userDetails.password}
                            onFocus={() => setPwModelVisible(true)}
                            onBlur={() => setPwModelVisible(false)}
                            onChange={(e) => {
                              setUserDetails({
                                ...userDetails,
                                password: e.target.value,
                              });
                            }}
                          />

                          <ValidatorModel visible={pwModelVisible}>
                            <PasswordValidator
                              inputText={userDetails.password}
                              setAlertMessagePassword={setAlertMessagePassword}
                            />
                          </ValidatorModel>
                          {userDetails.password !== "" && (
                            <div className="showHideButton" onClick={togglePassword}>
                              {passwordType === "password" ? (
                                <EyeInvisibleOutlined style={{ fontSize: "18px" }} />
                              ) : (
                                <EyeOutlined style={{ fontSize: "18px" }} />
                              )}
                            </div>
                          )}
                        </div>
                        {alertMessagePassword !== "" && (
                          <div className="input-error-msg">
                            {alertMessagePassword}
                          </div>
                        )}

                      </Grid>
                    </Grid>
                    <div className="text-center py-4">
                      <button type="submit" className="btn submit-btn-style w-100" style={{ height: "50px" }}>
                        {isLoading ? (
                          <CircularProgress size={24} style={{ color: "white" }} />
                        ) : (
                          "Register"
                        )}
                      </button>
                    </div>
                    <Grid container>
                      <Grid item>
                        <span className="mb-3">
                          Already have an account?{" "}
                          <NavLink
                            className={"highlight_onHover"}
                            to={!params ? "/login" : `/login${location.search}`}
                          >
                            Login
                          </NavLink>
                        </span>
                      </Grid>
                    </Grid>
                  </CForm>
                </Box>
              </Container>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}