// src/pages/Welcome.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface WelcomeProps {
  mode: "light" | "dark";
  toggleMode: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ mode, toggleMode }) => {
  const navigate = useNavigate();

  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const buttonStyle = (btn: string): React.CSSProperties => ({
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    width: "200px",
    backgroundColor: hoveredBtn === btn ? "#0056b3" : "#007bff",
    color: "white",
    transition: "0.3s",
    fontWeight: "bold",
    boxShadow:
      hoveredBtn === btn
        ? "0px 4px 12px rgba(0,0,0,0.25)"
        : "0px 2px 6px rgba(0,0,0,0.15)",
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Campus Portal</h1>
      <p style={styles.subtitle}>
        Your digital gateway to campus services, academics, and student life.
      </p>

      <div style={styles.buttonContainer}>
        <button
          style={buttonStyle("login")}
          onMouseEnter={() => setHoveredBtn("login")}
          onMouseLeave={() => setHoveredBtn(null)}
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        <button
          style={buttonStyle("signup")}
          onMouseEnter={() => setHoveredBtn("signup")}
          onMouseLeave={() => setHoveredBtn(null)}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>

        <button
          style={buttonStyle("contact")}
          onMouseEnter={() => setHoveredBtn("contact")}
          onMouseLeave={() => setHoveredBtn(null)}
          onClick={() => navigate("/contact")}
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
  },

  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#0d47a1",
    marginBottom: "1rem",
  },

  subtitle: {
    fontSize: "1.2rem",
    color: "#1a237e",
    marginBottom: "2.5rem",
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    alignItems: "center",
  },
};

export default Welcome;
