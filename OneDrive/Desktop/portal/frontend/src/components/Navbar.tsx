import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, User } from "lucide-react";

interface NavbarProps {
  mode: "light" | "dark";
  toggleMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ mode, toggleMode }) => {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);

  const isDark = mode === "dark";

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const styles: { [key: string]: React.CSSProperties } = {
    nav: {
      width: "100%",
      padding: "0.5rem 1rem",
      display: "flex",
      justifyContent: "center",
      backgroundColor: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#d1d5db" : "#374151",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      fontFamily: "sans-serif",
    },
    container: {
      maxWidth: "1200px",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
    },
    brand: {
      fontSize: "1.5rem",
      fontWeight: 700,
      color: isDark ? "#60a5fa" : "#0d47a1",
      textDecoration: "none",
    },
    middle: {
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
      fontWeight: 500,
      fontSize: "0.95rem",
    },
    link: {
      textDecoration: "none",
      color: isDark ? "#d1d5db" : "#0d47a1",
      transition: "0.2s",
      cursor: "pointer",
    },
    right: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      position: "relative",
    },
    button: {
      padding: "0.35rem",
      borderRadius: "50%",
      cursor: "pointer",
      border: "none",
      backgroundColor: isDark ? "#374151" : "#e3f2fd",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "0.2s",
    },
    dropdown: {
      position: "absolute",
      right: 0,
      top: "2.5rem",
      width: "11rem",
      backgroundColor: isDark ? "#374151" : "#ffffff",
      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      borderRadius: "6px",
      overflow: "hidden",
      fontSize: "0.875rem",
      zIndex: 50,
    },
    dropdownItem: {
      padding: "0.5rem 1rem",
      cursor: "pointer",
      width: "100%",
      textAlign: "left" as const,
      borderBottom: isDark ? "1px solid #4b5563" : "1px solid #e5e7eb",
      transition: "0.2s",
      backgroundColor: "transparent",
      color: isDark ? "#d1d5db" : "#0d47a1",
    },
    logoutBtn: {
      color: isDark ? "#f87171" : "#b91c1c",
      borderBottom: "none",
    },
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Brand */}
        <Link to="/student/dashboard" style={styles.brand}>
          Campus Portal
        </Link>

        {/* Middle Tabs */}
        <div style={styles.middle}>
          {["FundRaise", "Lost & Found", "Study Groups"].map((tab) => (
            <Link
              key={tab}
              to={`/${tab.replace(/\s+/g, "").toLowerCase()}`}
              style={styles.link}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = isDark ? "#60a5fa" : "#2563eb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = isDark ? "#d1d5db" : "#0d47a1")
              }
            >
              {tab}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div style={styles.right}>
          <button style={styles.button} onClick={toggleMode}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div style={{ position: "relative" }}>
            <button
              style={styles.button}
              onClick={() => setOpenProfile(!openProfile)}
            >
              <User size={20} />
            </button>

            {openProfile && (
              <div style={styles.dropdown}>
                {["My Profile", "Notifications"].map((item) => (
                  <Link
                    key={item}
                    to={`/${item.replace(/\s+/g, "").toLowerCase()}`}
                    style={styles.dropdownItem}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark
                        ? "#1e40af"
                        : "#bbdefb";
                      e.currentTarget.style.color = isDark ? "#fff" : "#0d47a1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = isDark ? "#d1d5db" : "#0d47a1";
                    }}
                  >
                    {item}
                  </Link>
                ))}
                <button
                  style={{ ...styles.dropdownItem, ...styles.logoutBtn }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = isDark
                      ? "#b91c1c"
                      : "#fee2e2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
