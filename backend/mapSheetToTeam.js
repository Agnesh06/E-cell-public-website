/**
 * Maps Google Sheets rows to Team Members for CSEA E-Cell.
 */

export function normalizeHeader(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function getField(row, prefix) {
  const normPrefix = normalizeHeader(prefix);
  for (const [key, value] of Object.entries(row)) {
    const normKey = normalizeHeader(key);
    if (normKey.startsWith(normPrefix)) {
      return (value ?? "").toString().trim();
    }
  }
  return "";
}

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function convertDriveImage(url) {
  if (!url) return null;
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${fileDMatch[1]}&sz=w1000`;
  }
  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${idParamMatch[1]}&sz=w1000`;
  }
  return null;
}

function cleanLink(val) {
  if (!val) return "";
  const trimmed = val.trim();
  const lower = trimmed.toLowerCase();
  if (["na", "n/a", "none", "nil", "-", ""].includes(lower)) {
    return "";
  }
  return trimmed;
}

function formatSocialUrl(val) {
  const cleaned = cleanLink(val);
  if (!cleaned) return "";
  if (!/^https?:\/\//i.test(cleaned)) {
    return `https://${cleaned}`;
  }
  return cleaned;
}

function formatEmail(val) {
  const cleaned = cleanLink(val);
  if (!cleaned) return "";
  if (!cleaned.toLowerCase().startsWith("mailto:") && cleaned.includes("@")) {
    return `mailto:${cleaned}`;
  }
  return cleaned;
}

export function formatDisplayRole(rawRole) {
  if (!rawRole) return "";
  const formatted = rawRole
    .replace(/\s*-\s*/g, " – ")
    .replace(/\s+and\s+/gi, " & ")
    .trim();

  return formatted
    .split(" ")
    .map((word) => {
      if (word === "–" || word === "&") return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export const LEAD_SENIORITY_RANKS = {
  director: { rank: 0, leadership: "director" },
  deputydirector: { rank: 1, leadership: "co-director" },
  headtechnical: { rank: 2 },
  headindustryandcommunityoutreach: { rank: 3 },
  associateheadtechnical: { rank: 4 },
  associateheadindustryandcommunityoutreach: { rank: 5 },
  programmanager: { rank: 6 },
  associateprogrammanager: { rank: 7 },
};

/**
 * Converts 2D sheet values into an array of TeamMember objects.
 * Expects row 0 to be column headers.
 */
export function valuesToTeam(values) {
  if (!values || values.length < 2) return [];

  const headers = values[0].map((h) => String(h || "").trim());
  const leadsList = [];
  const membersList = [];

  for (let r = 1; r < values.length; r++) {
    const rowArray = values[r];
    if (!rowArray || rowArray.length === 0) continue;

    const row = {};
    headers.forEach((header, i) => {
      if (header) {
        row[header] = (rowArray[i] ?? "").toString().trim();
      }
    });

    const showOnSite = getField(row, "showonsite").toLowerCase();
    if (showOnSite !== "yes") continue;

    const name = getField(row, "fullname") || getField(row, "name");
    if (!name) continue;

    const rawRole = getField(row, "role") || getField(row, "position") || "Member";
    const department = getField(row, "department") || getField(row, "vertical") || "";
    const rawPhoto =
      getField(row, "photolink") || getField(row, "photo") || getField(row, "image");
    const rawLinkedIn = getField(row, "linkedin");
    const rawGitHub = getField(row, "github");
    const rawEmail = getField(row, "email");
    const rawOrder = getField(row, "order");
    const parsedOrder = parseInt(rawOrder, 10);
    const orderNum = !Number.isNaN(parsedOrder) ? parsedOrder : r;

    const drivePhoto = rawPhoto ? convertDriveImage(rawPhoto) : null;
    const photo =
      drivePhoto || (cleanLink(rawPhoto) && /^https?:\/\//i.test(rawPhoto) ? rawPhoto : "");

    const linkedin = formatSocialUrl(rawLinkedIn);
    const github = formatSocialUrl(rawGitHub);
    const email = formatEmail(rawEmail);

    const normRole = normalizeHeader(rawRole);
    const displayRole = formatDisplayRole(rawRole);
    const memberId = slugify(`${name}-${displayRole}-${r}`);

    if (normRole in LEAD_SENIORITY_RANKS) {
      const { rank, leadership } = LEAD_SENIORITY_RANKS[normRole];
      const member = {
        id: memberId,
        name,
        role: displayRole,
        position: displayRole,
        department,
        vertical: department,
        photo,
        image: photo,
        leadership,
        wing: { id: "leads", name: "Leads" },
        socials: { linkedin, github, email },
        linkedin,
        github,
        email,
        order: orderNum,
        rank,
        sheetIndex: r,
        ...row,
      };
      leadsList.push(member);
    } else if (normRole === "membertechnical") {
      const member = {
        id: memberId,
        name,
        role: "Member",
        position: "Member",
        department: department || "Technical Wing",
        vertical: department || "Technical Wing",
        photo,
        image: photo,
        wing: { id: "technical", name: "Technical" },
        socials: { linkedin, github, email },
        linkedin,
        github,
        email,
        order: orderNum,
        sheetIndex: r,
        ...row,
      };
      membersList.push(member);
    } else if (normRole === "memberindustryandcommunityoutreach") {
      const member = {
        id: memberId,
        name,
        role: "Member",
        position: "Member",
        department: department || "Industry & Community Outreach Wing",
        vertical: department || "Industry & Community Outreach Wing",
        photo,
        image: photo,
        wing: { id: "outreach", name: "Industry and Community Outreach" },
        socials: { linkedin, github, email },
        linkedin,
        github,
        email,
        order: orderNum,
        sheetIndex: r,
        ...row,
      };
      membersList.push(member);
    } else {
      // General member / role
      const member = {
        id: memberId,
        name,
        role: displayRole,
        position: displayRole,
        department,
        vertical: department,
        photo,
        image: photo,
        socials: { linkedin, github, email },
        linkedin,
        github,
        email,
        order: orderNum,
        sheetIndex: r,
        ...row,
      };
      membersList.push(member);
    }
  }

  // Sort Leads by seniority rank, then order / sheetIndex
  leadsList.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.order - b.order || a.sheetIndex - b.sheetIndex;
  });

  // Sort Members by order / sheetIndex
  membersList.sort((a, b) => a.order - b.order || a.sheetIndex - b.sheetIndex);

  return [...leadsList, ...membersList];
}

// Alias valuesToMembers to valuesToTeam for full compatibility
export const valuesToMembers = valuesToTeam;

export default valuesToTeam;

