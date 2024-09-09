import React, { useEffect, useState } from "react";
import "./verify.css";
import { showNotification } from "../../utils/notification";
import * as AuthApi from "../../api/auth.api";
import { useDispatch, useSelector } from "react-redux";

/**
 * @params = emailWasSent:Bool and email:string from database
 * @response : Component
 * @author : Mandeep Singh
 */
function Verify() {
  const { userInfo } = useSelector((state) => state.user);
  const [notificationSent, setNotificationSent] = useState(false);

  // useEffect(() => {
  //   if (userInfo?.emailWasSent) setNotificationSent(true);
  // }, [userInfo]);

  const handleVerificationEmailButton = async () => {
    setNotificationSent(true);
    try {
      const response = await AuthApi.sendVerifyEmail({ email: userInfo?.emailid });
      if (response && response.status) {
        showNotification("success", "An email sent with link. Please Check");
      }
    } catch (error) {
      if (error.message) {
        showNotification("error", error?.message);
      } else {
        showNotification("error", "Some Error occurred, please try again later.");
      }
    }
  };
  return (
    <>
      {!notificationSent ? (
        <div id="verificationEmailNotificationHolder">
          Please verify your account.
          <button
            onClick={handleVerificationEmailButton}
            className="verificationEmailButton"
          >
            Click Here
          </button>
          to resend Verification Email
        </div>
      ) 
      : 
      null
      // (
      //   <div id="verificationEmailNotificationHolder">
      //     An email for verification was sent successfully,Didn't get..?
      //     <button
      //       onClick={handleVerificationEmailButton}
      //       className="verificationEmailButton"
      //     >
      //       Resend Email
      //     </button>
      //     to verify
      //   </div>
      // )
      }
    </>
  );
}

export default Verify;
