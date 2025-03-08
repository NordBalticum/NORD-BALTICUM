import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import "@/styles/buttons.module.css";

const Buttons = forwardRef(
  (
    { 
      type = "primary", 
      onClick, 
      children, 
      icon, 
      fullWidth = false, 
      size = "medium", 
      disabled = false, 
      className = "" 
    }, 
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`button ${type} ${size} ${fullWidth ? "full-width" : ""} ${disabled ? "disabled" : ""} ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {icon && <span className="button-icon">{icon}</span>}
        <span className="button-text">{children}</span>
      </button>
    );
  }
);

// ✅ Props validacija
Buttons.propTypes = {
  type: PropTypes.oneOf(["primary", "secondary", "outline", "ghost"]),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

// ✅ Default reikšmės
Buttons.defaultProps = {
  type: "primary",
  fullWidth: false,
  size: "medium",
  disabled: false,
  className: "",
};

// ✅ Eksportuojame kaip default
export default Buttons;
