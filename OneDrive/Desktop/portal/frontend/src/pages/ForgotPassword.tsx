// src/pages/ForgotPassword.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ForgotPasswordProps {
      mode: "light" | "dark";
    toggleMode: () => void;
}


const ForgotPassword: React.FC<ForgotPasswordProps> = ({ mode, toggleMode }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/users/forgot-password", { email });
      setMessage(res.data.message);
      setStep(2); // Move to OTP step
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Error sending OTP");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/users/verify-otp", { email, otp });
      setMessage(res.data.message);
      setStep(3); // Move to reset password step
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Invalid OTP");
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/users/reset-password", { email, newPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 1500); // redirect to login
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Error resetting password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>
        {message && <p style={styles.message}>{message}</p>}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSendOTP} style={styles.button}>Send OTP</button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              style={styles.input}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOTP} style={styles.button}>Verify OTP</button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter New Password"
              style={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleResetPassword} style={styles.button}>Reset Password</button>
          </>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
    padding: "2rem",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    width: "380px",
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  title: { fontSize: "1.8rem", marginBottom: "1rem", color: "#0d47a1" },
  message: { marginBottom: "1rem", color: "green", fontWeight: "bold" },
  input: { padding: "0.8rem", borderRadius: "8px", border: "1px solid #90caf9", fontSize: "1rem", marginBottom: "1rem" },
  button: { padding: "0.9rem", borderRadius: "8px", border: "none", backgroundColor: "#0d47a1", color: "white", fontSize: "1.1rem", cursor: "pointer" },
};

export default ForgotPassword;
