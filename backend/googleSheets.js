import { JWT } from "google-auth-library";

let cachedClient = null;

function getAuthClient() {
  if (cachedClient) return cachedClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in .env"
    );
  }

  const key = rawKey.replace(/\\n/g, "\n");

  cachedClient = new JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return cachedClient;
}

// range: e.g. "'Form Responses 1'!A1:Z1000" or "'Form Responses 1'!A1:I1000"
export async function fetchSheetValues(range, sheetId = process.env.GSHEET_ID) {
  const targetSheetId = sheetId || process.env.GSHEET_ID;

  if (!targetSheetId) {
    throw new Error("Missing spreadsheet ID (pass sheetId or set GSHEET_ID in .env)");
  }
  if (!range) {
    throw new Error("fetchSheetValues() requires a range argument");
  }

  const auth = getAuthClient();
  const { token } = await auth.getAccessToken();

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${targetSheetId}/values/${encodeURIComponent(
    range
  )}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const reason = body?.error?.message || `status ${res.status}`;
    throw new Error(`Sheets API request failed: ${reason}`);
  }

  const data = await res.json();
  return data.values || [];
}
