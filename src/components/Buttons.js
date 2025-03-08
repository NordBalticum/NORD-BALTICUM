import React from "react";
import PropTypes from "prop-types";
import "../styles/Buttons.css";

export const Button = ({ type = "primary", onClick, children, icon, fullWidth }) => {
  return (
    <button
      className={`button ${type} ${fullWidth ? "full-width" : ""}`}
      onClick={onClick}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["primary", "secondary", "outline", "ghost"]),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
  fullWidth: PropTypes.bool,
};
