/**
 * Maps raw 2D array of rows from Google Sheets into structured Project objects.
 */
export function valuesToProjects(values) {
  if (!values || values.length === 0) return [];

  const headers = values[0].map((h) => (h || "").trim().toLowerCase());

  return values.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = (row[i] ?? "").toString().trim();
    });

    const title = obj.title || obj.name || "";
    const slug = obj.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const technologies = (obj.technologies || obj.tech || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const teamMembers = (obj.teammembers || obj["team members"] || "")
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    return {
      id: obj.id || slug,
      slug,
      title,
      tagline: obj.tagline || "",
      coverImage: obj.coverimage || obj.image || obj.photo || "",
      description: obj.description || "",
      technologies,
      teamLead: obj.teamlead || obj["team lead"] || "",
      teamMembers,
      domain: obj.domain || "General",
      featured: (obj.featured || "").toLowerCase() === "true",
      links: [
        obj.livedemo && { label: "Live Demo", url: obj.livedemo },
        obj.github && { label: "GitHub", url: obj.github },
      ].filter(Boolean),
    };
  });
}
