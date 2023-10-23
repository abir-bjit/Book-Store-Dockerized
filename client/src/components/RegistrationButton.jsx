import React from "react";
import { useNavigate } from "react-router-dom";

const RegistrationButton = ({ className, text, onClick }) => {
  const navigate = useNavigate();

  const handleRegistration = () => {
    navigate("/registration");
  };
  return (
    <button className={className} onClick={handleRegistration}>
      {text ? text : "Click"}
    </button>
  );
};

export default RegistrationButton;
