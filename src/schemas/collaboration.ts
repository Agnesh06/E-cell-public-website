import { z } from "zod";

// Helper for URL validation with flexible protocol
const urlSchema = z.string().trim().refine((val) => {
  if (!val) return true;
  try {
    const url = val.startsWith("http://") || val.startsWith("https://") ? val : `https://${val}`;
    new URL(url);
    return true;
  } catch {
    return false;
  }
}, { message: "Please enter a valid URL." });

// Step 1: Company Information
export const companyInfoSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, { message: "Official company/organization name is required." }),
  companyWebsite: z
    .string()
    .trim()
    .min(1, { message: "Company website is required." })
    .pipe(urlSchema),
  industrySector: z
    .array(z.string())
    .min(1, { message: "Please select at least one industry/sector." }),
  companySize: z.string().optional().default(""),
  companyLocation: z
    .string()
    .trim()
    .min(2, { message: "Company location (City, State, Country) is required." }),
});

// Step 2: Point of Contact
export const contactInfoSchema = z.object({
  contactPersonName: z
    .string()
    .trim()
    .min(2, { message: "Contact person name is required." }),
  designationRole: z
    .string()
    .trim()
    .min(2, { message: "Designation / Role is required." }),
  officialEmail: z
    .string()
    .trim()
    .min(1, { message: "Official email is required." })
    .email({ message: "Please enter a valid email address." }),
  phoneWhatsApp: z.string().trim().optional().default(""),
  linkedInProfile: z
    .string()
    .trim()
    .optional()
    .default("")
    .pipe(urlSchema),
});

// Step 3: Collaboration Details
export const collaborationDetailsSchema = z.object({
  collaborationType: z
    .array(z.string())
    .min(1, { message: "Please select at least one collaboration type." }),
  projectTitle: z
    .string()
    .trim()
    .min(3, { message: "Project / Collaboration title is required." }),
  briefDescription: z
    .string()
    .trim()
    .min(10, { message: "Please provide a brief description (at least 10 characters)." }),
  problemStatement: z
    .string()
    .trim()
    .min(10, { message: "Please describe the problem statement or objective (at least 10 characters)." }),
  preferredSkills: z.array(z.string()).optional().default([]),
  preferredTeamSize: z.string().optional().default(""),
  expectedDuration: z.string().optional().default(""),
  expectedDeliverables: z.array(z.string()).optional().default([]),
});

// Step 4: Commercial, Timeline & Additional Details
export const commercialTimelineSchema = z.object({
  isPaid: z.string().optional().default("To be discussed"),
  budgetAmount: z.string().trim().optional().default(""),
  mentorship: z.string().optional().default("To be discussed"),
  certificates: z.string().optional().default("To be discussed"),
  ipRequirements: z.string().trim().optional().default(""),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  milestones: z.string().trim().optional().default(""),
  businessDeadline: z.string().optional().default("No"),
  projectBriefDocument: z.any().optional(),
  additionalLinks: z.string().trim().optional().default(""),
  expectations: z
    .string()
    .trim()
    .min(10, { message: "Please specify your expectations from E-Cell / Student teams." }),
  additionalComments: z.string().trim().optional().default(""),
});

// Step 5: Consent & Submission
export const consentSchema = z.object({
  confirmAuthorized: z.literal(true, {
    errorMap: () => ({
      message: "You must confirm that information is accurate and you are authorized.",
    }),
  }),
  agreeContacted: z.literal(true, {
    errorMap: () => ({
      message: "You must agree to be contacted by the E-Cell team.",
    }),
  }),
});

// Full Collaboration Form Schema
export const collaborationFormSchema = companyInfoSchema
  .merge(contactInfoSchema)
  .merge(collaborationDetailsSchema)
  .merge(commercialTimelineSchema)
  .merge(consentSchema);

export type CollaborationFormData = z.infer<typeof collaborationFormSchema>;
