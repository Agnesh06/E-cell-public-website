export interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactSubmitResponse {
  success: boolean;
  id: string;
  message: string;
  status?: string;
  submittedAt: string;
}

export interface ContactCardItem {
  id: string;
  label: string;
  value: string;
  icon: "mail" | "phone" | "location";
}

export interface ContactFieldConfig {
  name: keyof ContactFormData;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  required: boolean;
  placeholder: string;
}

export interface ContactSectionConfig {
  section: {
    title: string;
    highlightedWord: string;
    description: string;
  };
  contactCards: ContactCardItem[];
  form: {
    action: string;
    method: "POST" | "GET";
    submitButtonText: string;
    fields: ContactFieldConfig[];
  };
}
