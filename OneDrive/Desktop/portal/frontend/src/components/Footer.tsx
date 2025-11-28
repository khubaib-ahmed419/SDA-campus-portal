import React from "react";

  interface FooterProps {
    mode: "light" | "dark";
    toggleMode: () => void;
  }


const Footer: React.FC<FooterProps> = ({ mode, toggleMode }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    footer: {
      width: "100%",
      padding: "0.75rem 1rem",
      textAlign: "center" as "center",
      borderTop: "1px solid #e5e7eb", // gray-200
      backgroundColor: "#ffffff",
      color: "#4b5563", // gray-700
      fontSize: "0.875rem",
    },
    footerDark: {
      borderTop: "1px solid #374151",
      backgroundColor: "#1f2937",
      color: "#9ca3af",
    },
    brand: {
      color: "#1d4ed8",
      fontWeight: 600,
    },
  };

  const isDarkMode = false; // replace with theme state if needed

  return (
    <footer style={{ ...styles.footer, ...(isDarkMode ? styles.footerDark : {}) }}>
      © {new Date().getFullYear()} <span style={styles.brand}>Campus Portal</span>. All Rights Reserved.
    </footer>
  );
};

export default Footer;
