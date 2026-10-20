import type { ContactSectionConfig } from "@/types/contact";

export const contactSectionConfig: ContactSectionConfig = {
  section: {
    title: "Get in Touch",
    highlightedWord: "Touch",
    description:
      "Have questions about our initiatives, incubation facilities, corporate partnerships, or flagship events? Leave us a message or visit our campus office.",
  },
  contactCards: [
    {
      id: "email",
      label: "Email",
      value: "ecell@psgtech.ac.in",
      icon: "mail",
    },
    {
      id: "phone",
      label: "Phone",
      value: "+91 422 257 2177",
      icon: "phone",
    },
    {
      id: "campus-desk",
      label: "Campus Desk",
      value: "PSG Tech, Peelamedu, Coimbatore - 641004",
      icon: "location",
    },
  ],
  form: {
    action: "/api/contact",
    method: "POST",
    submitButtonText: "Submit Message",
    fields: [
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        required: true,
        placeholder: "e.g. Alex Henderson",
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
        placeholder: "alex@company.com",
      },
      {
        name: "phone",
        label: "Phone",
        type: "tel",
        required: false,
        placeholder: "+91 98765 43210",
      },
      {
        name: "message",
        label: "Message",
        type: "textarea",
        required: true,
        placeholder: "Tell us what you would like to discuss...",
      },
    ],
  },
};
