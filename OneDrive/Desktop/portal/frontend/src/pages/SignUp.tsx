// src/pages/SignUp.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

interface SignUpProps {
  mode: "light" | "dark";
  toggleMode: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ mode, toggleMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    rollNo: "",
    degreeId: "",
    campusId: "",
    batch: "",
    password: "",
  });
  const [degrees, setDegrees] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const degRes = await axios.get("http://localhost:5000/api/utility/degrees");
        const camRes = await axios.get("http://localhost:5000/api/utility/campuses");

        setDegrees(degRes.data.map((d: any) => ({
  id: d._id,
  name: d._name,
  major: d._major
})));

setCampuses(camRes.data.map((c: any) => ({
  id: c._id,
  name: c._name,
  location: c._location
})));

      } catch (error) {
        console.log(error);
        setMessage("Failed to load degrees or campuses. Check server.");
      }
    };
    fetchData();


  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/students/signup", formData);

      // Save token to localStorage for auto-login
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "student");
      localStorage.setItem("user", JSON.stringify(res.data.user));


      setMessage(res.data.message);

      // Redirect using navigate
      navigate("/student/dashboard");
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Error registering student");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Student Sign Up</h2>
        {message && <p style={styles.message}>{message}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" name="name" placeholder="Full Name*" style={styles.input} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email*" style={styles.input} onChange={handleChange} required />
          <input type="text" name="contact" placeholder="11-digit Contact No" style={styles.input} onChange={handleChange} />
          <input type="text" name="rollNo" placeholder="Roll Number*" style={styles.input} onChange={handleChange} required />

          <select name="degreeId" style={styles.input} onChange={handleChange} required>
            <option value="">Select Degree*</option>
            {degrees.map((d) => (
              <option key={d.id} value={d.id}>{d.name} — {d.major}</option>
            ))}
          </select>

          <select name="campusId" style={styles.input} onChange={handleChange} required>
  <option value="">Select Campus*</option>
  {campuses.map((c) => (
    <option key={c.id} value={c.id}>{c.name} — {c.location}</option>

  ))}
</select>


          <input type="text" name="batch" placeholder="Batch (e.g. 2021)*" style={styles.input} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password*" style={styles.input} onChange={handleChange} required />

          <button type="submit" style={styles.button}>Register Student</button>
        </form>

        <div style={{ marginTop: "1rem" }}>
          <Link to="/login" style={styles.link}>Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: "100vh", padding: "2rem 0", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #e3f2fd, #bbdefb)" },
  card: { background: "white", padding: "2rem", width: "380px", borderRadius: "12px", boxShadow: "0px 4px 12px rgba(0,0,0,0.15)", textAlign: "center" },
  title: { fontSize: "1.8rem", marginBottom: "1rem", color: "#0d47a1" },
  message: { marginBottom: "1rem", color: "green", fontWeight: "bold" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  input: { padding: "0.8rem", borderRadius: "8px", border: "1px solid #90caf9", fontSize: "1rem" },
  button: { padding: "0.9rem", borderRadius: "8px", border: "none", backgroundColor: "#0d47a1", color: "white", fontSize: "1.1rem", cursor: "pointer", transition: "0.3s" },
  link: { color: "#0d47a1", textDecoration: "none", fontSize: "0.9rem" },
};

export default SignUp;
