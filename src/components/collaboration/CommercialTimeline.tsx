import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup } from "@/components/ui/radio-group";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { CommercialTimelineData } from "@/types/collaboration";

const THREE_CHOICE_OPTIONS = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "To be discussed", label: "To be discussed" },
];

const YES_NO_OPTIONS = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

export interface CommercialTimelineProps {
  data: Partial<CommercialTimelineData>;
  errors: Record<string, string | undefined>;
  onChange: <K extends keyof CommercialTimelineData>(field: K, value: CommercialTimelineData[K]) => void;
}

export function CommercialTimeline({ data, errors, onChange }: CommercialTimelineProps) {
  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Group 1: Commercials */}
      <div className="rounded-xl border border-border/70 bg-[#FAFAFC]/60 p-4 sm:p-5 space-y-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <span>Commercials & Engagement Structure</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label className="mb-2">Is the Collaboration Paid?</Label>
            <RadioGroup
              name="isPaid"
              options={THREE_CHOICE_OPTIONS}
              value={data.isPaid || "To be discussed"}
              onChange={(val) => onChange("isPaid", val)}
              error={errors.isPaid}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Yes; No; To be discussed.
            </p>
          </div>

          <div>
            <Label htmlFor="budgetAmount">Estimated Budget / Funding</Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">
                ₹
              </span>
              <Input
                id="budgetAmount"
                className="pl-8"
                placeholder="e.g. 50,000 or Flexible"
                value={data.budgetAmount || ""}
                onChange={(e) => onChange("budgetAmount", e.target.value)}
                error={errors.budgetAmount}
              />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Optional budget range or amount in INR.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          <div>
            <Label className="mb-2">Mentorship / Technical Guidance</Label>
            <RadioGroup
              name="mentorship"
              options={THREE_CHOICE_OPTIONS}
              value={data.mentorship || "To be discussed"}
              onChange={(val) => onChange("mentorship", val)}
              error={errors.mentorship}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Yes; No; To be discussed.
            </p>
          </div>

          <div>
            <Label className="mb-2">Certificates / Recognition</Label>
            <RadioGroup
              name="certificates"
              options={THREE_CHOICE_OPTIONS}
              value={data.certificates || "To be discussed"}
              onChange={(val) => onChange("certificates", val)}
              error={errors.certificates}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Yes; No; To be discussed.
            </p>
          </div>
        </div>
      </div>

      {/* Group 2: Timeline & Dates */}
      <div className="rounded-xl border border-border/70 bg-[#FAFAFC]/60 p-4 sm:p-5 space-y-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Timeline & Schedule
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="startDate">Preferred Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={data.startDate || ""}
              onChange={(e) => onChange("startDate", e.target.value)}
              error={errors.startDate}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Expected project start.
            </p>
          </div>

          <div>
            <Label htmlFor="endDate">Expected Completion Date</Label>
            <Input
              id="endDate"
              type="date"
              value={data.endDate || ""}
              onChange={(e) => onChange("endDate", e.target.value)}
              error={errors.endDate}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Expected completion.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label className="mb-2">Business Deadline?</Label>
            <RadioGroup
              name="businessDeadline"
              options={YES_NO_OPTIONS}
              value={data.businessDeadline || "No"}
              onChange={(val) => onChange("businessDeadline", val)}
              error={errors.businessDeadline}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Yes; No.
            </p>
          </div>

          <div>
            <Label htmlFor="milestones">Important Milestones / Deadlines</Label>
            <Input
              id="milestones"
              placeholder="e.g. Mid-term review by Nov 15th, Final demo by Dec 10th"
              value={data.milestones || ""}
              onChange={(e) => onChange("milestones", e.target.value)}
              error={errors.milestones}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Any business or event deadlines.
            </p>
          </div>
        </div>
      </div>

      {/* Group 3: File Upload & Additional Links */}
      <div className="space-y-5">
        <div>
          <Label>Project Brief / Requirement Document</Label>
          <FileDropzone
            value={data.projectBriefDocument || null}
            onChange={(file) => onChange("projectBriefDocument", file)}
            error={errors.projectBriefDocument}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Attach RFP, proposal, pitch deck, or problem specification (PDF, DOC/DOCX, PPT/PPTX).
          </p>
        </div>

        <div>
          <Label htmlFor="additionalLinks">Additional Links</Label>
          <Input
            id="additionalLinks"
            placeholder="e.g. GitHub repo, Google Drive folder, product demo, Figma link"
            value={data.additionalLinks || ""}
            onChange={(e) => onChange("additionalLinks", e.target.value)}
            error={errors.additionalLinks}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            GitHub, product/demo, documentation, Drive folder, etc.
          </p>
        </div>
      </div>

      {/* Group 4: Expectations & IP */}
      <div className="space-y-5">
        <div>
          <Label required htmlFor="expectations">
            Expectations from E-Cell / Student Teams
          </Label>
          <Textarea
            id="expectations"
            rows={3}
            placeholder="Specify required student roles, time commitments, weekly sync expectations, or tangible deliverables..."
            value={data.expectations || ""}
            onChange={(e) => onChange("expectations", e.target.value)}
            error={errors.expectations}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Resources, expertise, responsibilities, or outcomes expected.
          </p>
        </div>

        <div>
          <Label htmlFor="ipRequirements">IP / Confidentiality Requirements</Label>
          <Textarea
            id="ipRequirements"
            rows={2}
            placeholder="e.g. Requires standard mutual NDA, student owns academic attribution, company retains commercial IP..."
            value={data.ipRequirements || ""}
            onChange={(e) => onChange("ipRequirements", e.target.value)}
            error={errors.ipRequirements}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Mention NDA, IP ownership, confidentiality, data access, or related requirements.
          </p>
        </div>

        <div>
          <Label htmlFor="additionalComments">Additional Comments / Requirements</Label>
          <Textarea
            id="additionalComments"
            rows={2}
            placeholder="Any other details, preferences, or notes for our partnership committee..."
            value={data.additionalComments || ""}
            onChange={(e) => onChange("additionalComments", e.target.value)}
            error={errors.additionalComments}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Anything else relevant to the collaboration.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CommercialTimeline;
