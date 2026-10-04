import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { MultiSelectChips } from "@/components/ui/multi-select-chips";
import { CollaborationDetailsData } from "@/types/collaboration";

const COLLABORATION_TYPES = [
  "Industry Project",
  "Student Project",
  "Research Collaboration",
  "Internship / Talent Development",
  "Hackathon / Challenge",
  "Mentorship",
  "Technical Workshop",
  "Startup / Entrepreneurship Collaboration",
  "Sponsorship",
  "Technology Partnership",
  "Other",
];

const SKILL_SET_OPTIONS = [
  "AI/ML",
  "Web",
  "Mobile",
  "Blockchain/Web3",
  "Cybersecurity",
  "Data Science",
  "IoT/Embedded",
  "Cloud/DevOps",
  "UI/UX",
  "Marketing",
  "Business/Finance",
  "Other",
];

const TEAM_SIZE_OPTIONS = [
  { value: "Individual", label: "Individual" },
  { value: "2–3", label: "2–3 Members" },
  { value: "4–5", label: "4–5 Members" },
  { value: "6–10", label: "6–10 Members" },
  { value: "Flexible", label: "Flexible" },
];

const DURATION_OPTIONS = [
  { value: "<1 month", label: "< 1 month" },
  { value: "1–3 months", label: "1–3 months" },
  { value: "3–6 months", label: "3–6 months" },
  { value: "6+ months", label: "6+ months" },
  { value: "Flexible", label: "Flexible" },
];

const DELIVERABLES_OPTIONS = [
  "Prototype",
  "Working Software",
  "Research Report",
  "Proof of Concept",
  "MVP",
  "Market Research",
  "Business Strategy",
  "Technical Documentation",
  "Other",
];

export interface CollaborationDetailsProps {
  data: Partial<CollaborationDetailsData>;
  errors: Record<string, string | undefined>;
  onChange: <K extends keyof CollaborationDetailsData>(field: K, value: CollaborationDetailsData[K]) => void;
}

export function CollaborationDetails({ data, errors, onChange }: CollaborationDetailsProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Collaboration Type Multi-select */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label required className="mb-0">
            Collaboration Type
          </Label>
          <span className="text-[11px] text-muted-foreground">Select all that apply</span>
        </div>
        <MultiSelectChips
          options={COLLABORATION_TYPES}
          value={data.collaborationType || []}
          onChange={(val) => onChange("collaborationType", val)}
          error={errors.collaborationType}
        />
        <p className="mt-1 text-[11px] text-muted-foreground">
          Industry Project, Student Project, Research, Mentorship, Sponsorship, Workshop, etc.
        </p>
      </div>

      {/* Project Title */}
      <div>
        <Label required htmlFor="projectTitle">
          Project / Collaboration Title
        </Label>
        <Input
          id="projectTitle"
          placeholder="e.g. Autonomous Campus Navigation System / AI Incubation Cohort"
          value={data.projectTitle || ""}
          onChange={(e) => onChange("projectTitle", e.target.value)}
          error={errors.projectTitle}
        />
        <p className="mt-1 text-[11px] text-muted-foreground">
          Short, descriptive title.
        </p>
      </div>

      {/* 2-Column Grid: Brief Description & Problem Statement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label required htmlFor="briefDescription">
            Brief Description of Requirement
          </Label>
          <Textarea
            id="briefDescription"
            rows={4}
            placeholder="Describe the initiative, scope of partnership, or student engagement format..."
            value={data.briefDescription || ""}
            onChange={(e) => onChange("briefDescription", e.target.value)}
            error={errors.briefDescription}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Describe the project, problem, opportunity, or requirement.
          </p>
        </div>

        <div>
          <Label required htmlFor="problemStatement">
            Problem Statement / Objective
          </Label>
          <Textarea
            id="problemStatement"
            rows={4}
            placeholder="What core challenge or opportunity will this address? What is the expected outcome?"
            value={data.problemStatement || ""}
            onChange={(e) => onChange("problemStatement", e.target.value)}
            error={errors.problemStatement}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Explain the problem to solve and the intended outcome.
          </p>
        </div>
      </div>

      {/* Preferred Student Domain / Skill Set */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="mb-0">Preferred Student Domain / Skill Set</Label>
          <span className="text-[11px] text-muted-foreground">Optional</span>
        </div>
        <MultiSelectChips
          options={SKILL_SET_OPTIONS}
          value={data.preferredSkills || []}
          onChange={(val) => onChange("preferredSkills", val)}
          error={errors.preferredSkills}
        />
        <p className="mt-1 text-[11px] text-muted-foreground">
          AI/ML, Web, Mobile, Blockchain/Web3, Cybersecurity, UI/UX, Cloud, etc.
        </p>
      </div>

      {/* 2-Column Responsive Grid: Team Size & Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="preferredTeamSize">Preferred Team Size</Label>
          <Select
            id="preferredTeamSize"
            placeholder="Select preferred team size (optional)"
            value={data.preferredTeamSize || ""}
            onChange={(e) => onChange("preferredTeamSize", e.target.value)}
            options={TEAM_SIZE_OPTIONS}
            error={errors.preferredTeamSize}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Individual; 2–3; 4–5; 6–10; Flexible.
          </p>
        </div>

        <div>
          <Label htmlFor="expectedDuration">Expected Project Duration</Label>
          <Select
            id="expectedDuration"
            placeholder="Select expected duration (optional)"
            value={data.expectedDuration || ""}
            onChange={(e) => onChange("expectedDuration", e.target.value)}
            options={DURATION_OPTIONS}
            error={errors.expectedDuration}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            &lt;1 month; 1–3 months; 3–6 months; 6+ months; Flexible.
          </p>
        </div>
      </div>

      {/* Expected Deliverables */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="mb-0">Expected Deliverables</Label>
          <span className="text-[11px] text-muted-foreground">Optional</span>
        </div>
        <MultiSelectChips
          options={DELIVERABLES_OPTIONS}
          value={data.expectedDeliverables || []}
          onChange={(val) => onChange("expectedDeliverables", val)}
          error={errors.expectedDeliverables}
        />
        <p className="mt-1 text-[11px] text-muted-foreground">
          Prototype; Working Software; Research Report; MVP; Market Strategy; Documentation.
        </p>
      </div>
    </div>
  );
}

export default CollaborationDetails;
