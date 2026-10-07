import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ContactInfoData } from "@/types/collaboration";

export interface ContactInfoProps {
  data: Partial<ContactInfoData>;
  errors: Record<string, string | undefined>;
  onChange: <K extends keyof ContactInfoData>(field: K, value: ContactInfoData[K]) => void;
}

export function ContactInfo({ data, errors, onChange }: ContactInfoProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 2-Column Responsive Grid: Name & Designation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label required htmlFor="contactPersonName">
            Contact Person Name
          </Label>
          <Input
            id="contactPersonName"
            placeholder="e.g. Sarah Jenkins"
            value={data.contactPersonName || ""}
            onChange={(e) => onChange("contactPersonName", e.target.value)}
            error={errors.contactPersonName}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Full name of the primary contact.
          </p>
        </div>

        <div>
          <Label required htmlFor="designationRole">
            Designation / Role
          </Label>
          <Input
            id="designationRole"
            placeholder="e.g. Head of Talent & Innovation"
            value={data.designationRole || ""}
            onChange={(e) => onChange("designationRole", e.target.value)}
            error={errors.designationRole}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Founder, CEO, HR, Project Manager, CTO, etc.
          </p>
        </div>
      </div>

      {/* 2-Column Responsive Grid: Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label required htmlFor="officialEmail">
            Official Email Address
          </Label>
          <Input
            id="officialEmail"
            type="email"
            placeholder="name@company.com"
            value={data.officialEmail || ""}
            onChange={(e) => onChange("officialEmail", e.target.value)}
            error={errors.officialEmail}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Prefer an organizational email address.
          </p>
        </div>

        <div>
          <Label htmlFor="phoneWhatsApp">
            Phone / WhatsApp Number
          </Label>
          <Input
            id="phoneWhatsApp"
            type="tel"
            placeholder="+91 98765 43210"
            value={data.phoneWhatsApp || ""}
            onChange={(e) => onChange("phoneWhatsApp", e.target.value)}
            error={errors.phoneWhatsApp}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Include country code.
          </p>
        </div>
      </div>

      {/* Full-width: LinkedIn Profile */}
      <div>
        <Label htmlFor="linkedInProfile">LinkedIn Profile</Label>
        <Input
          id="linkedInProfile"
          type="url"
          placeholder="https://linkedin.com/in/username"
          value={data.linkedInProfile || ""}
          onChange={(e) => onChange("linkedInProfile", e.target.value)}
          error={errors.linkedInProfile}
        />
        <p className="mt-1 text-[11px] text-muted-foreground">
          Professional profile of the contact person.
        </p>
      </div>
    </div>
  );
}

export default ContactInfo;
