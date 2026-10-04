import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CollaborationFormData } from "@/types/collaboration";
import { Building2, UserCheck, Handshake, FileText, CheckCircle2 } from "lucide-react";

export interface ConsentSubmitProps {
  formData: Partial<CollaborationFormData>;
  errors: Record<string, string | undefined>;
  onChange: <K extends keyof CollaborationFormData>(field: K, value: CollaborationFormData[K]) => void;
  onEditStep: (stepIndex: number) => void;
}

export function ConsentSubmit({
  formData,
  errors,
  onChange,
  onEditStep,
}: ConsentSubmitProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Review Summary Cards */}
      <div className="rounded-xl border border-border bg-[#FAFAFC]/60 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-primary" />
            <span>Submission Summary Review</span>
          </h4>
          <span className="text-[11px] text-muted-foreground">Click any section to edit</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Company */}
          <div
            onClick={() => onEditStep(0)}
            className="p-3.5 rounded-lg border border-border/80 bg-surface hover:border-primary/50 cursor-pointer transition-colors space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
              <span className="flex items-center gap-1.5">
                <Building2 className="size-3.5 text-primary" />
                Company Information
              </span>
              <span className="text-[10px] text-primary underline opacity-0 group-hover:opacity-100 transition-opacity">
                Edit
              </span>
            </div>
            <p className="text-xs font-medium text-foreground truncate">
              {formData.companyName || "Not provided"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {formData.companyWebsite || "No website"} • {formData.companyLocation || "No location"}
            </p>
            {formData.industrySector && formData.industrySector.length > 0 && (
              <p className="text-[11px] text-muted-foreground/80 truncate">
                Sector: {formData.industrySector.slice(0, 2).join(", ")}
                {formData.industrySector.length > 2 ? ` +${formData.industrySector.length - 2}` : ""}
              </p>
            )}
          </div>

          {/* Card 2: Contact */}
          <div
            onClick={() => onEditStep(1)}
            className="p-3.5 rounded-lg border border-border/80 bg-surface hover:border-primary/50 cursor-pointer transition-colors space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
              <span className="flex items-center gap-1.5">
                <UserCheck className="size-3.5 text-primary" />
                Point of Contact
              </span>
              <span className="text-[10px] text-primary underline opacity-0 group-hover:opacity-100 transition-opacity">
                Edit
              </span>
            </div>
            <p className="text-xs font-medium text-foreground truncate">
              {formData.contactPersonName || "Not provided"} ({formData.designationRole || "Role"})
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {formData.officialEmail || "No email"}
            </p>
            {formData.phoneWhatsApp && (
              <p className="text-[11px] text-muted-foreground/80 truncate">
                Phone: {formData.phoneWhatsApp}
              </p>
            )}
          </div>

          {/* Card 3: Collaboration */}
          <div
            onClick={() => onEditStep(2)}
            className="p-3.5 rounded-lg border border-border/80 bg-surface hover:border-primary/50 cursor-pointer transition-colors space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
              <span className="flex items-center gap-1.5">
                <Handshake className="size-3.5 text-primary" />
                Collaboration Scope
              </span>
              <span className="text-[10px] text-primary underline opacity-0 group-hover:opacity-100 transition-opacity">
                Edit
              </span>
            </div>
            <p className="text-xs font-medium text-foreground truncate">
              {formData.projectTitle || "Untitled Project"}
            </p>
            {formData.collaborationType && formData.collaborationType.length > 0 && (
              <p className="text-[11px] text-muted-foreground truncate">
                {formData.collaborationType.join(", ")}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground/80 line-clamp-1">
              {formData.briefDescription || "No description"}
            </p>
          </div>

          {/* Card 4: Details & Documents */}
          <div
            onClick={() => onEditStep(3)}
            className="p-3.5 rounded-lg border border-border/80 bg-surface hover:border-primary/50 cursor-pointer transition-colors space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
              <span className="flex items-center gap-1.5">
                <FileText className="size-3.5 text-primary" />
                Commercials & Attachment
              </span>
              <span className="text-[10px] text-primary underline opacity-0 group-hover:opacity-100 transition-opacity">
                Edit
              </span>
            </div>
            <p className="text-xs font-medium text-foreground truncate">
              Paid: {formData.isPaid || "To be discussed"} • Budget: {formData.budgetAmount ? `₹${formData.budgetAmount}` : "Not stated"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              File: {formData.projectBriefDocument?.name || "No document attached"}
            </p>
            <p className="text-[11px] text-muted-foreground/80 line-clamp-1">
              Expectations: {formData.expectations || "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Consent Checkboxes */}
      <div className="rounded-xl border border-primary/20 bg-[#EDEFFC]/40 p-4 sm:p-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
          Required Authorizations & Consents
        </h4>

        <div className="space-y-4">
          <Checkbox
            id="confirmAuthorized"
            checked={formData.confirmAuthorized === true}
            onChange={(e) => onChange("confirmAuthorized", e.target.checked as any)}
            label="I confirm that the information provided above is accurate and that I am authorized to submit this collaboration request on behalf of the organization."
            error={errors.confirmAuthorized}
          />

          <Checkbox
            id="agreeContacted"
            checked={formData.agreeContacted === true}
            onChange={(e) => onChange("agreeContacted", e.target.checked as any)}
            label="I agree to be contacted by the E-Cell team regarding this collaboration request."
            error={errors.agreeContacted}
          />
        </div>
      </div>
    </div>
  );
}

export default ConsentSubmit;
