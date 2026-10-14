import { api, ApiClientError } from "@/lib/api";
import type { CollaborationFormData } from "@/types/collaboration";
import { apiClient } from "@/lib/api";

export interface BackendCollaborationPayload {
  company: {
    name: string;
    website?: string;
    industry_sectors: string[];
    size?: string;
    location: string;
  };
  contact: {
    name: string;
    designation: string;
    email: string;
    phone?: string;
    linkedin?: string;
  };
  collaboration: {
    title: string;
    types: string[];
    description: string;
    objective: string;
    student_domains: string[];
    team_size?: string;
    duration?: string;
    deliverables: string[];
  };
  commercial: {
    paid: string;
    budget_inr: number | null;
    mentorship: string;
    recognition: string;
  };
  timeline: {
    start_date?: string;
    completion_date?: string;
    milestones?: string;
    business_deadline: string;
  };
  expectations?: string;
  additional_comments?: string;
  consent: {
    authorized: boolean;
    contact_allowed: boolean;
  };
  ip_confidentiality?: string;
  additional_links?: string[];
  documents?: Array<{
    name: string;
    size: number;
    type: string;
  }>;
}

export interface BackendCollaborationResponseData {
  id: string;
  status: string;
  submittedAt: string;
  message: string;
}

export interface BackendCollaborationPayload {
  company: {
    name: string;
    website?: string | null;
    industry_sectors: string[];
    size?: string;
    location: string;
  };
  contact: {
    name?: string;
    designation?: string;
    email: string;
    phone?: string;
    linkedin?: string | null;
  };
  collaboration: {
    title?: string;
    types: string[];
    description?: string;
    objective?: string;
    student_domains: string[];
    team_size?: string;
    duration?: string;
    deliverables: string[];
  };
  commercial: {
    paid?: string;
    budget_inr: number | null;
    mentorship?: string;
    recognition?: string;
  };
  timeline: {
    start_date?: string;
    completion_date?: string;
    milestones?: string;
    business_deadline?: string;
  };
  ip_confidentiality?: string;
  documents?: {
    name: string;
    size: number;
    type: string;
  } | null;
  additional_links?: string[];
  expectations?: string;
  additional_comments?: string;
  consent: {
    authorized: boolean;
    contact_allowed: boolean;
  };
  message?: string;
}

export interface BackendCollaborationResponseData {
  id: string;
  status: string;
  submittedAt: string;
  message: string;
}

export interface CollaborationSubmitResponse {
  success: boolean;
  referenceId: string;
  message: string;
<<<<<<< HEAD
  status?: string;
=======
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
  submittedAt?: string;
}

/**
<<<<<<< HEAD
 * Normalizes a URL ensuring http:// or https:// prefix.
 */
export function normalizeUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
=======
 * Normalizes URL strings ensuring valid protocol for backend's validate_url check.
 */
export function normalizeUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
<<<<<<< HEAD
 * Parses numeric budget in INR from string input, returning null if non-numeric or empty.
 */
