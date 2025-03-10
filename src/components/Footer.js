import React from "react";
import Link from "next/link";
import { FaTwitter, FaTelegram, FaDiscord, FaGithub } from "react-icons/fa";
import styles from "@/styles/footer.module.css"; 

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.footerText}>© {new Date().getFullYear()} NordBalticum. All Rights Reserved.</p>
        <div className={styles.footerIcons}>
          <Link href="https://twitter.com/NordBalticum" target="_blank">
            <FaTwitter className={styles.icon} />
          </Link>
          <Link href="https://t.me/NordBalticum" target="_blank">
            <FaTelegram className={styles.icon} />
          </Link>
          <Link href="https://discord.gg/NordBalticum" target="_blank">
            <FaDiscord className={styles.icon} />
          </Link>
          <Link href="https://github.com/NordBalticum" target="_blank">
            <FaGithub className={styles.icon} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
