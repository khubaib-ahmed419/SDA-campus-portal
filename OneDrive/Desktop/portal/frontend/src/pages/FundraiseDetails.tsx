import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Fundraiser {
  id: string;
  title: string;
  description: string;
  organiserId: string;
  goalAmount: number;
  collectedAmount: number;
  status: string;
  isApproved: string;
  donations: string[];
}

interface Organiser {
  _id: string;
  _name: string;
  _email: string;
  _contact: string;
}

interface FundraiseDetailsProps {
  mode: "light" | "dark";
  toggleMode: () => void;
}

const FundraiseDetails: React.FC<FundraiseDetailsProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();

  const [fundraiser, setFundraiser] = useState<Fundraiser | null>(null);
  const [organiser, setOrganiser] = useState<Organiser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Popups
  const [showDonatePopup, setShowDonatePopup] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [donationError, setDonationError] = useState("");
  const [showDonationList, setShowDonationList] = useState(false);


  const [donations, setDonations] = useState<any[]>([]);

const handleViewDonations = async () => {
  if (!fundraiser) return;
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/api/fundraise/${fundraiser.id}/donations`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    const data = await res.json();
    setDonations(data.donations || []);
    setShowDonationList(true);
  } catch (err) {
    console.error("Failed to fetch donations:", err);
  }
};


  // ✅ Get current userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setCurrentUserId(storedUserId);
  }, []);

  // Fetch fundraiser and organiser
  useEffect(() => {
    const fetchFundraiserAndOrganiser = async () => {
      try {
        const token = localStorage.getItem("token");

        const fundraiserRes = await fetch(`http://localhost:5000/api/fundraise/${id}`, {
          headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        });
        if (!fundraiserRes.ok) throw new Error("Failed to fetch fundraiser");
        const fundraiserData = await fundraiserRes.json();
        setFundraiser(fundraiserData.fundraiser);

        const organiserRes = await fetch(
          `http://localhost:5000/api/students/${fundraiserData.fundraiser.organiserId}`,
          { headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" } }
        );
        const organiserData = await organiserRes.json();
        setOrganiser(organiserData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFundraiserAndOrganiser();
  }, [id]);

  const isOrganiser = currentUserId && fundraiser && currentUserId === fundraiser.organiserId;

  // ---------------------------
  // Handle Donate
  // ---------------------------
  const handleDonate = async () => {
    if (!fundraiser) return;

    const remaining = fundraiser.goalAmount - fundraiser.collectedAmount;
    if (!donationAmount || donationAmount <= 0 || donationAmount > remaining) {
      setDonationError(`Amount must be between 1 and ${remaining}`);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/fundraise/donate/${fundraiser.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ fundraiserId: fundraiser.id, amount: donationAmount }),
      });

      const data = await res.json();
      if (!res.ok) { setDonationError(data.message || "Donation failed"); return; }

      alert("Donation successful!");
      setFundraiser({ ...fundraiser, collectedAmount: data.fundraiser.collectedAmount, status: data.fundraiser.status });
      setShowDonatePopup(false);
      setDonationAmount(0);
    } catch {
      setDonationError("Server error. Please try again.");
    }
  };

  // ---------------------------
  // Handle Cancel Fundraiser
  // ---------------------------
  const handleCancel = async () => {
    if (!fundraiser || !isOrganiser) return;
    if (!window.confirm("Are you sure you want to cancel this fundraiser?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/fundraise/cancel/${fundraiser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
      });

      const data = await res.json();
      if (!res.ok) return alert("Cancel failed");
      alert("Fundraiser cancelled!");
      setFundraiser({ ...fundraiser, status: "cancelled" });
    } catch {
      alert("Server failed.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!fundraiser) return <div>No fundraiser found.</div>;

  return (
    <div style={{ maxWidth: "860px", margin: "30px auto", padding: "25px", borderRadius: "12px", backgroundColor: mode === "dark" ? "#1f1f1f" : "#ffffff", boxShadow: "0 6px 20px rgba(0,0,0,0.15)", color: mode === "dark" ? "#fff" : "#333" }}>
      <h1 style={{ fontSize: "2rem", color: "#4caf50", marginBottom: "10px" }}>{fundraiser.title}</h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "20px" }}>{fundraiser.description}</p>

      {/* Fundraiser Info */}
      <div style={{ background: mode === "dark" ? "#2b2b2b" : "#f3f3f3", padding: "15px", borderRadius: "8px" }}>
        <p><strong>Status:</strong> {fundraiser.status}</p>
        <p><strong>Approved:</strong> {fundraiser.isApproved}</p>
        <p><strong>Goal:</strong> ${fundraiser.goalAmount}</p>
        <p><strong>Collected:</strong> ${fundraiser.collectedAmount}</p>
      </div>

      {/* Organiser */}
      {organiser && (
        <>
          <h3 style={{ marginTop: "20px" }}>Organiser</h3>
          <div style={{ background: mode === "dark" ? "#2d2d2d" : "#f7f7f7", padding: "15px", borderRadius: "8px" }}>
            <p><strong>Name:</strong> {organiser._name}</p>
            <p><strong>Email:</strong> {organiser._email}</p>
            <p><strong>Contact:</strong> {organiser._contact || "N/A"}</p>
          </div>
        </>
      )}

      {/* Buttons */}
      <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
        {!isOrganiser && fundraiser.status === "ongoing" && <button onClick={() => setShowDonatePopup(true)} style={greenBtn}>Donate</button>}
        {isOrganiser && <button onClick={handleViewDonations} style={blueBtn}>View Donations</button>}
        {isOrganiser && fundraiser.status === "ongoing" && <button onClick={handleCancel} style={redBtn}>Cancel Fundraiser</button>}
      </div>

      {/* Donate Popup */}
      {showDonatePopup && (
        <Popup title="Donate" onClose={() => setShowDonatePopup(false)}>
          <input type="number" value={donationAmount} onChange={(e) => setDonationAmount(Number(e.target.value))} placeholder="Enter amount" style={inputBox} />
          {donationError && <p style={{ color: "red" }}>{donationError}</p>}
          <div style={popupBtnRow}>
            <button onClick={handleDonate} style={greenBtn}>Donate</button>
            <button onClick={() => setShowDonatePopup(false)} style={greyBtn}>Close</button>
          </div>
        </Popup>
      )}

      {/* Donation List Popup */}
      {/* Donation List Popup */}
{showDonationList && (
  <Popup title="Donations" onClose={() => setShowDonationList(false)}>
    {donations.length === 0 ? (
      <p>No donations yet.</p>
    ) : (
      <ul>
        {donations.map((d: any) => (
          <li key={d._id} style={{ marginBottom: "10px" }}>
            <a
              href={`/student/profile/${d.donorDetails.studentId}`}
              style={{ color: "#1976d2", textDecoration: "underline", cursor: "pointer" }}
            >
              {d.donorDetails.name}
            </a>{" "}
            - ${d._amount} - {d.donorDetails.email} - {d.donorDetails.contact || "N/A"}
          </li>
        ))}
      </ul>
    )}
    <button onClick={() => setShowDonationList(false)} style={greyBtn}>
      Close
    </button>
  </Popup>
)}

    </div>
  );
};

