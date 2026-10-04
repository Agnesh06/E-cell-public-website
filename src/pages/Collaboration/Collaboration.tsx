import * as React from "react";
import Stepper03, { type Step } from "@/components/ui/stepper-03";
import { Building2, UserCheck, Handshake, CalendarClock, ShieldCheck, Sparkles } from "lucide-react";
import { CompanyInfo } from "@/components/collaboration/CompanyInfo";
import { ContactInfo } from "@/components/collaboration/ContactInfo";
import { CollaborationDetails } from "@/components/collaboration/CollaborationDetails";
import { CommercialTimeline } from "@/components/collaboration/CommercialTimeline";
import { ConsentSubmit } from "@/components/collaboration/ConsentSubmit";
import { SubmissionResult } from "@/components/collaboration/SubmissionResult";
import { useCollaborationForm } from "@/hooks/useCollaborationForm";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Collaboration({ id = "collaboration" }: { id?: string }) {
  usePageTitle("Industry & Corporate Collaborations");

  const {
    formData,
    errors,
    activeStep,
    isSubmitting,
    isSubmitted,
    setActiveStep,
    setFieldValue,
    validateStep,
    submitForm,
    resetForm,
  } = useCollaborationForm();

  const formCardRef = React.useRef<HTMLDivElement>(null);

  const handleNextStep = async (stepIndex: number): Promise<boolean> => {
    const isValid = validateStep(stepIndex);
    if (!isValid && formCardRef.current) {
      formCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return isValid;
  };

  const handleFormSubmit = async () => {
    const success = await submitForm();
    if (success && formCardRef.current) {
      formCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // 5 Step definitions matching PDF sections 1:1
  const steps: Step[] = [
    {
      title: "Company Info",
      icon: Building2,
      subtitle: "Tell us about your organization.",
      content: (
        <CompanyInfo
          data={formData}
          errors={errors}
          onChange={setFieldValue}
        />
      ),
    },
    {
      title: "Point of Contact",
      icon: UserCheck,
      subtitle: "Tell us who we should coordinate with.",
      content: (
        <ContactInfo
          data={formData}
          errors={errors}
          onChange={setFieldValue}
        />
      ),
    },
    {
      title: "Collaboration Details",
      icon: Handshake,
      subtitle: "Tell us what you would like to collaborate on.",
      content: (
        <CollaborationDetails
          data={formData}
          errors={errors}
          onChange={setFieldValue}
        />
      ),
    },
    {
      title: "Commercial & Timeline",
      icon: CalendarClock,
      subtitle: "Commercial terms, project schedule, documents, and expectations.",
      content: (
        <CommercialTimeline
          data={formData}
          errors={errors}
          onChange={setFieldValue}
        />
      ),
    },
    {
      title: "Consent & Submission",
      icon: ShieldCheck,
      subtitle: "Review your submission and confirm consent.",
      content: (
        <ConsentSubmit
          formData={formData}
          errors={errors}
          onChange={setFieldValue}
          onEditStep={(idx) => setActiveStep(idx)}
        />
      ),
    },
  ];

  return (
    <section id={id} className="min-h-screen bg-[#FAFAFC] text-[#0A0A0A] pt-12 sm:pt-16 pb-24 px-4 sm:px-6 relative overflow-hidden scroll-mt-10">
      {/* Background Decorative Gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#2547FF]/10 via-[#2547FF]/5 to-transparent blur-3xl opacity-70" />
        <div className="absolute -top-40 right-10 w-96 h-96 bg-[#2547FF]/5 rounded-full blur-3xl" />
      </div>

      <div ref={formCardRef} className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Header Section matching exact PDF Copy */}
        <div className="text-center max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDEFFC] text-[#2547FF] border border-[#2547FF]/20 text-xs font-mono font-medium uppercase tracking-wider mb-4">
            <Sparkles className="size-3.5" />
            <span>Industry & Corporate Collaborations</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-[#0A0A0A] leading-tight">
            Industry & Corporate <span className="text-[#2547FF]">Collaborations</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#262626]/80 leading-relaxed max-w-2xl mx-auto">
            Partner with our student community to solve real-world problems, develop innovative solutions, and create meaningful industry-academia opportunities.
          </p>

          <p className="mt-2 text-sm text-[#262626]/65 leading-relaxed max-w-xl mx-auto">
            Have a project, challenge, research requirement, or collaboration opportunity? Tell us about it. Our team will get in touch with you to explore the next steps.
          </p>
        </div>

        {/* Form Wizard or Post-Submission Result */}
        <div className="w-full">
          {isSubmitted ? (
            <SubmissionResult
              companyName={formData.companyName}
              contactEmail={formData.officialEmail}
              onReset={resetForm}
            />
          ) : (
            <Stepper03
              steps={steps}
              activeStep={activeStep}
              onStepChange={setActiveStep}
              onNext={handleNextStep}
              onComplete={handleFormSubmit}
              isSubmitting={isSubmitting}
              submitButtonText="Submit Collaboration Request"
            />
          )}
        </div>
      </div>
    </section>
  );
}
