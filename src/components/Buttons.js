import React from "react";
import PropTypes from "prop-types";
import "../styles/buttons.css";

export const Button = ({ type = "primary", onClick, children, fullWidth }) => {
  return (
    <button
      className={`button ${type} ${fullWidth ? "full-width" : ""} animated-fadeIn`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["primary", "secondary", "tertiary"]),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  fullWidth: PropTypes.bool,
};
