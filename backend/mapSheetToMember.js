/**
 * Maps raw 2D array of rows from Google Sheets into structured member objects.
 * Compatible with csea/backend/mapSheetToMember.js and frontend TeamMember type.
 */
export function valuesToMembers(values) {
  if (!values || values.length === 0) return [];

  const headers = values[0].map((h) => (h || "").trim().toLowerCase());

  return values.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = (row[i] ?? "").toString().trim();
    });

    const name = obj.name || "";
    const role = obj.position || obj.role || "";
    const photo = obj.photo || obj.url || obj.image || "";
    const id = obj.id || obj["roll no"] || obj["roll number"] || obj.roll || name;

    return {
      id: String(id),
      roll: obj.roll || obj["roll no"] || obj["roll number"] || obj.rollno || obj.id || "",
      name: name,
      position: role,
      role: role,
      vertical: obj.vertical || obj.department || "Core Team",
      yearAndClass: obj["year and class"] || obj.year || obj.batch || obj.class || "",
      year: obj.year || obj["year and class"] || obj.batch || obj.class || "",
      photo: photo,
      image: photo,
      github: obj.github || "",
      linkedin: obj.linkedin || "",
      email: obj.email || "",
    };
  });
}
