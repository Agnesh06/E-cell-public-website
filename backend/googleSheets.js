import { JWT } from "google-auth-library";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

let cachedClient = null;

// In-memory cache for sheet values to reduce rate limits and improve response latency
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

function getAuthClient() {
  if (cachedClient) return cachedClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!email || !rawKey) {
    return null;
  }

  const key = rawKey.replace(/\\n/g, "\n");

  cachedClient = new JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return cachedClient;
}

/**
 * Robust CSV parser to handle comma-separated values and quoted fields.
 */
function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  return lines.map((line) => {
    const row = [];
    let insideQuote = false;
    let entry = "";
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuote && line[i + 1] === '"') {
          entry += '"';
          i++;
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === "," && !insideQuote) {
        row.push(entry.trim());
        entry = "";
      } else {
        entry += char;
      }
    }
    row.push(entry.trim());
    return row;
  });
}

/**
 * Fetches values from the specified Google Sheet range.
 * 
 * Supports:
 * 1. Google Sheets API v4 using Service Account JWT authentication (same as csea).
 * 2. Public Google Sheet export fallback if Service Account credentials are not set in .env.
 */
export async function fetchSheetValues(range = "A1:Z500") {
  const sheetId = process.env.GSHEET_ID;

  if (!sheetId) {
    throw new Error("Missing GSHEET_ID in backend .env");
  }

  // Check in-memory cache
  const cacheKey = `${sheetId}:${range}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const auth = getAuthClient();

  // Mode 1: Service Account JWT Authentication (Official Google Sheets API v4)
  if (auth) {
    try {
      const { token } = await auth.getAccessToken();
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
        range
      )}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const values = data.values || [];
        cache.set(cacheKey, { data: values, timestamp: Date.now() });
        return values;
      } else {
        const body = await res.json().catch(() => null);
        console.warn(`[Sheets API v4 error]: ${body?.error?.message || res.statusText}, trying public fallback...`);
      }
    } catch (apiErr) {
      console.warn("[Sheets API v4 request failed]:", apiErr.message, "trying public fallback...");
    }
  }

  // Mode 2: Public Google Sheet CSV Export Fallback
  const publicCsvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
  const res = await fetch(publicCsvUrl);

  if (!res.ok) {
    throw new Error(`Failed to fetch sheet values: status ${res.status} (${res.statusText})`);
  }

  const csvText = await res.text();
  const values = parseCsv(csvText);

  // Cache response
  cache.set(cacheKey, { data: values, timestamp: Date.now() });
  return values;
}
