import PropTypes from "prop-types";
import "@/styles/buttons.module.css";

const Button = ({ 
  type = "primary", 
  size = "medium", 
  className = "", 
  children, 
  onClick, 
  disabled = false 
}) => {
  // ✅ Tikriname, ar `type` yra tinkamas
  const validTypes = ["primary", "secondary", "danger"];
  const buttonType = validTypes.includes(type) ? type : "primary";

  // ✅ Tikriname, ar `size` yra tinkamas
  const validSizes = ["small", "medium", "large"];
  const buttonSize = validSizes.includes(size) ? size : "medium";

  return (
    <button 
      className={`button ${buttonType} ${buttonSize} ${className}`.trim()} 
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// ✅ PROPTYPES VALIDACIJA
Button.propTypes = {
  type: PropTypes.oneOf(["primary", "secondary", "danger"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default Button;
