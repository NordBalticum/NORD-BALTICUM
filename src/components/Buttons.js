import React from "react";
import "../styles/buttons.css";

const Button = ({ text, onClick, type = "primary" }) => {
  return (
    <button className={`custom-button ${type}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
