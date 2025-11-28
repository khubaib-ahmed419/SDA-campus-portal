import React, { useEffect, useState } from "react";

interface DashboardProps {
    mode: "light" | "dark";
    toggleMode: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ mode, toggleMode }) => {
  const isDark = mode === "dark";

  const [studentCount, setStudentCount] = useState(0);
  const [fundraiserCount, setFundraiserCount] = useState(0);
  const [lostFoundCount, setLostFoundCount] = useState(0);
  const [studyGroupCount, setStudyGroupCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const students = await fetch(`${API_URL}/api/students/total`, { headers }).then(r => r.json());

        const fundraisers = await fetch(`${API_URL}/api/fundraise/total-approved`, { headers }).then(r => r.json());
        const lostFound = await fetch(`${API_URL}/api/lost-and-found/total-lostfound`, { headers }).then(r => r.json());
        const studyGroups = await fetch(`${API_URL}/api/study-groups/total-studygroups`, { headers }).then(r => r.json());

        setStudentCount(students?.totalStudents ?? 0);
        setFundraiserCount(fundraisers?.totalApprovedFundraisers ?? 0);
        setLostFoundCount(lostFound?.totalLostAndFound ?? 0);
        setStudyGroupCount(studyGroups?.studyGroups ?? 0);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Stat Card Component
  const statCard = (icon: string, title: string, value: number, suffix: string, color: string) => (
    <div style={{
      flex: "1 1 220px",
      display: "flex",
      alignItems: "center",
      backgroundColor: isDark ? "#1f2937" : "#fff",
      color: isDark ? "#d1d5db" : "#111827",
      padding: "1rem 1.2rem",
      borderRadius: "12px",
      margin: "0.5rem",
      boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.5)" : "0 4px 12px rgba(0,0,0,0.1)",
      transition: "0.3s",
    }}>
      <div style={{
        fontSize: "2rem",
        backgroundColor: color,
        color: "#fff",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "1rem"
      }}>{icon}</div>
      <div>
        <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>{title}</h4>
        <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: "bold" }}>
          {loading ? "..." : value} {suffix}
        </p>
      </div>
    </div>
  );

  // Quick Link Card Component
  const quickLinkCard = (text: string, color: string) => (
    <div style={{
      flex: "1 1 180px",
      textAlign: "center",
      backgroundColor: isDark ? "#374151" : "#f9fafb",
      color: isDark ? "#d1d5db" : "#111827",
      padding: "1rem",
      borderRadius: "10px",
      margin: "0.5rem",
      cursor: "pointer",
      boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.1)",
      transition: "0.2s",
    }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? "#2563eb" : "#0d47a1"}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDark ? "#374151" : "#f9fafb"}
    >
      <p style={{ margin: "0.5rem 0", fontWeight: 500 }}>{text}</p>
      <button style={{
        padding: "0.3rem 0.8rem",
        borderRadius: "6px",
        border: "none",
        backgroundColor: color,
        color: "#fff",
        cursor: "pointer"
      }}>Go</button>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      padding: "2rem",
      backgroundColor: isDark ? "#111827" : "#e3f2fd",
      color: isDark ? "#d1d5db" : "#111827",
      boxSizing: "border-box",
    }}>
      <h2 style={{ marginBottom: "1.5rem", fontSize: "2rem" }}>Dashboard</h2>

      {/* Stat Cards */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
        {statCard("👥", "Community Members", studentCount, "Active", "#2563eb")}
        {statCard("❤️", "Fundraisers", fundraiserCount, "Ongoing", "#dc2626")}
        {statCard("🔍", "Lost & Found", lostFoundCount, "Reports", "#facc15")}
        {statCard("📚", "Study Groups", studyGroupCount, "Active", "#16a34a")}
      </div>

      {/* Quick Links */}
      <h3 style={{ marginTop: "2rem", marginBottom: "1rem", fontSize: "1.4rem" }}>Quick Links</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {quickLinkCard("Study Groups", "#2563eb")}
        {quickLinkCard("Resources", "#16a34a")}
      </div>
    </div>
  );
};

export default Dashboard;
