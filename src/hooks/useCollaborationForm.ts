import { useState, useCallback } from "react";
import type { CollaborationFormData } from "@/types/collaboration";
import {
  companyInfoSchema,
  contactInfoSchema,
  collaborationDetailsSchema,
  commercialTimelineSchema,
  consentSchema,
  collaborationFormSchema,
} from "@/schemas/collaboration";
import { submitCollaborationRequest } from "@/services/collaborationService";

export const INITIAL_COLLABORATION_DATA: Partial<CollaborationFormData> = {
  companyName: "",
  companyWebsite: "",
  industrySector: [],
  companySize: "",
  companyLocation: "",
  contactPersonName: "",
  designationRole: "",
  officialEmail: "",
  phoneWhatsApp: "",
  linkedInProfile: "",
  collaborationType: [],
  projectTitle: "",
  briefDescription: "",
  problemStatement: "",
  preferredSkills: [],
  preferredTeamSize: "",
  expectedDuration: "",
  expectedDeliverables: [],
  isPaid: "To be discussed",
  budgetAmount: "",
  mentorship: "To be discussed",
  certificates: "To be discussed",
  ipRequirements: "",
  startDate: "",
  endDate: "",
  milestones: "",
  businessDeadline: "No",
  projectBriefDocument: null,
  additionalLinks: "",
  expectations: "",
  additionalComments: "",
  confirmAuthorized: false,
  agreeContacted: false,
};

export function useCollaborationForm() {
  const [formData, setFormData] = useState<Partial<CollaborationFormData>>(INITIAL_COLLABORATION_DATA);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionReference, setSubmissionReference] = useState<string | null>(null);

  const setFieldValue = useCallback(<K extends keyof CollaborationFormData>(
    field: K,
    value: CollaborationFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (prev[field]) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return prev;
    });
  }, []);

  const validateStep = useCallback((stepIndex: number): boolean => {
    let result;
    if (stepIndex === 0) {
      result = companyInfoSchema.safeParse(formData);
    } else if (stepIndex === 1) {
      result = contactInfoSchema.safeParse(formData);
    } else if (stepIndex === 2) {
      result = collaborationDetailsSchema.safeParse(formData);
    } else if (stepIndex === 3) {
      result = commercialTimelineSchema.safeParse(formData);
    } else if (stepIndex === 4) {
      result = consentSchema.safeParse(formData);
    }

    if (result && !result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        if (path && !newErrors[path]) {
          newErrors[path] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  }, [formData]);

  const submitForm = useCallback(async (): Promise<boolean> => {
    const isConsentValid = validateStep(4);
    if (!isConsentValid) return false;

    const fullCheck = collaborationFormSchema.safeParse(formData);
    if (!fullCheck.success) {
      const newErrors: Record<string, string> = {};
      fullCheck.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        if (path && !newErrors[path]) {
          newErrors[path] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    try {
      setIsSubmitting(true);
      const res = await submitCollaborationRequest(fullCheck.data);
      setSubmissionReference(res.referenceId);
      setIsSubmitted(true);
      return true;
    } catch (err) {
      console.error("Submission failed:", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateStep]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_COLLABORATION_DATA);
    setErrors({});
    setActiveStep(0);
    setIsSubmitted(false);
    setSubmissionReference(null);
  }, []);

  return {
    formData,
    errors,
    activeStep,
    isSubmitting,
    isSubmitted,
    submissionReference,
    setActiveStep,
    setFieldValue,
    validateStep,
    submitForm,
    resetForm,
  };
}
