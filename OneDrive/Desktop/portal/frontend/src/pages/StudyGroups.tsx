import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface StudyGroupsProps {
  mode: "light" | "dark";
  toggleMode?: () => void;
}

interface Group {
  _id: string;
  name: string;
  subj: string;
  founder: string;
  members: string[];
}

const StudyGroups: React.FC<StudyGroupsProps> = ({ mode }) => {
  const isDark = mode === "dark";

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  // Popup state
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch study groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/study-groups/");
        const data = await res.json();

        if (data.studyGroups) {
          const mappedGroups = data.studyGroups.map((g: any) => ({
            _id: g._id,
            name: g.name,
            subj: g.subject,
            founder: g.founderId,
            members: g.memberIds,
          }));

          setGroups(mappedGroups);
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchGroups();
  }, []);

  // Create group
  const handleAddGroup = async () => {
    const trimmedName = name.trim();
    const trimmedSubject = subject.trim();

    if (!trimmedName || !trimmedSubject)
      return alert("Name and subject are required");

    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in to create a group");

    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/study-groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: trimmedName,
          subject: trimmedSubject,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Study group created!");

        const created = data.group || data;

        const newGroup: Group = {
          _id: created._id,
          name: created.name,
          subj: created.subject,
          founder: created.founderId,
          members: created.memberIds,
        };

        setGroups((prev) => [...prev, newGroup]);

        setShowForm(false);
        setName("");
        setSubject("");
      } else {
        alert(data.error || "Error creating group");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setSubmitting(false);
  };

  // Join group
  const handleJoin = async (group: Group) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in to join a group");

    try {
      const res = await fetch("http://localhost:5000/api/study-groups/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ groupId: group._id }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Joined successfully!");

        const updatedMembers = data.group.memberIds;

        setGroups((prev) =>
          prev.map((g) =>
            g._id === group._id ? { ...g, members: updatedMembers } : g
          )
        );
      } else {
        alert(data.message || "Error joining group");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  // Styles
  const styles = {
    container: {
      minHeight: "100vh",
      padding: "2rem",
      background: isDark ? "#111827" : "#e8f4ff",
      color: isDark ? "#d1d5db" : "#111827",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
    },
    title: { fontSize: "2rem", fontWeight: 700 },
    button: {
      padding: "0.5rem 1rem",
      background: isDark ? "#2563eb" : "#004aad",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
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
      background: isDark ? "#1f2937" : "white",
      boxShadow: isDark
        ? "0 4px 12px rgba(0,0,0,0.5)"
        : "0 4px 12px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      borderRadius: "6px",
      border: "1px solid #ccc",
      marginBottom: "1rem",
    },
    popupBackdrop: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    popup: {
      width: "400px",
      background: isDark ? "#1f2937" : "white",
      padding: "2rem",
      borderRadius: "10px",
      position: "relative",
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    },
    closeBtn: {
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "none",
      border: "none",
      fontSize: "1.4rem",
      cursor: "pointer",
      color: isDark ? "#fff" : "#111827",
    },
  } as const;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Study Groups</h2>
        <button style={styles.button} onClick={() => setShowForm(true)}>
          + Create Group
        </button>
      </div>

      {/* Create Group Popup */}
      {showForm && (
        <div style={styles.popupBackdrop}>
          <div style={styles.popup}>
            <button style={styles.closeBtn} onClick={() => setShowForm(false)}>
              ✕
            </button>
            <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
              Create Study Group
            </h3>

            <input
              style={styles.input}
              placeholder="Group Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <button
              style={styles.button}
              onClick={handleAddGroup}
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      )}

      {/* Study Group Cards */}
      {loading ? (
        <p>Loading groups...</p>
      ) : groups.length === 0 ? (
        <p>No study groups available.</p>
      ) : (
        <div style={styles.cardContainer}>
          {groups.map((g) => (
            <Link
              key={g._id}
              to={`/study-groups/${g._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={styles.card}>
                <h3>{g.name}</h3>
                <p>Subject: {g.subj}</p>
                <p>Members: {g.members.length}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyGroups;
