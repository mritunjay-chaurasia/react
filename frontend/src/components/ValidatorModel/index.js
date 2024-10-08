import React from "react";
import './style.css'
const ValidatorModel = ({ visible, children }) => {
  return (
    <>
      {visible ? (
        <div className="pwvalidator-div">
          <div className="pwvalidator-triangle"></div>
          <div className="pwvalidator-inner-div">{children}</div>
        </div>
      ) : null}
    </>
  );
};

export default ValidatorModel;
