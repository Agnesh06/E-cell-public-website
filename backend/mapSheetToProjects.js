/**
 * Maps Google Sheets rows to Projects for CSEA E-Cell.
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

/**
 * Converts 2D sheet values into an array of Project objects.
 * Expects row 0 to be column headers.
 */
export function valuesToProjects(values) {
  if (!values || values.length < 2) return [];

  const headers = values[0].map((h) => String(h || "").trim());
  const projectsMap = new Map();

  for (let r = 1; r < values.length; r++) {
    const rowArray = values[r];
    if (!rowArray || rowArray.length === 0) continue;

    // Build row object keyed by header
    const row = {};
    headers.forEach((header, i) => {
      if (header) {
        row[header] = (rowArray[i] ?? "").toString().trim();
      }
    });

    const showOnSite = getField(row, "showonsite").toLowerCase();
    if (showOnSite !== "yes") continue;

    const title = getField(row, "projecttitle") || getField(row, "title");
    if (!title) continue;

    const slug = slugify(title);
    if (!slug) continue;

    const summary = getField(row, "onelinesummary") || getField(row, "summary");
    const description = getField(row, "description");
    const rawImage =
      getField(row, "coverimage") || getField(row, "photo") || getField(row, "image");
    const feasibility = getField(row, "feasib") || "Feasibility assessment underway.";
    const change = getField(row, "whatchange") || getField(row, "change");
    const rawType = getField(row, "projecttype").toLowerCase();
    const kind = rawType.startsWith("non") ? "non-technical" : "technical";
    const rawStack = getField(row, "techstack");
    const stack = rawStack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const rawOrder = getField(row, "order");
    const parsedOrder = parseInt(rawOrder, 10);
    const order = !Number.isNaN(parsedOrder) ? parsedOrder : r;

    const driveConverted = rawImage ? convertDriveImage(rawImage) : null;
    const image =
      driveConverted || (rawImage && /^https?:\/\//i.test(rawImage) ? rawImage : "");

    const project = {
      // Include original sheet fields for backward compatibility
      ...row,
      id: slug,
      slug,
      title,
      summary,
      description,
      tags: [kind === "technical" ? "Technical" : "Non-Technical"],
      lead: "CSEA E-Cell",
      links: [],
      image,
      coverImage: image,
      featured: false,
      order,
      status: "Ongoing",
      kind,
      projectType: getField(row, "projecttype") || (kind === "technical" ? "Technical" : "Non-Technical"),
      stack,
      change,
      feasibility,
      impact: {
        status: "Ongoing",
        changeStatement: change,
        impactType: "expected",
        outcomes: change ? [change] : [],
      },
      techOrApproach: {
        type: kind === "technical" ? "tech-stack" : "approach",
        title: kind === "technical" ? "Technology Stack" : "Methodology & Approach",
        summary: summary || title,
        items: stack.map((name) => ({ name })),
      },
    };

    // On duplicate slug, later row overwrites earlier row
    projectsMap.set(slug, project);
  }

  const sorted = Array.from(projectsMap.values()).sort((a, b) => a.order - b.order);

  return sorted.map((p, index) => ({
    ...p,
    featured: index < 3,
  }));
}

export default valuesToProjects;

