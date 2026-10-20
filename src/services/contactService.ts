import { api } from "@/lib/api";
import type { ContactFormData, ContactSubmitResponse } from "@/types/contact";

/**
 * Submits the visitor contact enquiry to the backend REST API endpoint POST /api/contact.
 * Supports mock mode fallback when VITE_USE_MOCK_API is explicitly 'true'.
 */
export async function submitContactForm(
  data: ContactFormData
): Promise<ContactSubmitResponse> {
  const isMockEnabled =
    typeof import.meta !== "undefined" && import.meta.env?.VITE_USE_MOCK_API === "true";

  if (isMockEnabled) {
    await new Promise((resolve) => setTimeout(resolve, 850));
    return {
      success: true,
      id: `EC-ENQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      message:
        "Thank you for reaching out. The E-Cell coordinator team will respond within 1 business day.",
      status: "UNREAD",
      submittedAt: new Date().toISOString(),
    };
  }

  const payload = {
    fullName: data.fullName.trim(),
    name: data.fullName.trim(), // backward-compatibility alias
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || undefined,
    message: data.message.trim(),
  };

  const response = await api.post<any>("/api/contact", payload);
  const resData = (response as any)?.data || response;

  return {
    success: true,
    id: resData?.id || resData?.submission_id || `EC-ENQ-${Date.now()}`,
    message:
      resData?.message ||
      "Thank you for reaching out. The E-Cell coordinator team will respond within 1 business day.",
    status: resData?.status || "UNREAD",
    submittedAt: resData?.submittedAt || new Date().toISOString(),
  };
}
