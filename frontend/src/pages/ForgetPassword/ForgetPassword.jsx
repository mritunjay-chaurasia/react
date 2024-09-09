import React, { useState, useEffect, useRef } from "react";
import * as AuthApi from "../../api/auth.api";
import "./forgetpassword.css";
import { showNotification } from "../../utils/notification";
import { CircularProgress } from "@mui/material";
import Logo from "../../assets/images/astorai-logo.png";
/**
 * This Page is getting used for Starting Reset password
 * @params = None
 * @response : None
 * @author : Mandeep Singh
 */
function ForgetPassword() {
  const email = useRef();
  const [isLoader, setIsLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoader(false);
    }, 500);
  }, []);
  const handlePasswordReset = async () => {
    try {
      let response = await AuthApi.resetPassword(email.current.value);
      if (response.status)
        showNotification(
          "success",
          "An email is sent with the link to reset password. Please check"
        );
      else showNotification("error", "theirs an error");
    } catch (error) {
      if (error?.response?.data) {
        console.log(error);
        showNotification("error", error.response.data.message);
      }
    }
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
              <form className="d-flex flex-column card-body cardbody-color p-lg-4">
                <h3 className="text-center">Forget Password</h3>
                <div className="mb-3">
                  <label htmlFor="Username">Email</label>
                  <input
                    type="text"
                    className="form-control input-style"
                    id="Username"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    ref={email}
                  />
                </div>
                <button
                  onClick={handlePasswordReset}
                  type="button"
                  className="btn submit-btn-style"
                >
                  Reset Password
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgetPassword;
