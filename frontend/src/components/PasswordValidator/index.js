import React from "react";

import CheckInCircle from "../CheckInCircle";

let validationTexts = [
  { pos: 1, text: "8 Characters" },
  // { pos: 2, text: "Letter" },
  { pos: 2, text: "Uppercase Letter" },
  { pos: 3, text: "Lowercase Letter" },
  { pos: 4, text: "Special Character" },
  { pos: 5, text: "Number" },
];

const ValidationField = ({ textObj, inputText, setAlertMessagePassword }) => {
  const capRegex = /[A-Z]/;
  const smallRegex = /[a-z]/;
  const numRegex = /[0-9]/;
  const specialRegex = /[-!$%^&*()_+|~=`{}[\]:;/<>?,.@#]/;

  // var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  let eightChar = false;
  let capLetter = false;
  let smallLetter = false;
  // let letter = false;
  let specialChar = false;
  let number = false;

  if (inputText.length > 8) eightChar = true;
  // if (/[a-zA-Z]/.test(inputText)) letter = true;
  if (capRegex.test(inputText)) capLetter = true;
  if (smallRegex.test(inputText)) smallLetter = true;
  if (specialRegex.test(inputText)) specialChar = true;
  if (numRegex.test(inputText)) number = true;

  if (eightChar && capLetter && smallLetter && specialChar && number) {
    if (inputText.indexOf(" ") >= 0)
      setAlertMessagePassword("Password shouldn't contain black space");
    else setAlertMessagePassword("");
  } else {
    setAlertMessagePassword("Invalid Password");
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <CheckInCircle
        style={{ width: "15px", height: "15px" }}
        bgColor={
          (textObj.pos == 1 && eightChar) ||
          // (textObj.pos == 2 && letter) ||
          (textObj.pos == 2 && capLetter) ||
          (textObj.pos == 3 && smallLetter) ||
          (textObj.pos == 4 && specialChar) ||
          (textObj.pos == 5 && number)
            ? "turcose"
            : "grey"
        }
      />
      <p
        style={{
          fontSize: "15px",
          fontWeight: "400",
          color: "#708390",
          margin: "0 0 0 8px",
        }}
      >
        {textObj.text}
      </p>
    </div>
  );
};

const PasswordValidator = ({ inputText, setAlertMessagePassword }) => {
  return (
    <>
      {validationTexts && validationTexts.length > 0 && validationTexts.map((textObj, i) => (
        <ValidationField
          textObj={textObj}
          inputText={inputText}
          setAlertMessagePassword={setAlertMessagePassword}
          key={i}
        />
      ))}
    </>
  );
};

export default PasswordValidator;
