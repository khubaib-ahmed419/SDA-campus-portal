import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface DashboardProps {
  mode: "light" | "dark";
  toggleMode: () => void;
}

interface User {
  _id: string;
  name?: string;
  email?: string;
}
interface Member {
  _id: string;
  name?: string;
  email?: string;
}

interface Group {
  _id: string;
  _name: string;
  _subject: string;
  _founderId: string;
  _memberIds: string[];
}

const StudyGroupDetails: React.FC<DashboardProps> = ({ mode, toggleMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [showTransferPopup, setShowTransferPopup] = useState(false);
  const [selectedNewFounder, setSelectedNewFounder] = useState("");

  const isDark = mode === "dark";

  // Load current user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    } else {
      const uid = localStorage.getItem("userId");
      if (uid && uid !== "undefined") setUser({ _id: uid });
    }
  }, []);

  // Fetch group details
  useEffect(() => {
    const fetchGroup = async () => {
      const token = localStorage.getItem("token");
      if (!token) return alert("Login required");

      try {
        const res = await fetch(`http://localhost:5000/api/study-groups/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          alert("Unauthorized. Please log in again.");
          return;
        }

        const data = await res.json();
        if (!data.studyGroups) return alert("Group not found");

        setGroup({
          _id: data.studyGroups._id,
          _name: data.studyGroups._name,
          _subject: data.studyGroups._subject,
          _founderId: data.studyGroups._founderId,
          _memberIds: data.studyGroups._memberIds,
        });
      } catch (error) {
        console.error("Error loading group:", error);
        alert("Server error while fetching group");
      }
      setLoading(false);
    };

    fetchGroup();
  }, [id]);

  // Fetch members data
  useEffect(() => {
    const fetchMembers = async () => {
      if (!group?._memberIds.length) return;
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/users/get-users", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ ids: group._memberIds }),
        });

        const data = await res.json();
        if (!res.ok) return console.warn(data.error);

        setMembers(data.users);
      } catch (err) {
        console.error("Failed to fetch member data", err);
      }
    };

    fetchMembers();
  }, [group]);

  const isMember = user && group?._memberIds.includes(user._id);
  const isFounder = user && group?._founderId === user._id;

  // Delete group handler
  const handleDeleteGroup = async () => {
    if (!user || !group) return alert("Login required");
    if (!isFounder || group._memberIds.length !== 1 || group._memberIds[0] !== user._id)
      return alert("You can only delete the group if you are the founder and the only member.");
    if (!window.confirm("Are you sure you want to delete this study group?")) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    try {
      const res = await fetch(`http://localhost:5000/api/study-groups/delete/${group._id}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to delete group");

      alert("Study group deleted successfully!");
      navigate("/studygroups");
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  // Leave group
  const handleLeave = async () => {
    if (!user || !group) return alert("Login required");
    if (isFounder) return setShowTransferPopup(true);

    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    try {
      const res = await fetch(`http://localhost:5000/api/study-groups/leave/${group._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Failed to leave group");

      setGroup(data.studyGroup);
      alert("You have successfully left the group!");
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  // Transfer founder
  const handleConfirmTransferAndLeave = async () => {
    if (!selectedNewFounder || !group) return alert("Select a new founder first");
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    try {
      const res = await fetch(`http://localhost:5000/api/study-groups/transfer-founder/${group._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newFounderId: selectedNewFounder }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) return alert(data.message || "Transfer failed");

      setGroup(data.studyGroup);
      setShowTransferPopup(false);
      setSelectedNewFounder("");
      alert("Ownership transferred and you have left the group!");
      navigate("/studygroups");
    } catch (err) {
      console.error(err);
      alert("Server error while transferring founder");
    }
  };

  // Join group
  const handleJoin = async () => {
    if (!user || !group) return alert("Login required");
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    try {
      const res = await fetch(`http://localhost:5000/api/study-groups/join/${group._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Failed to join group");

      setGroup(data.studyGroup);
      alert("You have successfully joined the group!");
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  // Remove member (founder only)
  const handleRemove = async (memberId: string) => {
    if (!user || !group || !isFounder) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    try {
      const res = await fetch(`http://localhost:5000/api/study-groups/remove-member/${group._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ memberId }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Failed to remove member");
      setGroup(data.studyGroup);
    } catch (err) {
      console.error("Error removing member:", err);
      alert("Server error");
    }
  };

  if (loading) return <h3>Loading group details...</h3>;
  if (!group) return <h3 style={{ color: "red" }}>Group not found.</h3>;

  return (
    <div style={{ padding: "2rem", background: isDark ? "#111827" : "#eef6ff", color: isDark ? "#d1d5db" : "#111827", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{group._name}</h1>
      <p><b>Subject:</b> {group._subject}</p>
      <p><b>Total Members:</b> {group._memberIds.length}</p>

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {!isMember && (
          <button onClick={handleJoin} style={{ padding: "0.5rem 1rem", background: "green", color: "white", borderRadius: "6px", border: "none" }}>
            Join Group
          </button>
        )}
        {isMember && (
          <button onClick={handleLeave} style={{ padding: "0.5rem 1rem", background: "orange", color: "white", borderRadius: "6px", border: "none" }}>
            Leave Group
          </button>
        )}
        {isFounder && group._memberIds.length === 1 && group._memberIds[0] === user?._id && (
          <button onClick={handleDeleteGroup} style={{ padding: "0.5rem 1rem", background: "red", color: "white", borderRadius: "6px", border: "none" }}>
            Delete Group
          </button>
        )}
      </div>

      {/* Members cards */}
      <h2 style={{ marginTop: "2rem" }}>Members</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1rem",
        marginTop: "1rem"
      }}>
        {members.map(member => (
          <div key={member._id} style={{
            padding: "1rem",
            borderRadius: "10px",
            background: isDark ? "#1f2937" : "#fff",
            color: isDark ? "#d1d5db" : "#111827",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "#6b7280",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "1.5rem",
              marginBottom: "0.5rem"
            }}>
              {member.name?.charAt(0).toUpperCase()}
            </div>
            <strong>{member.name || "Unknown"}</strong>
            <span style={{ fontSize: "0.85rem", color: isDark ? "#d1d5db" : "#6b7280" }}>{member.email}</span>
            {isFounder && member._id !== user?._id && (
              <button onClick={() => handleRemove(member._id)} style={{
                marginTop: "0.5rem",
                padding: "0.3rem 0.6rem",
                background: "red",
                color: "white",
                borderRadius: "4px",
                border: "none"
              }}>Remove</button>
            )}
          </div>
        ))}
      </div>

      {/* Transfer founder popup */}
      {showTransferPopup && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 50
        }}>
          <div style={{
            background: isDark ? "#111827" : "#fff",
            color: isDark ? "#d1d5db" : "#111827",
            padding: "2rem", borderRadius: "10px", minWidth: "300px"
          }}>
            <h3>Select a new founder</h3>
            <select
              value={selectedNewFounder}
              onChange={e => setSelectedNewFounder(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", marginTop: "1rem", borderRadius: "6px" }}
            >
              <option value="">--Select--</option>
              {group._memberIds.filter(id => id !== user?._id).map(id => (
                <option key={id} value={id}>{members.find(m => m._id === id)?.name || id}</option>
              ))}
            </select>
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button onClick={handleConfirmTransferAndLeave} disabled={!selectedNewFounder} style={{ padding: "0.5rem 1rem", background: "green", color: "white", borderRadius: "6px", border: "none" }}>Confirm & Leave</button>
              <button onClick={() => setShowTransferPopup(false)} style={{ padding: "0.5rem 1rem", background: "gray", color: "white", borderRadius: "6px", border: "none" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGroupDetails;
