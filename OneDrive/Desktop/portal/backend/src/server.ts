import express from "express";
import dotenv from "dotenv";
import cors from "cors";


import { connectDB } from "./config/db";

// Load ENV first
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

// Body parser
app.use(express.json());

// Connect DB
connectDB();

// Test route
app.get("/", (req, res) => res.send("Campus Portal Backend Running"));

// ================= ROUTES =================
import adminRoutes from "./routes/adminRoutes"
import userRoutes from "./routes/userRoutes"
import studentRoutes from "./routes/studentRoutes";
import utilityROutes from "./routes/utilityRoutes";
import fundRaisingRoutes from "./routes/fundraiserRoutes";
import lostAndFoundRoutes from "./routes/lostAndFoundRoutes";
import studyGroupRoutes from "./routes/studygroupRoutes";

app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes)
app.use("/api/utility", utilityROutes);
app.use("/api/fundraise", fundRaisingRoutes);
app.use("/api/lost-and-found", lostAndFoundRoutes)
app.use("/api/study-groups", studyGroupRoutes)


// ================= SERVER LISTEN =================
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
