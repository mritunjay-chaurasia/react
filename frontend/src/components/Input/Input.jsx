import { Tooltip } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";

const Input = ({
  onChange,
  name,
  placeholder,
  width,
  height,
  dynamicHeight,
  minHeight,
  type,
  style,
  onFocus,
  value,
  onBlur,
  option,
  disable,
  accept,
  multiple,
  message,
  messages,
  onKeyDown,
  defaultopt
}) => {
  const inputStyle = {
    width: width ? width : "420px",
    height: height ? height : "75px",
    borderRadius: "8px",
    padding: "15px",
    border: "1px solid #DCE6ED",
    background: "#FFFFFF",
    boxShadow: "inset 0px 6px 8px #EEF5FA",
    fontSize: "17px",
    color: "#2F3F4C",
    outline: 'none',
    minHeight: minHeight ? minHeight : "50px",
    ...style,
  }


  const textareaRef = useRef(null);
  const [textareaHeight, setTextareaHeight] = useState('auto');

  const adjustTextareaHeight = () => {
    const { scrollHeight, clientHeight } = textareaRef.current;
    setTextareaHeight(scrollHeight > clientHeight ? `${scrollHeight + 10}px` : 'auto');
  };

  useEffect(() => {
   if(type === "textbox" && dynamicHeight) adjustTextareaHeight()
  }, [])
  

  if (type === "file")
    return (
      <Tooltip title={message ? message : ""}>
        <div style={{ ...inputStyle, padding: "0", display: "flex" }}>
          <input
            style={{ height: "100%", margin: "18px 4px" }}
            name={name}
            placeholder={placeholder}
            type={type}
            onFocus={onFocus}
            onChange={onChange}
            value={value}
            onBlur={onBlur}
            accept={accept ? accept : ".doc,.pdf,.txt,.docs,.xlsx, .xls, .xml,.ods"}
            data-max-size="50"
            onKeyDown={onKeyDown}
            multiple={multiple ? multiple : false}
          />
          {messages ? <span style={{fontSize: "12px", margin: "8px 4px"}}>{messages[0]} <br/> {messages[1]} <br/> {messages[2]}</span> : null}
        </div>
      </Tooltip>
    )

  if (type === "dropdown")
    return (
      <select name={name} id={name} onChange={onChange} value={value}
        style={{ ...inputStyle, backgroundColor: `${disable ? "#f2f2f2" : inputStyle.background || inputStyle.backgroundColor}` }} disabled={disable}>
        <option>{defaultopt ? defaultopt : "Select"}</option>
        {option.map((item, i) => <option key={i} value={name === "questionInput" ? item.question : item.toolname}>{name === "questionInput" ? item.question : item.visiblename}</option>)}
      </select>
    )

  if (type === "textbox")
    return (
      <textarea
        ref={textareaRef}
        // style={{...inputStyle, backgroundColor: `${disable ? "#f2f2f2" : inputStyle.background || inputStyle.backgroundColor}`}}
        style={{...inputStyle, height: height ? height : dynamicHeight ? textareaHeight : "75px"}}
        name={name}
        placeholder={placeholder}
        type={""}
        onFocus={onFocus}
        value={value}
        onBlur={onBlur}
        disabled={disable}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    )

  return (
    <input
      className="customTextInput"
      // style={{...inputStyle, backgroundColor: `${disable ? "#f2f2f2" : inputStyle.background || inputStyle.backgroundColor}`}}
      style={inputStyle}
      name={name}
      placeholder={placeholder}
      type={""}
      onFocus={onFocus}
      onChange={onChange}
      value={value}
      onBlur={onBlur}
      disabled={disable}
      onKeyDown={onKeyDown}
    />
  );
};

export default Input;
