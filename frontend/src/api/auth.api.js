import apiClient from "./index";

export async function login(data) {
  return apiClient.post("/user/login", data).then((response) => {
    return response?.data;
  });
}

export async function register(data) {
  return apiClient.post("/user/register", data).then((response) => {
    return response.data;
  });
}

export async function getCurrentUser() {
  return apiClient.get("/user/getme").then((response) => {
    return response?.data;
  });
}

/**
* This Function Starts reset password Procedure with email link
* @params = email:String 
* @response : JSON
* @author : Mandeep Singh
*/
export async function resetPassword(email) {
  return apiClient
    .post("/user/resetpassword", { email: email })
    .then((response) => {
      if (response) {
        return response.data;
      }
    });
}

/**
* This Function handle updatePassword API for user reset password with email link
* @params = code:String/JWT email:String password:String
* @response : JSON
* @author : Mandeep Singh
*/
export const updatePassword = async (code, email, password) => {
  try {
    const response = await apiClient.post("/user/updatePassword", {
      code: code,
      email: email,
      password: password,
    });
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export async function checkUserExists(emailid) {
  return apiClient.post("/user/findUserExist", { emailid }).then((response) => {
    if (response && response.data && response.data) {
      return response.data;
    }
    return false;
  });
}

/**
 * This Function Update user details from Profile Settings
 * @params = firstname, lastname, source, emailid, phoneno, usertype (all from body)
 * @response : JSON
 * @author : Mandeep Singh
 */
export const updateUser = async (
  firstname,
  lastname,
  source,
  emailid,
  // phoneno,
  usertype
) => {
  return apiClient
    .put("/user/update", {
      firstname: firstname,
      lastname: lastname,
      source: source,
      emailid: emailid,
      // phoneno: phoneno,
      usertype: usertype,
    })
    .then((response) => {
      if (response && response.data) {
        return response.data;
      }
      return false;
    });
};

/**
 * This Function Sends Verification Emails
 * @params = data:Object(email:String)
 * @response : JSON
 * @author : Mandeep Singh
 */
export const sendVerifyEmail = async (data) => {
  return apiClient.post("/user/sendVerifyEmail", data).then((response) => {
    return response?.data;
  });
};

/**
 * This Function Update user Password from Profile Settings
 * @params = email:String ,oldPassword:String, newPassword:String
 * @response : JSON
 * @author : Mandeep Singh
 */
export const changePasswordFromProfile = async (
  email,
  oldPassword,
  newPassword
) => {
  return apiClient
    .post(`/user/changePasswordFromProfile`, {
      email,
      oldPassword,
      newPassword,
    })
    .then((response) => {
      return response.data;
    });
};

/**
* This Function Change The Status Of Account Email Verification 
* @params = email:String, verificationKey:JWT(From query string), verificationStatus:Boolean
* @response : JSON
* @author : Mandeep Singh
*/
export const updateEmailVerifyStatus = async (email, verificationKey) => {
  return apiClient.post("/user/updateEmailVerifyStatus", {
    email: email,
    verificationKey: verificationKey
  }).then(response => {
    return response?.data;
  });
};
