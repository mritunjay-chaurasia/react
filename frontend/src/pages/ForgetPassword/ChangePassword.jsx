import React, { useRef, useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { useNavigate, useParams, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { showNotification } from "../../utils/notification";
import { CircularProgress } from "@mui/material";
import { updatePassword } from "../../api/auth.api";
import "./forgetpassword.css";
import Logo from "../../assets/images/astorai-logo.png";

/**
 * This Page is getting used for changing/updating password
 * @params = None
 * @response : None
 * @author : Mandeep Singh
 */
function ChangePassword() {
  const [password, setPassword] = useState("");
  const [passValid, setPassValid] = useState(false);
  const confirmPassword = useRef();

  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoader, setIsLoader] = useState(true);
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      if (
        password.trim().length <= 0 ||
        confirmPassword.current.value.trim().length <= 0 ||
        password !== confirmPassword.current.value ||
        password.trim().length < 8 ||
        !passValid
      ) {
        showNotification("error", "Both Password Must Match");
        return;
      }

      const decode = jwt_decode(id);
      let response = await updatePassword(id, decode.id, password);
      if (response.status) {
        showNotification(
          "success",
          "Password Update Successfully, Please Login To Continue"
        );
      } else {
        showNotification("error", "Link Invalid Or Expired");
      }

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.log(error);
      showNotification("error", "Link Invalid Or Expired");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoader(false);
    }, 500);
  }, []);

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
        " Both Password Must Match,Contains at least one digit ,one special character and length between 8 and 16 characters."
      );
    } else {
      passwordId.setCustomValidity("");
    }
    setPassValid(v);
  };

  return (
    <>
      {isLoader ? (
        <div className="loader-container h-100 w-100 d-flex align-items-center flex-column justify-content-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="formHolder">
          <div className="change-password">
            <div className="text-center">
              <img
                style={{ height: "100px" }}
                src={Logo}
                className="profile-image-pic mt-5"
                alt="logo"
              />
            </div>
            <div className="card mb-5 mt-2 marginHandler">
              <form
                onSubmit={handleUpdatePassword}
                className="d-flex flex-column card-body cardbody-color p-lg-4"
              >
                <h2 className="text-center">Update Password</h2>
                <div className="mb-3">
                  <label htmlFor="password"> Password</label>
                  <input
                    onChange={(e) => checkPassword(e.target.value)}
                    required
                    id="passwordId"
                    className="form-control input-style"
                    type="text"
                    placeholder="New Password"
                  ></input>
                </div>

                <div className="mb-3">
                  <label htmlFor="cPassword">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    required
                    className="form-control input-style"
                    ref={confirmPassword}
                    type="text"
                    placeholder="Confirm Password"
                  ></input>
                </div>

                <div className="d-flex flex-column justify-content-center align-items-center">
                  <Button type="submit" className="resetButton text-capitalize">
                    Save
                  </Button>
                  <Link to="/login">
                    <span className="login-url">Login</span>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default ChangePassword;
