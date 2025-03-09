const Button = ({ 
  type = "primary", 
  size = "medium", 
  className = "", 
  children, 
  onClick, 
  disabled = false 
}) => {
  return (
    <button 
      className={`button ${type} ${size} ${className}`} 
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