// ---------------------------
// Popup Component
// ---------------------------
interface PopupProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ title, onClose, children }) => (
  <div style={popupWrapper}>
    <div style={popupBox}>
      <h2>{title}</h2>
      {children}
    </div>
  </div>
);

// ---------------------------
// Styling
// ---------------------------
const popupWrapper: React.CSSProperties = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center" };
const popupBox: React.CSSProperties = { width: "380px", background: "#fff", padding: "25px", borderRadius: "10px", textAlign: "center" };
const inputBox: React.CSSProperties = { width: "100%", padding: "10px", marginTop: "10px", borderRadius: "8px", border: "1px solid #ccc" };
const popupBtnRow: React.CSSProperties = { marginTop: "15px", display: "flex", justifyContent: "space-between" };
const greenBtn: React.CSSProperties = { background: "#4caf50", padding: "10px 20px", color: "#fff", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" };
const blueBtn: React.CSSProperties = { background: "#1976d2", padding: "10px 20px", color: "#fff", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" };
const redBtn: React.CSSProperties = { background: "#e53935", padding: "10px 20px", color: "#fff", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" };
const greyBtn: React.CSSProperties = { background: "#777", padding: "10px 20px", color: "#fff", borderRadius: "8px", border: "none", cursor: "pointer" };

export default FundraiseDetails;
