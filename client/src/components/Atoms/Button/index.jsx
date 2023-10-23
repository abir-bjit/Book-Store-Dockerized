import React from "react";

const Button = ({ className, text, onClick, btnType }) => {
  return <button className={className} onClick={onClick} type={btnType ? btnType : "button"}>{text ? text : "Click"}</button>;
};

export default Button;
