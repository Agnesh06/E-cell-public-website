import "dotenv/config";
import express from "express";
import cors from "cors";
import { fetchSheetValues } from "./googleSheets.js";
import { valuesToProjects } from "./mapSheetToProjects.js";
import { valuesToTeam } from "./mapSheetToTeam.js";

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "*")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
  })
);

app.get("/healthz", (req, res) => {
  res.send("ok");
});

app.get("/api/projects", async (req, res) => {
  try {
    const sheetId = process.env.GSHEET_PROJECTS_ID;
    const range = process.env.GSHEET_PROJECTS_RANGE || "'Form Responses 1'!A1:Z1000";

    if (!sheetId) {
      throw new Error("Missing GSHEET_PROJECTS_ID in .env");
    }

    const values = await fetchSheetValues(range, sheetId);
    const projects = valuesToProjects(values);
    res.json({ projects });
  } catch (err) {
    console.error("Failed to fetch projects:", err.message);
    res.status(500).json({ error: err.message || "Failed to fetch projects." });
  }
});

app.get("/api/members", async (req, res) => {
  try {
    const sheetId = process.env.GSHEET_TEAM_ID;
    const range = process.env.GSHEET_TEAM_RANGE || "'Form Responses 1'!A1:I1000";

    if (!sheetId) {
      throw new Error("Missing GSHEET_TEAM_ID in .env");
    }

    const values = await fetchSheetValues(range, sheetId);
    const members = valuesToTeam(values);
    res.json({ members });
  } catch (err) {
    console.error("Failed to fetch members:", err.message);
    res.status(500).json({ error: err.message || "Failed to fetch members." });
  }
});

// Alias endpoint for team
app.get("/api/team", async (req, res) => {
  try {
    const sheetId = process.env.GSHEET_TEAM_ID;
    const range = process.env.GSHEET_TEAM_RANGE || "'Form Responses 1'!A1:I1000";

    if (!sheetId) {
      throw new Error("Missing GSHEET_TEAM_ID in .env");
    }

    const values = await fetchSheetValues(range, sheetId);
    const members = valuesToTeam(values);
    res.json({ members, team: members });
  } catch (err) {
    console.error("Failed to fetch team:", err.message);
    res.status(500).json({ error: err.message || "Failed to fetch team." });
  }
});

app.listen(PORT, () => {
  console.log(`E-Cell backend server running on port ${PORT}`);
});