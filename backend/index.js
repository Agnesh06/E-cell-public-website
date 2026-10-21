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

// Security: Disable X-Powered-By header
app.disable("x-powered-by");

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "*")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
  })
);

app.use(express.json());

// Security & Abuse Protection Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get(["/healthz", "/api/healthz"], (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Members endpoint handler
async function handleGetMembers(req, res) {
  try {
    const range = process.env.GSHEET_MEMBERS_RANGE || "A1:Z500";
    const values = await fetchSheetValues(range);
    const members = valuesToMembers(values);
    // Vercel edge caching: cache for 5 min, allow stale up to 10 min
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
    res.json({ members });
  } catch (err) {
    console.error("Failed to fetch members:", err.message);
    res.status(500).json({ error: "Failed to fetch members" });
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
    // Vercel edge caching: cache for 5 min, allow stale up to 10 min
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
    res.json({ projects });
  } catch (err) {
    console.error("Failed to fetch projects:", err.message);
    res.status(500).json({ error: "Failed to fetch projects", projects: [] });
  }
}

app.get("/api/projects", handleGetProjects);
app.get("/projects", handleGetProjects);

// 404 handler for unmapped backend routes
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`E-Cell backend server running on port ${PORT}`);
    console.log(`Configured Google Sheet ID: ${process.env.GSHEET_ID || "not set"}`);
  });
}

export default app;
