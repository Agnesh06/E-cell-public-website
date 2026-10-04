import type { CollaborationFormData } from "@/types/collaboration";

export interface CollaborationSubmitResponse {
  success: boolean;
  referenceId: string;
  message: string;
}

/**
 * Submits the collaboration request.
 * Currently runs in frontend mock mode until the backend API endpoint is provided by the backend team.
 */
export async function submitCollaborationRequest(
  data: CollaborationFormData
): Promise<CollaborationSubmitResponse> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  console.log("[CollaborationService] Received collaboration submission payload:", data);

  const referenceId = `EC-COLLAB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    success: true,
    referenceId,
    message:
      "Thank you for your interest in collaborating with E-Cell. Our team will review your proposal and contact you through the details provided.",
  };
}
