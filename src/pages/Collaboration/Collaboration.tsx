import * as React from "react";
import { useNavigate } from "react-router-dom";
import Stepper03, { type Step } from "@/components/ui/stepper-03";
import { Building2, UserCheck, Handshake, CalendarClock, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
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
    submissionReference,
<<<<<<< HEAD
    submitError,
=======
    submissionMessage,
    submitError,
    submitErrorType,
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
    setActiveStep,
    setFieldValue,
    validateStep,
    submitForm,
    resetForm,
  } = useCollaborationForm();

  const navigate = useNavigate();
  const formCardRef = React.useRef<HTMLDivElement>(null);

  const handleScrollToContact = () => {
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#contact");
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

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
          submitError={submitError}
          submitErrorType={submitErrorType}
        />
      ),
    },
  ];

  return (
<<<<<<< HEAD
    <section id={id} className="min-h-screen w-full flex flex-col justify-center bg-transparent text-[#0A0A0A] py-10 sm:py-14 px-4 sm:px-6 relative overflow-hidden scroll-mt-0">
=======
    <section id={id} className="min-h-0 lg:min-h-screen w-full flex flex-col justify-center bg-transparent text-[#0A0A0A] py-8 sm:py-14 px-3 sm:px-6 relative overflow-hidden scroll-mt-0">
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01

      <div ref={formCardRef} className="max-w-4xl mx-auto flex flex-col items-center w-full">
        {/* Streamlined Clean Header */}
        <div className="text-center max-w-2xl mb-5 sm:mb-6">
          <h1 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl tracking-[-0.025em] text-[#0A0A0A] leading-[1.15]">
            Let’s Build <span className="text-[#2547FF]">Together</span>
          </h1>

          <p className="font-sans font-normal mt-2.5 text-base text-[#262626]/75 leading-[1.6] max-w-lg mx-auto">
            Connect with student innovators and startups at PSG Tech.
          </p>
        </div>

        {/* Form Wizard or Post-Submission Result */}
        <div className="w-full">
          {submitError && !isSubmitted && (
            <div
              className="mb-4 p-4 rounded-xl border border-red-500/20 bg-red-50/90 text-red-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn shadow-xs"
              role="alert"
            >
              <AlertCircle className="size-4 sm:size-5 shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">Submission Notice</p>
                <p className="mt-0.5 leading-relaxed">{submitError}</p>
              </div>
            </div>
          )}

          {isSubmitted ? (
            <SubmissionResult
              referenceId={submissionReference}
              message={submissionMessage}
              companyName={formData.companyName}
              contactEmail={formData.officialEmail}
              referenceId={submissionReference || undefined}
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

        {/* Laptop View Only: Indication button for 'Get in Touch' section below */}
        <div className="hidden lg:flex justify-center mt-8">
          <button
            type="button"
            onClick={handleScrollToContact}
            className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-sans font-medium tracking-wider text-[#262626]/80 hover:text-[#2547FF] uppercase transition-all cursor-pointer group py-3 px-7 rounded-full border border-black/10 bg-white/90 hover:bg-white shadow-xs hover:shadow-md hover:border-[#2547FF]/30 active:scale-95 text-center"
            aria-label="Scroll down to contact section"
          >
            <span>looking for queries?</span>
            <span className="text-[#2547FF] transition-transform group-hover:translate-y-0.5">↓</span>
          </button>
        </div>
      </div>
    </section>
  );
}
