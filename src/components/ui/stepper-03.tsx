import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Building2,
  UserCheck,
  Handshake,
  CalendarClock,
  ShieldCheck,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface Step {
  title: string;
  icon: LucideIcon;
  content: React.ReactNode;
  subtitle?: string;
}

const defaultSteps: Step[] = [
  {
    title: "Company Info",
    icon: Building2,
    content: "Company information details are here",
    subtitle: "Tell us about your organization.",
  },
  {
    title: "Point of Contact",
    icon: UserCheck,
    content: "Point of contact details are here",
    subtitle: "Tell us who we should coordinate with.",
  },
  {
    title: "Collaboration",
    icon: Handshake,
    content: "Collaboration details are here",
    subtitle: "Tell us what you would like to collaborate on.",
  },
  {
    title: "Timeline & Details",
    icon: CalendarClock,
    content: "Commercial and timeline details are here",
    subtitle: "Commercials, timeline, documents & expectations.",
  },
  {
    title: "Consent & Submit",
    icon: ShieldCheck,
    content: "Consent and review details are here",
    subtitle: "Review details, accept consent, and submit.",
  },
];

export interface Stepper03Props {
  steps?: Step[];
  activeStep?: number;
  onStepChange?: (step: number) => void;
  onNext?: (currentStep: number) => boolean | Promise<boolean>;
  onComplete?: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  className?: string;
}

export default function Stepper03({
  steps = defaultSteps,
  activeStep: controlledActiveStep,
  onStepChange,
  onNext,
  onComplete,
  isSubmitting = false,
  submitButtonText = "Submit Collaboration Request",
  className,
}: Stepper03Props = {}) {
  const [internalActiveStep, setInternalActiveStep] = useState(0);
  const activeStep =
    controlledActiveStep !== undefined ? controlledActiveStep : internalActiveStep;
  const prefersReducedMotion = useReducedMotion();

  const totalSteps = steps.length;
  const progress = totalSteps > 1 ? activeStep / (totalSteps - 1) : 0;
  
  // Dynamic offset and span based on step count
  const offsetPercent = totalSteps > 0 ? 100 / (2 * totalSteps) : 10;
  const spanPercent = 100 - offsetPercent * 2;

  const handleNext = async () => {
    if (onNext) {
      const allowed = await onNext(activeStep);
      if (!allowed) return;
    }
    if (activeStep < totalSteps - 1) {
      const next = activeStep + 1;
      setInternalActiveStep(next);
      onStepChange?.(next);
    } else {
      onComplete?.();
    }
  };

  const handleBack = () => {
    const prev = Math.max(0, activeStep - 1);
    setInternalActiveStep(prev);
    onStepChange?.(prev);
  };

  const handleStepClick = async (index: number) => {
    if (index === activeStep) return;
    if (index < activeStep) {
      setInternalActiveStep(index);
      onStepChange?.(index);
    } else if (index === activeStep + 1 && onNext) {
      const allowed = await onNext(activeStep);
      if (allowed) {
        setInternalActiveStep(index);
        onStepChange?.(index);
      }
    }
  };

  return (
    <div className={cn("mx-auto w-full max-w-4xl", className)}>
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-7 md:p-9 flex flex-col gap-7 shadow-sm">
        {/* Progress track & step circles */}
        <div className="relative">
          <div
            className="absolute top-5 h-0.5 bg-border"
            style={{
              left: `${offsetPercent}%`,
              right: `${offsetPercent}%`,
            }}
          />
          <motion.div
            className="absolute top-5 h-0.5 bg-primary origin-left"
            style={{
              left: `${offsetPercent}%`,
              right: `${offsetPercent}%`,
            }}
            initial={false}
            animate={{ scaleX: progress }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
          <motion.span
            className="absolute size-2 rounded-full bg-primary"
            style={{ top: 21, x: "-50%", y: "-50%" }}
            initial={{ left: `${offsetPercent}%` }}
            animate={{ left: `${offsetPercent + progress * spanPercent}%` }}
            transition={{ type: "spring", stiffness: 160, damping: 24 }}
          />
          <div className="relative flex items-start justify-between">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              return (
                <div
                  key={step.title}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => handleStepClick(index)}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`${step.title} step`}
                    className="group relative z-10 flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span
                      className={cn(
                        "absolute inset-0 rounded-full transition-colors duration-300",
                        isCompleted || isActive
                          ? "bg-primary"
                          : "bg-muted group-hover:bg-muted/80"
                      )}
                    />
                    {isActive && !prefersReducedMotion && (
                      <motion.span
                        className="absolute inset-0 rounded-full ring-2 ring-primary/50"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{
                          scale: [1, 1.45, 1],
                          opacity: [1, 0.2, 1],
                        }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          repeatType: "mirror",
                          ease: "easeInOut",
                        }}
                      />
                    )}
                    <motion.div
                      className="relative flex items-center justify-center"
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 18,
                      }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isCompleted ? (
                          <motion.span
                            key="check"
                            initial={{ scale: 0, rotate: -90, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: 90, opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 22,
                            }}
                            className="flex items-center justify-center text-primary-foreground"
                          >
                            <Check className="size-5" strokeWidth={3} />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="icon"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 22,
                            }}
                            className="flex items-center justify-center"
                          >
                            <step.icon
                              className={cn(
                                "size-5",
                                isActive
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground"
                              )}
                            />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </button>
                  <span
                    className={cn(
                      "text-[11px] sm:text-xs font-medium transition-colors duration-300 text-center line-clamp-1 sm:line-clamp-none max-w-[65px] sm:max-w-[110px]",
                      isActive || isCompleted
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content area */}
        <div className="min-h-36 py-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="text-center space-y-1 mb-5">
                <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                  {steps[activeStep]?.title}
                </h3>
                {steps[activeStep]?.subtitle && (
                  <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                    {steps[activeStep].subtitle}
                  </p>
                )}
              </div>
              
              {typeof steps[activeStep]?.content === "string" ? (
                <div className="max-w-md mx-auto space-y-1 text-center">
                  <p className="text-sm text-muted-foreground">
                    {steps[activeStep].content}
                  </p>
                </div>
              ) : (
                <div className="w-full text-left">
                  {steps[activeStep]?.content}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <Separator />

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={activeStep === 0 || isSubmitting}
            className="cursor-pointer gap-1"
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">
            Step <span className="text-foreground font-semibold">{activeStep + 1}</span> of {totalSteps}
          </p>
          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="cursor-pointer gap-1.5 min-w-[110px] bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : activeStep === totalSteps - 1 ? (
              <>
                <span>{submitButtonText}</span>
                <Check className="size-4" />
              </>
            ) : (
              <>
                <span>Continue</span>
                <ChevronRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
