import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });
import express from "express";
import cors from "cors";
import { fetchSheetValues } from "./googleSheets.js";
import { valuesToMembers } from "./mapSheetToMember.js";
import { valuesToProjects } from "./mapSheetToProject.js";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "*")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
  })
);

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get(["/healthz", "/api/healthz"], (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Members endpoint handler
async function handleGetMembers(req, res) {
  try {
    const range = process.env.GSHEET_MEMBERS_RANGE || "A1:Z500";
    const values = await fetchSheetValues(range);
    const members = valuesToMembers(values);
    res.json({ members });
  } catch (err) {
    console.error("Failed to fetch members:", err.message);
    res.status(500).json({ error: err.message });
  }
}

// Support both /api/members and /members for frontend routing flexibility
app.get("/api/members", handleGetMembers);
app.get("/members", handleGetMembers);

// Projects endpoint handler
async function handleGetProjects(req, res) {
  try {
    const range = process.env.GSHEET_PROJECTS_RANGE || "A1:Z500";
    const values = await fetchSheetValues(range);
    const projects = valuesToProjects(values);
    res.json({ projects });
  } catch (err) {
    console.error("Failed to fetch projects:", err.message);
    res.status(500).json({ error: err.message, projects: [] });
  }
}

app.get("/api/projects", handleGetProjects);
app.get("/projects", handleGetProjects);

app.listen(PORT, () => {
  console.log(`E-Cell backend server running on port ${PORT}`);
  console.log(`Configured Google Sheet ID: ${process.env.GSHEET_ID || "not set"}`);
});
