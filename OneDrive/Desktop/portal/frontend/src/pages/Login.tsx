import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

interface LoginProps {
  mode: "light" | "dark";
  toggleMode: () => void;
}

const Login: React.FC<LoginProps> = ({ mode, toggleMode }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", formData);

      // ✅ Store token and user info correctly
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId); // <-- this fixes the mismatch

      setMessage("Login successful!");

      if (res.data.role === "student") navigate("/student/dashboard");
      else if (res.data.role === "admin") navigate("/admin/dashboard");
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        {message && <p style={styles.message}>{message}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            style={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            style={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>

        <div style={styles.links}>
          <Link to="/signup" style={styles.link}>Don't have an account? Sign Up</Link>
          <Link to="/forgot-password" style={styles.link}>Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #e3f2fd, #bbdefb)", padding: "2rem" },
  card: { background: "#fff", padding: "2rem", width: "380px", borderRadius: "12px", boxShadow: "0px 4px 12px rgba(0,0,0,0.15)", textAlign: "center" },
  title: { fontSize: "1.8rem", marginBottom: "1rem", color: "#0d47a1" },
  message: { marginBottom: "1rem", color: "red", fontWeight: "bold" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  input: { padding: "0.8rem", borderRadius: "8px", border: "1px solid #90caf9", fontSize: "1rem" },
  button: { padding: "0.9rem", borderRadius: "8px", border: "none", backgroundColor: "#0d47a1", color: "white", fontSize: "1.1rem", cursor: "pointer", transition: "0.3s" },
  links: { marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" },
  link: { color: "#0d47a1", textDecoration: "none", fontSize: "0.9rem" },
};

export default Login;
