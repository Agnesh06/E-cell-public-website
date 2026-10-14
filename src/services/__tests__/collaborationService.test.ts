import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  mapFormDataToBackendPayload,
  parseBudgetInr,
  normalizeUrl,
  submitCollaborationRequest,
} from "@/services/collaborationService";
import type { CollaborationFormData } from "@/types/collaboration";
import * as apiModule from "@/lib/api";

describe("Collaboration Service & Payload Mapping", () => {
  describe("normalizeUrl", () => {
    it("prepends https:// if protocol is missing", () => {
      expect(normalizeUrl("example.com")).toBe("https://example.com");
      expect(normalizeUrl("www.linkedin.com/in/test")).toBe("https://www.linkedin.com/in/test");
    });

    it("leaves http:// and https:// URLs unchanged", () => {
      expect(normalizeUrl("https://example.com")).toBe("https://example.com");
      expect(normalizeUrl("http://example.com")).toBe("http://example.com");
    });

    it("returns undefined for empty/null values", () => {
      expect(normalizeUrl("")).toBeUndefined();
      expect(normalizeUrl(undefined)).toBeUndefined();
    });
  });

  describe("parseBudgetInr", () => {
    it("correctly parses numerical and formatted currency strings", () => {
      expect(parseBudgetInr("50000")).toBe(50000);
      expect(parseBudgetInr("50,000")).toBe(50000);
      expect(parseBudgetInr("₹ 1,50,000")).toBe(150000);
      expect(parseBudgetInr("25000.50")).toBe(25000.5);
    });

    it("returns null for non-numeric or empty strings", () => {
      expect(parseBudgetInr("")).toBeNull();
      expect(parseBudgetInr("Flexible")).toBeNull();
      expect(parseBudgetInr("To be discussed")).toBeNull();
      expect(parseBudgetInr(undefined)).toBeNull();
    });
  });

  describe("mapFormDataToBackendPayload", () => {
    const mockFormData: CollaborationFormData = {
      companyName: "Acme Innovations Corp",
      companyWebsite: "acme.com",
      industrySector: ["Technology", "FinTech"],
      companySize: "Startup / Early Stage",
      companyLocation: "Coimbatore, Tamil Nadu, India",
      contactPersonName: "Sarah Jenkins",
      designationRole: "Innovation Lead",
      officialEmail: "sarah@acme.com",
      phoneWhatsApp: "+91 98765 43210",
      linkedInProfile: "linkedin.com/in/sarahjenkins",
      collaborationType: ["Industry Project", "Student Project"],
      projectTitle: "Autonomous Drone Navigation",
      briefDescription: "Developing autonomous indoor navigation for delivery drones.",
      problemStatement: "GPS denied environments make indoor tracking unreliable.",
      preferredSkills: ["AI/ML", "IoT/Embedded"],
      preferredTeamSize: "4–5",
      expectedDuration: "3–6 months",
      expectedDeliverables: ["Prototype", "Working Software"],
      isPaid: "Yes",
      budgetAmount: "₹ 75,000",
      mentorship: "Yes",
      certificates: "Yes",
      ipRequirements: "Standard mutual NDA required.",
      startDate: "2026-11-01",
      endDate: "2027-04-30",
      milestones: "Midterm prototype by Jan 2027",
      businessDeadline: "Yes",
      projectBriefDocument: {
        name: "project_brief.pdf",
        size: 102400,
        type: "application/pdf",
      },
      additionalLinks: "github.com/acme/drone-nav",
      expectations: "Weekly progress syncs and final code repository handover.",
      additionalComments: "Open to co-sponsorship of student hardware kits.",
      confirmAuthorized: true,
      agreeContacted: true,
    };

    it("maps all fields into the exact nested JSON structure expected by routes/collaborate.py", () => {
      const payload = mapFormDataToBackendPayload(mockFormData);

      // Company Info
      expect(payload.company).toEqual({
        name: "Acme Innovations Corp",
        website: "https://acme.com",
        industry_sectors: ["Technology", "FinTech"],
        size: "Startup / Early Stage",
        location: "Coimbatore, Tamil Nadu, India",
      });

      // Contact Info
      expect(payload.contact).toEqual({
        name: "Sarah Jenkins",
        designation: "Innovation Lead",
        email: "sarah@acme.com",
        phone: "+91 98765 43210",
        linkedin: "https://linkedin.com/in/sarahjenkins",
      });

      // Collaboration Details
      expect(payload.collaboration).toEqual({
        title: "Autonomous Drone Navigation",
        types: ["Industry Project", "Student Project"],
        description: "Developing autonomous indoor navigation for delivery drones.",
        objective: "GPS denied environments make indoor tracking unreliable.",
        student_domains: ["AI/ML", "IoT/Embedded"],
        team_size: "4–5",
        duration: "3–6 months",
        deliverables: ["Prototype", "Working Software"],
      });

      // Commercial & Timeline
      expect(payload.commercial).toEqual({
        paid: "Yes",
        budget_inr: 75000,
        mentorship: "Yes",
        recognition: "Yes",
      });

      expect(payload.timeline).toEqual({
        start_date: "2026-11-01",
        completion_date: "2027-04-30",
        milestones: "Midterm prototype by Jan 2027",
        business_deadline: "Yes",
      });

      // Consent & Top-level extras
      expect(payload.consent).toEqual({
        authorized: true,
        contact_allowed: true,
      });

      expect(payload.expectations).toBe("Weekly progress syncs and final code repository handover.");
      expect(payload.additional_comments).toBe("Open to co-sponsorship of student hardware kits.");
      expect(payload.ip_confidentiality).toBe("Standard mutual NDA required.");
      expect(payload.additional_links).toEqual(["https://github.com/acme/drone-nav"]);
      expect(payload.documents).toEqual([
        {
          name: "project_brief.pdf",
          size: 102400,
          type: "application/pdf",
        },
      ]);
    });
  });

  describe("submitCollaborationRequest", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
      vi.stubEnv("VITE_USE_MOCK_API", "false");
    });

    it("sends POST to /api/collaborate and returns referenceId & message", async () => {
      const mockBackendResponse = {
        id: "670cfa3198e72b4859a45612",
        status: "PENDING",
        submittedAt: "2026-10-14T16:30:00Z",
        message: "Thank you for collaborating with E-Cell.",
      };

      vi.spyOn(apiModule, "apiClient").mockResolvedValue(mockBackendResponse);

      const minimalData: CollaborationFormData = {
        companyName: "Acme Corp",
        companyWebsite: "acme.com",
        industrySector: ["Technology"],
        companySize: "",
        companyLocation: "Coimbatore",
        contactPersonName: "Alice",
        designationRole: "CTO",
        officialEmail: "alice@acme.com",
        phoneWhatsApp: "",
        linkedInProfile: "",
        collaborationType: ["Industry Project"],
        projectTitle: "AI Search",
        briefDescription: "Semantic search engine for campus library.",
        problemStatement: "Finding research papers quickly.",
        preferredSkills: [],
        preferredTeamSize: "",
        expectedDuration: "",
        expectedDeliverables: [],
        isPaid: "No",
        budgetAmount: "",
        mentorship: "Yes",
        certificates: "Yes",
        ipRequirements: "",
        startDate: "",
        endDate: "",
        milestones: "",
        businessDeadline: "No",
        projectBriefDocument: null,
        additionalLinks: "",
        expectations: "Supportive guidance and sprint check-ins.",
        additionalComments: "",
        confirmAuthorized: true,
        agreeContacted: true,
      };

      const result = await submitCollaborationRequest(minimalData);

      expect(apiModule.apiClient).toHaveBeenCalledWith(
        "/api/collaborate",
        expect.objectContaining({
          method: "POST",
          body: expect.any(String),
        })
      );

      expect(result.success).toBe(true);
      expect(result.referenceId).toBe("670cfa3198e72b4859a45612");
      expect(result.message).toBe("Thank you for collaborating with E-Cell.");
    });
  });
});
