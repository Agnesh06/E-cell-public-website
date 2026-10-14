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
import { ApiError } from "@/lib/api";

export type SubmitErrorType = "duplicate" | "validation" | "network" | "server" | null;

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
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitErrorType, setSubmitErrorType] = useState<SubmitErrorType>(null);

  const setFieldValue = useCallback((field: any, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitError(null);
    setSubmitErrorType(null);
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
    // Prevent accidental duplicate submissions while already pending
    if (isSubmitting) return false;

    setSubmitError(null);
    setSubmitErrorType(null);

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
      setSubmitErrorType("validation");
      setSubmitError("Please fill out all required fields before submitting.");
      return false;
    }

    try {
      setIsSubmitting(true);
      const res = await submitCollaborationRequest(fullCheck.data);
      setSubmissionReference(res.referenceId);
      setSubmissionMessage(res.message);
      setIsSubmitted(true);
      return true;
    } catch (err: any) {
      console.error("[useCollaborationForm] Submission failed:", err);
      if (err instanceof ApiError) {
        if (err.status === 409 || err.code === "CONFLICT") {
          setSubmitErrorType("duplicate");
          setSubmitError(
            err.message ||
              "A pending collaboration request already exists for this contact. Our team is already reviewing it."
          );
        } else if (err.status === 422 || err.code === "VALIDATION_ERROR") {
          setSubmitErrorType("validation");
          setSubmitError(
            err.message ||
              "Validation failed on the submitted information. Please review your entries and try again."
          );
        } else if (err.status === 0 || err.code === "NETWORK_ERROR") {
          setSubmitErrorType("network");
          setSubmitError(
            "Unable to connect to the backend server. Please verify your connection or that the service is running."
          );
        } else {
          setSubmitErrorType("server");
          setSubmitError(
            err.message ||
              "The server encountered an error while processing your request. Please try again later."
          );
        }
      } else {
        setSubmitErrorType("server");
        setSubmitError(
          err?.message ||
            "An unexpected error occurred while submitting your collaboration request. Please try again."
        );
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, validateStep]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_COLLABORATION_DATA);
    setErrors({});
    setActiveStep(0);
    setIsSubmitted(false);
    setSubmissionReference(null);
    setSubmissionMessage(null);
    setSubmitError(null);
    setSubmitErrorType(null);
  }, []);

  return {
    formData,
    errors,
    activeStep,
    isSubmitting,
    isSubmitted,
    submissionReference,
    submissionMessage,
    submitError,
    submitErrorType,
    setActiveStep,
    setFieldValue,
    validateStep,
    submitForm,
    resetForm,
  };
}
