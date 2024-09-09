import React from "react";
import { notification } from 'antd';

/**
* This is a util function to show notification on top right corner
* @params : type(Type: String('success' || 'info' || 'warning' || 'error')), header(Type: String), message(Type: String)
* @response : It'll show notification on top right corner according to the type it'll be success, info, warning or error
* @author : Milan Rawat
*/

export const showNotification = (type, header, time, btn, message) => {
  const key = `open${Date.now()}`;
  console.log(btn)
  const handleButtonClick = () => {
    notification.destroy(key);
    btn.props.onClick()
  };
  const buttonWithOnClick = btn ? React.cloneElement(btn, { onClick: handleButtonClick }) : <></>


  notification[type]({
    message: header,
    description: message,
    btn: buttonWithOnClick,
    key: key,
    onClose: () => notification.destroy(key)
  });
  notification.config({
    duration: time ? time : 4,
  })
};