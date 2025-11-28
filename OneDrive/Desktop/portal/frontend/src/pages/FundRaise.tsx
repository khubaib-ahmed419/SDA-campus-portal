import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface FundRaiseProps {
  mode: "light" | "dark";
  toggleMode: () => void;
}

interface Fundraiser {
  _id: string;
  title: string;
  goalAmount: number;
  collectedAmount: number;
  status: string; // "ongoing" | "completed" | "cancelled"
}

const FundRaise: React.FC<FundRaiseProps> = ({ mode }) => {
  const isDark = mode === "dark";
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // Donation popup
  const [donationPopup, setDonationPopup] = useState<{ show: boolean; fundraiser?: Fundraiser }>({ show: false });
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [donationError, setDonationError] = useState("");

  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/fundraise/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        const data = await res.json();
        setFundraisers(data.fundraisers || []);
      } catch (err) {
        console.error("Failed to fetch fundraisers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFundraisers();
  }, []);

  const handleAddFundraiser = async () => {
    if (!title || !description || goalAmount <= 0) return alert("Title, description, and goal amount are required");
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/fundraise/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ title, description, goalAmount }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Fundraiser added! Waiting for admin approval.");
        setShowForm(false);
        setTitle("");
        setDescription("");
        setGoalAmount(0);
      } else {
        alert(data.message || "Error adding fundraiser");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDonate = async () => {
  const fundraiser = donationPopup.fundraiser!;
  const remaining = fundraiser.goalAmount - fundraiser.collectedAmount;

  if (!donationAmount || donationAmount <= 0 || donationAmount > remaining) {
    setDonationError(`Donation must be between 1 and $${remaining}`);
    return;
  }

  try {
    setDonationError("");
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/fundraise/donate/${fundraiser._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        fundraiserId: fundraiser._id,
        amount: donationAmount,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setDonationError(data.message || "Donation failed");
      return;
    }

    alert("Donation successful!");

    setDonationPopup({ show: false });
    setDonationAmount(0);

    setFundraisers((prev) =>
      prev.map((fr) =>
        fr._id === fundraiser._id
          ? {
              ...fr,
              collectedAmount: data.fundraiser.collectedAmount,
              status: data.fundraiser.status,
            }
          : fr
      )
    );
  } catch (error) {
    setDonationError("Server error. Please try again.");
  }
};


  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      minHeight: "100vh",
      padding: "2rem",
      backgroundColor: isDark ? "#111827" : "#e3f2fd",
      color: isDark ? "#d1d5db" : "#111827",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
    },
    title: { fontSize: "2rem", fontWeight: 600 },
    button: {
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      backgroundColor: isDark ? "#2563eb" : "#0d47a1",
      color: "#fff",
    },
    cardContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
      justifyContent: "center",
    },
    card: {
      width: "250px",
      padding: "1rem",
      borderRadius: "10px",
      backgroundColor: isDark ? "#1f2937" : "#fff",
      boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.5)" : "0 4px 12px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer",
    },
    progressBar: {
      height: "10px",
      borderRadius: "5px",
      backgroundColor: isDark ? "#374151" : "#e5e7eb",
      overflow: "hidden",
    },
    input: {
      padding: "0.5rem",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "1rem",
    },
  };

  const progressStyle = (percent: number) => ({
    width: `${percent}%`,
    height: "100%",
    backgroundColor: percent >= 100 ? "#16a34a" : "#2563eb",
    transition: "width 0.3s",
  });

  const statusStyle = (status: string) => ({
    fontWeight: 600,
    color:
      status.toLowerCase() === "completed"
        ? "#16a34a"
        : status.toLowerCase() === "cancelled"
        ? "#f87171"
        : "#facc15",
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Fundraisers</h2>
        <button style={styles.button} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Fundraiser"}
        </button>
      </div>

      {/* Add Fundraiser Form */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "400px",
              maxWidth: "90%",
              padding: "2rem",
              borderRadius: "10px",
              backgroundColor: isDark ? "#1f2937" : "#fff",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              position: "relative",
            }}
          >
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                color: isDark ? "#d1d5db" : "#111827",
              }}
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>

            <h3 style={{ textAlign: "center" }}>Add Fundraiser</h3>
            <input
              style={styles.input}
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              style={styles.input}
              type="number"
              placeholder="Goal Amount"
              value={goalAmount}
              onChange={(e) => setGoalAmount(parseFloat(e.target.value))}
            />
            <button style={styles.button} onClick={handleAddFundraiser} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      {/* Donation Popup */}
      {donationPopup.show && donationPopup.fundraiser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "400px",
              maxWidth: "90%",
              padding: "2rem",
              borderRadius: "10px",
              backgroundColor: isDark ? "#1f2937" : "#fff",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              position: "relative",
            }}
          >
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                color: isDark ? "#d1d5db" : "#111827",
              }}
              onClick={() => {
                setDonationPopup({ show: false });
                setDonationAmount(0);
                setDonationError("");
              }}
            >
              ✕
            </button>

            <h3>Donate to {donationPopup.fundraiser.title}</h3>
            <p>
              Remaining amount: $
              {donationPopup.fundraiser.goalAmount - donationPopup.fundraiser.collectedAmount}
            </p>

            <input
              style={styles.input}
              type="number"
              placeholder="Enter amount"
              value={donationAmount}
              onChange={(e) => setDonationAmount(parseFloat(e.target.value))}
            />

            {donationError && <p style={{ color: "red", fontWeight: 600 }}>{donationError}</p>}

            <button style={styles.button} onClick={handleDonate}>
              Donate
            </button>
          </div>
        </div>
      )}

      {/* Fundraiser Cards */}
      {loading ? (
        <p>Loading fundraisers...</p>
      ) : fundraisers.length === 0 ? (
        <p>No fundraisers found.</p>
      ) : (
        <div style={styles.cardContainer}>
          {fundraisers.map((f) => {
            const percent = Math.min((f.collectedAmount / f.goalAmount) * 100, 100);
            const isOngoing = f.status.toLowerCase() === "ongoing";

            return (
              <Link
                key={f._id}
                to={`/fundraise/${f._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={styles.card}>
                  <h3>{f.title}</h3>
                  <p>Goal: ${f.goalAmount}</p>
                  <p>Raised: ${f.collectedAmount}</p>
                  <div style={styles.progressBar}>
                    <div style={progressStyle(percent)}></div>
                  </div>
                  <p style={statusStyle(f.status)}>{f.status}</p>

                  <button
                    style={{
                      ...styles.button,
                      backgroundColor: isOngoing ? "#16a34a" : "#9ca3af",
                      cursor: isOngoing ? "pointer" : "not-allowed",
                    }}
                    disabled={!isOngoing}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      isOngoing && setDonationPopup({ show: true, fundraiser: f });
                    }}
                  >
                    Donate
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FundRaise;
