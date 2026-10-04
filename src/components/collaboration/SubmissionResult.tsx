import * as React from "react";
import { CheckCircle2, ArrowRight, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface SubmissionResultProps {
  companyName?: string;
  contactEmail?: string;
  onReset: () => void;
}

export function SubmissionResult({
  companyName,
  contactEmail,
  onReset,
}: SubmissionResultProps) {
  const refId = React.useMemo(() => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `EC-COLLAB-2026-${random}`;
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl text-center py-6 animate-fadeIn">
      <div className="rounded-2xl border border-emerald-500/20 bg-surface p-6 sm:p-10 shadow-sm space-y-6">
        {/* Success Icon */}
        <div className="mx-auto size-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shadow-xs">
          <CheckCircle2 className="size-9 stroke-[2.2]" />
        </div>

        {/* Section Heading & Confirmation Text */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-medium">
            <span>Reference: {refId}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
            Collaboration Request Received!
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Thank you for your interest in collaborating with E-Cell. Our team will review your proposal and contact you through the details provided.
          </p>
        </div>

        {/* Info summary card */}
        {(companyName || contactEmail) && (
          <div className="p-4 rounded-xl border border-border bg-[#FAFAFC] max-w-md mx-auto text-left text-xs space-y-1.5 text-muted-foreground">
            {companyName && (
              <p>
                <span className="font-semibold text-foreground">Organization:</span> {companyName}
              </p>
            )}
            {contactEmail && (
              <p>
                <span className="font-semibold text-foreground">Contact Email:</span> {contactEmail}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground/75 pt-1 border-t border-border/60">
              A member of the E-Cell Corporate Relations team will follow up within 2–3 business days.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="cursor-pointer gap-2 w-full sm:w-auto"
          >
            <RefreshCw className="size-4" />
            <span>Submit Another Request</span>
          </Button>

          <Link to="/" className="w-full sm:w-auto">
            <Button className="cursor-pointer gap-2 w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Home className="size-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SubmissionResult;
