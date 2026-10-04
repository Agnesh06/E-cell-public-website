import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { MultiSelectChips } from "@/components/ui/multi-select-chips";
import { CompanyInfoData } from "@/types/collaboration";

const INDUSTRY_OPTIONS = [
  "Technology",
  "FinTech",
  "EdTech",
  "Healthcare",
  "Manufacturing",
  "Automotive",
  "Consulting",
  "Finance",
  "E-commerce",
  "Sustainability",
  "Media & Marketing",
  "Other",
];

const COMPANY_SIZE_OPTIONS = [
  { value: "Startup / Early Stage", label: "Startup / Early Stage" },
  { value: "SME", label: "SME (Small/Medium Enterprise)" },
  { value: "Large Enterprise", label: "Large Enterprise" },
  { value: "MNC", label: "Multinational Corporation (MNC)" },
  { value: "Other", label: "Other" },
];

export interface CompanyInfoProps {
  data: Partial<CompanyInfoData>;
  errors: Record<string, string | undefined>;
  onChange: <K extends keyof CompanyInfoData>(field: K, value: CompanyInfoData[K]) => void;
}

export function CompanyInfo({ data, errors, onChange }: CompanyInfoProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 2-Column Responsive Grid: Company Name & Website */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label required htmlFor="companyName">
            Company Name
          </Label>
          <Input
            id="companyName"
            placeholder="e.g. Acme Innovations Corp"
            value={data.companyName || ""}
            onChange={(e) => onChange("companyName", e.target.value)}
            error={errors.companyName}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Official / registered company or organization name.
          </p>
        </div>

        <div>
          <Label required htmlFor="companyWebsite">
            Company Website
          </Label>
          <Input
            id="companyWebsite"
            type="url"
            placeholder="https://example.com"
            value={data.companyWebsite || ""}
            onChange={(e) => onChange("companyWebsite", e.target.value)}
            error={errors.companyWebsite}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Official website.
          </p>
        </div>
      </div>

      {/* Industry / Sector Multi-Select */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label required className="mb-0">
            Industry / Sector
          </Label>
          <span className="text-[11px] text-muted-foreground">Select one or more</span>
        </div>
        <MultiSelectChips
          options={INDUSTRY_OPTIONS}
          value={data.industrySector || []}
          onChange={(val) => onChange("industrySector", val)}
          error={errors.industrySector}
        />
        <p className="mt-1 text-[11px] text-muted-foreground">
          Select all domains relevant to your company.
        </p>
      </div>

      {/* 2-Column Responsive Grid: Company Size & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="companySize">Company Size</Label>
          <Select
            id="companySize"
            placeholder="Select company size (optional)"
            value={data.companySize || ""}
            onChange={(e) => onChange("companySize", e.target.value)}
            options={COMPANY_SIZE_OPTIONS}
            error={errors.companySize}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Startup / Early Stage, SME, Large Enterprise, MNC, Other.
          </p>
        </div>

        <div>
          <Label required htmlFor="companyLocation">
            Company Location
          </Label>
          <Input
            id="companyLocation"
            placeholder="e.g. Coimbatore, Tamil Nadu, India"
            value={data.companyLocation || ""}
            onChange={(e) => onChange("companyLocation", e.target.value)}
            error={errors.companyLocation}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            City, State, Country.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CompanyInfo;
