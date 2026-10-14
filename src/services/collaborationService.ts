import { api, ApiClientError } from "@/lib/api";
import type { CollaborationFormData } from "@/types/collaboration";

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
  status?: string;
  submittedAt?: string;
}

/**
 * Normalizes a URL ensuring http:// or https:// prefix.
 */
export function normalizeUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
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
 */
export function mapFormDataToBackendPayload(
  data: CollaborationFormData
): BackendCollaborationPayload {
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
      deliverables: Array.isArray(data.expectedDeliverables) ? data.expectedDeliverables : [],
    },
    commercial: {
      paid: data.isPaid || "To be discussed",
      budget_inr: parseBudgetInr(data.budgetAmount),
      mentorship: data.mentorship || "To be discussed",
      recognition: data.certificates || "To be discussed",
    },
    timeline: {
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
    consent: {
      authorized: Boolean(data.confirmAuthorized),
      contact_allowed: Boolean(data.agreeContacted),
    },
    message: (data.briefDescription || "").trim() || undefined,
  };
}

/**
 * Submits the collaboration request to the backend REST API endpoint POST /api/collaborate.
 * Falls back to local simulated mock when VITE_USE_MOCK_API is explicitly 'true'.
 */
export async function submitCollaborationRequest(
  data: CollaborationFormData
): Promise<CollaborationSubmitResponse> {
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
  };
}
