import React from "react";
import PropTypes from "prop-types";
import "../styles/Buttons.css";

export const PrimaryButton = ({ text, onClick }) => {
  return (
    <button className="button primary-button animated-fadeIn" onClick={onClick}>
      {text}
    </button>
  );
};

export const SecondaryButton = ({ text, onClick }) => {
  return (
    <button className="button secondary-button animated-fadeIn" onClick={onClick}>
      {text}
    </button>
  );
};

PrimaryButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

SecondaryButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
