import React from "react";
import { FaTwitter, FaTelegram, FaGithub } from "react-icons/fa";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Nord Balticum. All Rights Reserved.</p>
        <div className="social-icons">
          <a href="https://twitter.com/nordbaltic" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="social-icon" />
          </a>
          <a href="https://t.me/nordbaltic" target="_blank" rel="noopener noreferrer">
            <FaTelegram className="social-icon" />
          </a>
          <a href="https://github.com/NordBalticum" target="_blank" rel="noopener noreferrer">
            <FaGithub className="social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
