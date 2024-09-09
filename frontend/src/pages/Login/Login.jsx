import Logo from "../../assets/images/astorai-logo.png";
import "./login.css";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/user/actions";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { CircularProgress } from "@mui/material";
import * as inviteApi from "../../api/invite.api";
import { showNotification } from "../../utils/notification";
import { useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();

  //hooks for password show and hide
  const [passwordType, setPasswordType] = useState("password");
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const [userInviteDetails, setUserInviteDetails] = useState({});
  const { isSuccess, userInfo } = useSelector((state) => state.user);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const invite = params.get("invite");
  const [isLoader, setIsLoader] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        if (invite) {
          const response = await inviteApi.checkIfInvited(invite);
          if (response.status) {
            setUserInviteDetails(response.inviteDetails)
            setUserDetails({
              ...userDetails,
              email: response.inviteDetails.invitedUserEmailId,
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
            "Some error occurred, please try again later"
          );
        }
      }
    })();
  }, [invite]);
  

  useEffect(() => {
    if((!isSuccess && !userInfo?.id)){
      setTimeout(() => {
        setIsLoader(false);
      }, 1000);
    }
  }, [isSuccess]);

  const fillUserDetails = (data, field) => {
      setUserDetails({
        ...userDetails,
        [field]: data,
      });
  };

  // toggle password show or hide
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();

    const data = {
      emailid: userDetails.email,
      password: userDetails.password,
      invite,
    };
    dispatch(login(data));
    setLoading(false);
    if(userInviteDetails?.invitedOrgId) 
      localStorage.setItem("selectedOrg", userInviteDetails?.invitedOrgId);
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
            <div className="card mb-5 mt-2 marginHandler">
              <form
                className="d-flex flex-column card-body cardbody-color p-lg-4"
                onSubmit={handleLogin}
              >
                <h3 className="text-center">Login</h3>
                <div className="mb-3">
                  <label htmlFor="user-email">Email</label>
                  <input
                    type="text"
                    className="form-control input-style"
                    id="user-email"
                    aria-describedby="emailHelp"
                    placeholder="Email"
                    value={userDetails.email}
                    onChange={(e) =>
                      fillUserDetails(e.target.value, "email")
                    }
                    disabled={invite}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password">Password</label> <br />
                  <div style={{ position: "relative" }}>
                    <input
                      required
                      type={passwordType}
                      className="form-control input-style"
                      id="password"
                      placeholder="password"
                      value={userDetails.password}
                      onChange={(e) =>
                        fillUserDetails(e.target.value, "password")
                      }
                    />
                    <div className="showHideButton" onClick={togglePassword}>
                      {passwordType === "password" ? (
                        <EyeInvisibleOutlined />
                      ) : (
                        <EyeOutlined />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-1">
                  <span>
                    Don't have an account?{" "}
                    <NavLink
                      to={
                        !params ? "/register" : `/register${location.search}`
                      }
                      // state={{ data: location.state?.data }}
                    >
                      <span className="highlight_onHover">Signup</span>
                    </NavLink>
                  </span>
                </div>
                <div className="mb-3">
                  <span>
                    <NavLink
                      to="/forgetpassword"
                      // state={{ data: location.state?.data }}
                    >
                      <span className="highlight_onHover">Forget Password</span>
                    </NavLink>
                  </span>
                </div>
                <button type="submit" className="btn submit-btn-style">
                  {loading ? (
                    <CircularProgress size={24} style={{ color: "white" }} />
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
