import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { buildApiUrl, ApiClientError, postJson } from "@/lib/api";
import {
  mapFormDataToBackendPayload,
  normalizeUrl,
  parseBudgetInr,
  parseAdditionalLinks,
  submitCollaborationRequest,
} from "@/services/collaborationService";
import type { CollaborationFormData } from "@/types/collaboration";

describe("API Client & URL Builder", () => {
  it("correctly builds endpoint URL with trailing slash on base URL", () => {
    const url = buildApiUrl("/api/collaborate", "http://localhost:5000/");
    expect(url).toBe("http://localhost:5000/api/collaborate");
  });

  it("prevents double /api/api if base URL already includes /api", () => {
    const url1 = buildApiUrl("/api/collaborate", "http://localhost:5000/api");
    expect(url1).toBe("http://localhost:5000/api/collaborate");

    const url2 = buildApiUrl("/api/collaborate", "http://localhost:5000/api/");
    expect(url2).toBe("http://localhost:5000/api/collaborate");
  });

  it("handles relative paths when base URL is empty", () => {
    const url = buildApiUrl("/api/collaborate", "");
    expect(url).toBe("/api/collaborate");
  });

  it("handles endpoint without leading slash", () => {
    const url = buildApiUrl("api/collaborate", "http://localhost:5000");
    expect(url).toBe("http://localhost:5000/api/collaborate");
  });
});

describe("Payload Transformers & Normalizers", () => {
  it("normalizes URLs to ensure https:// protocol", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com");
    expect(normalizeUrl("http://test.org")).toBe("http://test.org");
    expect(normalizeUrl("https://acme.io")).toBe("https://acme.io");
    expect(normalizeUrl("   ")).toBeNull();
    expect(normalizeUrl(null)).toBeNull();
  });

  it("parses numeric budget in INR", () => {
    expect(parseBudgetInr("50,000")).toBe(50000);
    expect(parseBudgetInr("₹ 75000")).toBe(75000);
    expect(parseBudgetInr("100000.50")).toBe(100000.5);
    expect(parseBudgetInr("Flexible")).toBeNull();
    expect(parseBudgetInr("")).toBeNull();
  });

  it("parses multiple additional links", () => {
    const links = parseAdditionalLinks("github.com/project, drive.google.com/folder\nfigma.com/file");
    expect(links).toEqual([
      "https://github.com/project",
      "https://drive.google.com/folder",
      "https://figma.com/file",
    ]);
    expect(parseAdditionalLinks("")).toEqual([]);
  });

  it("maps form data to the exact backend payload contract", () => {
    const mockFormData: CollaborationFormData = {
      companyName: "Acme Innovations Ltd",
      companyWebsite: "acme.com",
      industrySector: ["Technology", "FinTech"],
      companySize: "Startup / Early Stage",
      companyLocation: "Coimbatore, Tamil Nadu",
      contactPersonName: "Jane Doe",
      designationRole: "CTO",
      officialEmail: "jane@acme.com",
      phoneWhatsApp: "+91 9876543210",
      linkedInProfile: "linkedin.com/in/janedoe",
      collaborationType: ["Project-based R&D", "Student Internship / Hiring"],
      projectTitle: "AI Powered Drone Inspection",
      briefDescription: "Developing autonomous vision inspection systems for agricultural yield assessment.",
      problemStatement: "Current manual crop inspection takes weeks and is prone to human error.",
      preferredSkills: ["Computer Vision", "Python", "Embedded Systems"],
      preferredTeamSize: "3-5 Members",
      expectedDuration: "3 Months",
      expectedDeliverables: ["Working Prototype", "Technical Documentation"],
      isPaid: "Yes",
      budgetAmount: "1,50,000",
      mentorship: "Yes",
      certificates: "Yes",
      ipRequirements: "Company retains commercial IP, academic attribution to student team.",
      startDate: "2026-11-01",
      endDate: "2027-02-01",
      milestones: "Milestone 1 by Nov 30, Prototype by Jan 15",
      businessDeadline: "Yes",
      projectBriefDocument: {
        name: "Acme_RFP_2026.pdf",
        size: 1048576,
        type: "application/pdf",
      } as any,
      additionalLinks: "github.com/acme/project",
      expectations: "Active participation in weekly sprints and direct mentorship with our engineers.",
      additionalComments: "Open to extending pre-placement offers to top performing students.",
      confirmAuthorized: true,
      agreeContacted: true,
    };

    const payload = mapFormDataToBackendPayload(mockFormData);

    expect(payload.company.name).toBe("Acme Innovations Ltd");
    expect(payload.company.website).toBe("https://acme.com");
    expect(payload.company.industry_sectors).toEqual(["Technology", "FinTech"]);
    expect(payload.company.location).toBe("Coimbatore, Tamil Nadu");

    expect(payload.contact.name).toBe("Jane Doe");
    expect(payload.contact.designation).toBe("CTO");
    expect(payload.contact.email).toBe("jane@acme.com");
    expect(payload.contact.linkedin).toBe("https://linkedin.com/in/janedoe");

    expect(payload.collaboration.title).toBe("AI Powered Drone Inspection");
    expect(payload.collaboration.student_domains).toEqual(["Computer Vision", "Python", "Embedded Systems"]);
    expect(payload.commercial.budget_inr).toBe(150000);
    expect(payload.commercial.recognition).toBe("Yes");

    expect(payload.timeline.start_date).toBe("2026-11-01");
    expect(payload.timeline.business_deadline).toBe("Yes");
    expect(payload.documents).toEqual({
      name: "Acme_RFP_2026.pdf",
      size: 1048576,
      type: "application/pdf",
    });
    expect(payload.additional_links).toEqual(["https://github.com/acme/project"]);
    expect(payload.consent).toEqual({
      authorized: true,
      contact_allowed: true,
    });
  });
});

