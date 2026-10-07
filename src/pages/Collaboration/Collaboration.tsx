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
    <section id={id} className="min-h-screen w-full flex flex-col justify-center bg-transparent text-[#0A0A0A] py-10 sm:py-14 px-4 sm:px-6 relative overflow-hidden snap-start scroll-mt-0">

      <div ref={formCardRef} className="max-w-4xl mx-auto flex flex-col items-center w-full">
        {/* Streamlined Clean Header */}
        <div className="text-center max-w-2xl mb-6">
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-[#0A0A0A] leading-tight">
            Let’s Build <span className="text-[#2547FF]">Together</span>
          </h1>

          <p className="mt-2.5 text-sm sm:text-base text-[#262626]/75 leading-relaxed max-w-lg mx-auto">
            Connect with student innovators and startups at PSG Tech.
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
