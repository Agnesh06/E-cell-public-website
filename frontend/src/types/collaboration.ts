import { z } from "zod";
import {
  companyInfoSchema,
  contactInfoSchema,
  collaborationDetailsSchema,
  commercialTimelineSchema,
  consentSchema,
  collaborationFormSchema,
} from "@/schemas/collaboration";

export type CompanyInfoData = z.infer<typeof companyInfoSchema>;
export type ContactInfoData = z.infer<typeof contactInfoSchema>;
export type CollaborationDetailsData = z.infer<typeof collaborationDetailsSchema>;
export type CommercialTimelineData = z.infer<typeof commercialTimelineSchema>;
export type ConsentData = z.infer<typeof consentSchema>;
export type CollaborationFormData = z.infer<typeof collaborationFormSchema>;