describe("API Error Responses & HTTP Codes", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("handles HTTP 409 conflict duplicate request error", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      headers: {
        get: (h: string) => (h === "content-type" ? "application/json" : null),
      },
      json: async () => ({
        success: false,
        error: {
          code: "CONFLICT",
          message: "A pending collaboration request already exists for this contact",
        },
      }),
    });

    try {
      await postJson("/api/collaborate", {});
      expect.fail("Should have thrown ApiClientError");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiClientError);
      const apiErr = err as ApiClientError;
      expect(apiErr.statusCode).toBe(409);
      expect(apiErr.code).toBe("CONFLICT");
      expect(apiErr.message).toContain("already exists");
    }
  });

  it("handles HTTP 422 validation failure error", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      headers: {
        get: (h: string) => (h === "content-type" ? "application/json" : null),
      },
      json: async () => ({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "company name is required",
        },
      }),
    });

    try {
      await postJson("/api/collaborate", {});
      expect.fail("Should have thrown ApiClientError");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiClientError);
      const apiErr = err as ApiClientError;
      expect(apiErr.statusCode).toBe(422);
      expect(apiErr.code).toBe("VALIDATION_ERROR");
      expect(apiErr.message).toBe("company name is required");
    }
  });

  it("handles HTTP 201 success response with id, status, submittedAt, and message", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      headers: {
        get: (h: string) => (h === "content-type" ? "application/json" : null),
      },
      json: async () => ({
        id: "670f1a2b3c4d5e6f7a8b9c0d",
        status: "PENDING",
        submittedAt: "2026-10-15T00:00:00.000Z",
        message: "Collaboration request submitted successfully. Email notification sent.",
      }),
    });

    const mockFormData = {
      companyName: "PSG Tech Innovators",
      companyWebsite: "psgtech.edu",
      industrySector: ["Education", "Technology"],
      companyLocation: "Coimbatore, India",
      contactPersonName: "Dr. Tech Lead",
      designationRole: "Faculty Incharge",
      officialEmail: "contact@psgtech.edu",
      collaborationType: ["Project-based R&D"],
      projectTitle: "Student Startup Incubator",
      briefDescription: "Incubating deep-tech student startups across hardware and software.",
      problemStatement: "Bridging the gap between student engineering talent and industry deployment.",
      expectations: "Mentorship and industry connectivity.",
      confirmAuthorized: true,
      agreeContacted: true,
    } as any;

    const result = await submitCollaborationRequest(mockFormData);
    expect(result.success).toBe(true);
    expect(result.referenceId).toBe("670f1a2b3c4d5e6f7a8b9c0d");
    expect(result.status).toBe("PENDING");
    expect(result.submittedAt).toBe("2026-10-15T00:00:00.000Z");
    expect(result.message).toContain("submitted successfully");
  });

  it("handles HTTP 422 with string error message from Flask", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      headers: {
        get: (h: string) => (h === "content-type" ? "application/json" : null),
      },
      json: async () => ({
        error: "company.location is required",
      }),
    });

    try {
      await postJson("/api/collaborate", {});
      expect.fail("Should have thrown ApiClientError");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiClientError);
      const apiErr = err as ApiClientError;
      expect(apiErr.statusCode).toBe(422);
      expect(apiErr.message).toBe("company.location is required");
    }
  });

  it("handles HTTP 422 with dictionary errors from Flask", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      headers: {
        get: (h: string) => (h === "content-type" ? "application/json" : null),
      },
      json: async () => ({
        errors: {
          "company.name": "Must be at least 2 characters",
          "contact.email": "Invalid email address",
        },
      }),
    });

    try {
      await postJson("/api/collaborate", {});
      expect.fail("Should have thrown ApiClientError");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiClientError);
      const apiErr = err as ApiClientError;
      expect(apiErr.statusCode).toBe(422);
      expect(apiErr.message).toContain("company.name: Must be at least 2 characters");
      expect(apiErr.message).toContain("contact.email: Invalid email address");
    }
  });

  it("handles network failure without retrying POST", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("Failed to fetch"));
    global.fetch = fetchMock;

    try {
      await postJson("/api/collaborate", {});
      expect.fail("Should have thrown ApiClientError");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiClientError);
      const apiErr = err as ApiClientError;
      expect(apiErr.statusCode).toBe(0);
      expect(apiErr.code).toBe("NETWORK_ERROR");
      // Verify POST is called only once (no duplicate retries)
      expect(fetchMock).toHaveBeenCalledTimes(1);
    }
  });
});
