import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Profile = ({ mode }) => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalItems, setModalItems] = useState([]);

  // Logged-in user
  const loggedInUserId = localStorage.getItem("userId"); 

  const isOwnProfile = loggedInUserId === id;

  const handleViewItems = (title, items) => {
    setModalTitle(title);
    setModalItems(items);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/students/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile data");

        const data = await res.json();
        setStudent(data);

      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!student) return <div>No data found.</div>;

  // Helper component to show row with button if needed
  const RenderRow = (label, items, showForOthers = false) => {
    const showButton = 
      isOwnProfile ||     // show everything on own profile
      (!isOwnProfile && showForOthers); // only selected ones for other users

    return (
      <p>
        <strong>{label}:</strong> {items.length}
        {showButton && items.length > 0 && (
          <button
            onClick={() => handleViewItems(label, items)}
            style={{
              marginLeft: "10px",
              padding: "3px 10px",
              cursor: "pointer",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "5px"
            }}
          >
            View
          </button>
        )}
      </p>
    );
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "25px",
        borderRadius: "12px",
        backgroundColor: mode === "dark" ? "#1f1f1f" : "#ffffff",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        color: mode === "dark" ? "#fff" : "#333",
      }}
    >
      <h1 style={{ fontSize: "2rem", color: "#4caf50", marginBottom: "15px" }}>
        {student._name}
      </h1>

      {/* Student Info */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          borderRadius: "8px",
          backgroundColor: mode === "dark" ? "#2b2b2b" : "#f3f3f3",
        }}
      >
        <h3>User Information</h3>
        <p><strong>Email:</strong> {student._email}</p>
        <p><strong>Roll No:</strong> {student._rollNo}</p>

        {/* Conditional rows */}
        {RenderRow("Organised Study Groups", student._organisedStudyGroupIds, true)}
        {RenderRow("Joined Study Groups", student._joinedStudyGroupIds, true)}
        {RenderRow("Requested Fundraisers", student._requestedFundraiserIds)}
        {RenderRow("Approved Fundraisers", student._approvedFundraiserIds, true)}
        {RenderRow("Lost & Found Items", student._lostAndFoundItemIds, true)}
        {RenderRow("Donations Made", student._donationIds)}
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              width: "350px",
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{modalTitle}</h3>
            <ul>
              {modalItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "10px",
                background: "#f44336",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
