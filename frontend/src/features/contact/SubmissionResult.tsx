import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Check, ArrowRight, Mail } from "lucide-react";
import * as React from "react";

export interface SubmissionResultProps {
  companyName?: string;
  contactEmail?: string;
  referenceId?: string | null;
  onReset: () => void;
}

export function SubmissionResult({
  companyName,
  contactEmail,
  referenceId = "EC-COLLAB-2026-XXXX",
  onReset,
}: SubmissionResultProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (referenceId) {
      navigator.clipboard.writeText(referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-6 sm:p-10 rounded-2xl border border-border bg-surface text-center shadow-lg space-y-6 animate-scaleUp">
      <div className="size-16 sm:size-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 border border-green-200">
        <CheckCircle2 className="size-10 sm:size-12 stroke-[2.2]" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          Collaboration Request Submitted!
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
          Thank you{companyName ? `, ${companyName}` : ""}. Your request has been logged successfully and forwarded to the E-Cell Industry Relations committee.
        </p>
      </div>

      {/* Reference ID card */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border flex flex-col sm:flex-row items-center justify-between gap-3 max-w-md mx-auto">
        <div className="text-left">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Tracking Reference ID
          </p>
          <p className="text-base font-mono font-bold text-primary">
            {referenceId}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="cursor-pointer gap-1.5 text-xs"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-green-600" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy ID</span>
            </>
          )}
        </Button>
      </div>

      {/* Follow-up Note */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-primary/20 text-xs text-foreground/80 space-y-2 max-w-lg mx-auto text-left">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <Mail className="size-4 shrink-0" />
          <span>Next Steps</span>
        </div>
        <p className="leading-relaxed">
          A confirmation summary has been dispatched to{" "}
          <strong className="text-foreground">{contactEmail || "your registered email"}</strong>.
          A member of the E-Cell Corporate Relations team will follow up within 2–3 business days.
        </p>
      </div>

      <div className="pt-4 flex items-center justify-center gap-3">
        <Button
          type="button"
          onClick={onReset}
          className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer gap-1.5"
        >
          <span>Submit Another Request</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export default SubmissionResult;

