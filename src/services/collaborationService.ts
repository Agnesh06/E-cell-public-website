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

export interface CollaborationSubmitResponse {
  success: boolean;
  referenceId: string;
  message: string;
  submittedAt?: string;
}

/**
 * Normalizes URL strings ensuring valid protocol for backend's validate_url check.
 */
export function normalizeUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
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
 */
export function mapFormDataToBackendPayload(
  data: CollaborationFormData
): BackendCollaborationPayload {
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
      deliverables: Array.isArray(data.expectedDeliverables) ? data.expectedDeliverables : [],
    },
    commercial: {
      paid: data.isPaid || "To be discussed",
      budget_inr: parseBudgetInr(data.budgetAmount),
      mentorship: data.mentorship || "To be discussed",
      recognition: data.certificates || "To be discussed",
    },
    timeline: {
      start_date: data.startDate?.trim() || "",
      completion_date: data.endDate?.trim() || "",
      milestones: data.milestones?.trim() || "",
      business_deadline: data.businessDeadline || "No",
    },
    expectations: data.expectations?.trim() || "",
    additional_comments: data.additionalComments?.trim() || "",
    consent: {
      authorized: Boolean(data.confirmAuthorized),
      contact_allowed: Boolean(data.agreeContacted),
    },
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
 */
export async function submitCollaborationRequest(
  data: CollaborationFormData
): Promise<CollaborationSubmitResponse> {
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
  };
}