export function parseBudgetInr(budget?: string | null): number | null {
  if (!budget) return null;
  const cleaned = budget.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Parses links from comma or newline-separated string into an array of URLs.
 */
export function parseAdditionalLinks(links?: string | null): string[] {
  if (!links) return [];
  return links
    .split(/[,\n]+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => normalizeUrl(l) || l);
}

/**
 * Maps the frontend form data into the exact backend contract expected by POST /api/collaborate.
=======
 * Parses user-entered budget text (e.g. "50,000", "₹1,00,000", "50000") into numeric INR.
 * Returns null if the value is unspecified, empty, or non-numeric (e.g. "Flexible").
 */
export function parseBudgetInr(budgetStr?: string): number | null {
  if (!budgetStr) return null;
  const sanitized = budgetStr.replace(/[^0-9.]/g, "").trim();
  if (!sanitized) return null;
  const num = parseFloat(sanitized);
  return Number.isFinite(num) && num > 0 ? num : null;
}

/**
 * Maps the 5-step React form data into the exact nested JSON structure
 * expected by the Flask backend (routes/collaborate.py).
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
 */
export function mapFormDataToBackendPayload(
  data: CollaborationFormData
): BackendCollaborationPayload {
<<<<<<< HEAD
  const companyWebsite = normalizeUrl(data.companyWebsite);
  const contactLinkedin = normalizeUrl(data.linkedInProfile);

  return {
    company: {
      name: (data.companyName || "").trim(),
      website: companyWebsite,
      industry_sectors: Array.isArray(data.industrySector) ? data.industrySector : [],
      size: data.companySize ? data.companySize.trim() : undefined,
      location: (data.companyLocation || "").trim(),
    },
    contact: {
      name: (data.contactPersonName || "").trim() || undefined,
      designation: (data.designationRole || "").trim() || undefined,
      email: (data.officialEmail || "").trim().toLowerCase(),
      phone: (data.phoneWhatsApp || "").trim() || undefined,
      linkedin: contactLinkedin,
    },
    collaboration: {
      title: (data.projectTitle || "").trim() || undefined,
      types: Array.isArray(data.collaborationType) ? data.collaborationType : [],
      description: (data.briefDescription || "").trim() || undefined,
      objective: (data.problemStatement || "").trim() || undefined,
      student_domains: Array.isArray(data.preferredSkills) ? data.preferredSkills : [],
      team_size: (data.preferredTeamSize || "").trim() || undefined,
      duration: (data.expectedDuration || "").trim() || undefined,
=======
  const documents: Array<{ name: string; size: number; type: string }> = [];
  if (data.projectBriefDocument && typeof data.projectBriefDocument === "object") {
    documents.push({
      name: data.projectBriefDocument.name || "attachment",
      size: data.projectBriefDocument.size || 0,
      type: data.projectBriefDocument.type || "application/octet-stream",
    });
  }

  const additionalLinks: string[] = [];
  if (data.additionalLinks?.trim()) {
    const normalized = normalizeUrl(data.additionalLinks);
    if (normalized) {
      additionalLinks.push(normalized);
    }
  }

  const payload: BackendCollaborationPayload = {
    company: {
      name: data.companyName.trim(),
      website: normalizeUrl(data.companyWebsite),
      industry_sectors: Array.isArray(data.industrySector) ? data.industrySector : [],
      size: data.companySize?.trim() || "",
      location: data.companyLocation.trim(),
    },
    contact: {
      name: data.contactPersonName.trim(),
      designation: data.designationRole.trim(),
      email: data.officialEmail.trim().toLowerCase(),
      phone: data.phoneWhatsApp?.trim() || "",
      linkedin: normalizeUrl(data.linkedInProfile),
    },
    collaboration: {
      title: data.projectTitle.trim(),
      types: Array.isArray(data.collaborationType) ? data.collaborationType : [],
      description: data.briefDescription.trim(),
      objective: data.problemStatement.trim(),
      student_domains: Array.isArray(data.preferredSkills) ? data.preferredSkills : [],
      team_size: data.preferredTeamSize?.trim() || "",
      duration: data.expectedDuration?.trim() || "",
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
      deliverables: Array.isArray(data.expectedDeliverables) ? data.expectedDeliverables : [],
    },
    commercial: {
      paid: data.isPaid || "To be discussed",
      budget_inr: parseBudgetInr(data.budgetAmount),
      mentorship: data.mentorship || "To be discussed",
      recognition: data.certificates || "To be discussed",
    },
    timeline: {
<<<<<<< HEAD
      start_date: data.startDate || undefined,
      completion_date: data.endDate || undefined,
      milestones: (data.milestones || "").trim() || undefined,
      business_deadline: data.businessDeadline || "No",
    },
    ip_confidentiality: (data.ipRequirements || "").trim() || undefined,
    documents: data.projectBriefDocument
      ? {
          name: data.projectBriefDocument.name,
          size: data.projectBriefDocument.size,
          type: data.projectBriefDocument.type,
        }
      : null,
    additional_links: parseAdditionalLinks(data.additionalLinks),
    expectations: (data.expectations || "").trim() || undefined,
    additional_comments: (data.additionalComments || "").trim() || undefined,
=======
      start_date: data.startDate?.trim() || "",
      completion_date: data.endDate?.trim() || "",
      milestones: data.milestones?.trim() || "",
      business_deadline: data.businessDeadline || "No",
    },
    expectations: data.expectations?.trim() || "",
    additional_comments: data.additionalComments?.trim() || "",
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
    consent: {
      authorized: Boolean(data.confirmAuthorized),
      contact_allowed: Boolean(data.agreeContacted),
    },
<<<<<<< HEAD
    message: (data.briefDescription || "").trim() || undefined,
  };
}

/**
 * Submits the collaboration request to the backend REST API endpoint POST /api/collaborate.
 * Falls back to local simulated mock when VITE_USE_MOCK_API is explicitly 'true'.
=======
  };

  if (data.ipRequirements?.trim()) {
    payload.ip_confidentiality = data.ipRequirements.trim();
  }

  if (additionalLinks.length > 0) {
    payload.additional_links = additionalLinks;
  }

  if (documents.length > 0) {
    payload.documents = documents;
  }

  return payload;
}

/**
 * Submits the collaboration request to the backend REST endpoint:
 * POST /api/collaborate
 *
 * Upon HTTP 201 response, returns the submission ID and message.
 * After MongoDB save, the backend triggers automated notification emails via routes/collaborate.py -> mail.py.
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
 */
export async function submitCollaborationRequest(
  data: CollaborationFormData
): Promise<CollaborationSubmitResponse> {
<<<<<<< HEAD
  const isMockEnabled =
    typeof import.meta !== "undefined" && import.meta.env?.VITE_USE_MOCK_API === "true";

  if (isMockEnabled) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const forceFailure =
      typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_MOCK_SUBMIT_FAILURE === "true";

    if (forceFailure) {
      throw new ApiClientError(
        "Simulated mock failure triggered by VITE_MOCK_SUBMIT_FAILURE flag.",
        500,
        "MOCK_ERROR"
      );
    }

    const referenceId = `EC-COLLAB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      success: true,
      referenceId,
      message:
        "Thank you for your interest in collaborating with E-Cell. Our team will review your proposal and contact you through the details provided.",
      status: "PENDING",
      submittedAt: new Date().toISOString(),
    };
  }

  const payload = mapFormDataToBackendPayload(data);

  const response = await api.post<BackendCollaborationResponseData>(
    "/api/collaborate",
    payload
  );

  const resData = response.data;
  const referenceId = resData?.id || `EC-COLLAB-${Date.now()}`;
  const message =
    resData?.message ||
    "Thank you for your interest in collaborating with E-Cell. Our team will review your proposal and contact you through the details provided.";

  return {
    success: true,
    referenceId,
    message,
    status: resData?.status || "PENDING",
    submittedAt: resData?.submittedAt,
=======
  // If explicitly configured for offline mock mode
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      referenceId: `EC-MOCK-${Math.floor(1000 + Math.random() * 9000)}`,
      message:
        "Thank you for your interest in collaborating with E-Cell. (Mock Mode Active)",
    };
  }

  const payload = mapFormDataToBackendPayload(data);

  // Directly send request to Flask backend POST /api/collaborate
  const response = await apiClient<BackendCollaborationResponseData>(
    "/api/collaborate",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  return {
    success: true,
    referenceId: response.id || `EC-COLLAB-${Date.now().toString(36).toUpperCase()}`,
    message:
      response.message ||
      "Thank you for your interest in collaborating with E-Cell. Our team will review your proposal and contact you through the details provided.",
    submittedAt: response.submittedAt,
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
  };
}
