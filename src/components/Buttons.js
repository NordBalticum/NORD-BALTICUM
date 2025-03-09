import React from "react";
import styles from "@/styles/buttons.module.css"; // Importuojame mygtukų stilius iš `buttons.css`

const Button = ({ text, onClick, type = "primary", size = "medium", fullWidth = false, disabled = false }) => {
  const buttonClasses = `
    ${styles.button} 
    ${styles[type] || styles.primary} 
    ${styles[size] || styles.medium} 
    ${fullWidth ? styles.fullWidth : ""}
    ${disabled ? styles.disabled : ""}
  `;

  return (
    <button className={buttonClasses} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
