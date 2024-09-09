import React, { useState, useEffect } from "react";
import "./support.css";
import Logo from "../../assets/images/astorai-logo.png";
import Spinner from "react-bootstrap/Spinner";
import { showNotification } from "../../utils/notification";
import * as SupportApi from "../../api/support.api";
import { useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";

function Support() {
  const { userInfo } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    userId: userInfo?.id,
  });
  const [reValidation, setReValidation] = useState({
    IsNameValid: false,
    IsPhoneValid: false,
    IsMessageValid: false,
  });
  const [isloader, setisloader] = useState(false);
  const [alertMessageName, setAlertMessageName] = useState("");
  const [alertMessagePhone, setAlertMessagePhone] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleName = async (e) => {
    const re = /^[a-zA-ZÀ-ÖØ-öø-ÿ-' ]*$/;
    if (!re.test(String(e.target.value))) {
      setAlertMessageName("No numbers or special characters are allowed.");
      setFormData({ ...formData, name: e.target.value });
      setReValidation({ ...reValidation, IsNameValid: false });
      return;
    } else if (e.target.value && e.target.value.length > 30) {
      setAlertMessageName("Maximum length is 30 characters.");
      setFormData({ ...formData, name: e.target.value });
      setReValidation({ ...reValidation, IsNameValid: false });
      return;
    } else {
      setAlertMessageName("");
    }
    setReValidation({ ...reValidation, IsNameValid: true });
    setFormData({ ...formData, name: e.target.value });
  };


  const handlePhoneChange = (phone) => {
    setAlertMessagePhone("");
    setFormData({ ...formData, phone: phone });
    setReValidation({ ...reValidation, IsPhoneValid: true });
    if (phone && phone.length < 12) {
      // setAlertMessagePhone("Please enter a valid phone number.");
      setReValidation({ ...reValidation, IsPhoneValid: false });
    }
  };

  const handleChange = (e) => {
    if (e.target.value === "") {
      setAlertMessage("Please enter message.");
      setFormData({ ...formData, message: e.target.value });
      setReValidation({ ...reValidation, IsMessageValid: false });
    } else {
      setAlertMessage("");
      setReValidation({ ...reValidation, IsMessageValid: true });
      setFormData({ ...formData, message: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name.trim() === "") {
      return setAlertMessageName("Name is mandatory.");
    }

    if (formData.phone.trim() === "") {
      return setAlertMessagePhone("Phone number is mandatory.");
    }else if (formData.phone.length < 12) {
      return setAlertMessagePhone("Please enter a valid phone number.");
    }
    if (formData.message === "") {
      return setAlertMessage("Message is mandatory.");
    }
    try {
      const { IsNameValid, IsPhoneValid, IsMessageValid } = reValidation;
      if (IsNameValid && IsPhoneValid && IsMessageValid) {
        setisloader(true);
        const response = await SupportApi.createSupportUserAccount({
          data: formData,
        });
        if (response.success) {
          setisloader(false);
          showNotification(
            "success",
            "Message submitted, Support will contact in 24-48 Hours"
          );

          setFormData({
            name: "",
            phone: "",
            message: "",
            userId: response.userData.user,
          });
        }
      }
    } catch (err) {
      setisloader(false);
      showNotification("error", "Something went wrong", err);
    }
  };

  return (
    <div className="container main-div">
      <div className="inner-div">
        <div className="text-center">
          <img
            style={{ height: "100px"}}
            src={Logo}
            className="profile-image-pic"
            alt="profile"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row form-field">
            <div className="form-group">
              <label htmlFor="formGroupExampleInput">
                Name <span className="star-icon">*</span>
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleName}
              />
              {alertMessageName !== "" && (
                <div className="input-error-msg">{alertMessageName}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="formGroupExampleInput">
                Phone <span className="star-icon">*</span>
              </label>

              <PhoneInput
                className="input-field phoneNumber is-valid"
                country={"in"}
                required
                id="phone"
                placeholder="Phone"
                name="phone"
                value={formData.phone}
                onChange={(phone) => handlePhoneChange(phone)}
              />
              {alertMessagePhone !== "" && (
                <div className="input-error-msg">{alertMessagePhone}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlTextarea1">
                Message <span className="star-icon">*</span>
              </label>
              <textarea
                placeholder="Message here....."
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="4"
                name="message"
                onChange={handleChange}
                value={formData.message}
              ></textarea>
              {alertMessage !== "" && (
                <div className="input-error-msg">{alertMessage}</div>
              )}
            </div>
            <div className="btn-div">
              <button type="submit" className="submit-btn">
                {isloader ? <Spinner animation="border" /> : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Support;
