import React from "react";
import { FaTwitter, FaTelegram, FaGithub } from "react-icons/fa";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Nord Baltic. All Rights Reserved.</p>
        <div className="social-icons">
          <a href="https://twitter.com/nordbaltic" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://t.me/nordbaltic" target="_blank" rel="noopener noreferrer">
            <FaTelegram />
          </a>
          <a href="https://github.com/NordBalticum" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
