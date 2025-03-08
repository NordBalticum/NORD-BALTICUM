import React, { forwardRef } from "react";
import PropTypes from "prop-types";

export const Button = forwardRef(
  ({ type = "primary", onClick, children, icon, fullWidth, size = "medium", disabled }, ref) => {
    return (
      <button
        ref={ref}
        className={`button ${type} ${size} ${fullWidth ? "full-width" : ""} ${disabled ? "disabled" : ""}`}
        onClick={onClick}
        disabled={disabled}
      >
        {icon && <span className="button-icon">{icon}</span>}
        <span className="button-text">{children}</span>
      </button>
    );
  }
);

Button.propTypes = {
  type: PropTypes.oneOf(["primary", "secondary", "outline", "ghost"]),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
};

Button.displayName = "Button";
