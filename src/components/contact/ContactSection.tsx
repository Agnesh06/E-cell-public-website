import React, { useState } from 'react';
import { ContactCard } from '@/components/ui/contact-card';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { contactSectionConfig } from '@/data/contact';
import { submitContactForm } from '@/services/contactService';
import type { ContactFormData } from '@/types/contact';

interface ContactSectionProps {
  id?: string;
  className?: string;
}

export function ContactSection({ id = "contact", className = "" }: ContactSectionProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Please provide your full name.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please enter your message.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Please provide a message with at least 10 characters.';
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setApiError(null);
    setIsSubmitting(true);

    try {
      await submitContactForm(formData);
      setIsSubmitted(true);
      setFormData({ fullName: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setApiError(
        err?.message ||
          'Failed to transmit your message. Please check your network connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (apiError) {
      setApiError(null);
    }
  };

  const iconMap = {
    mail: Mail,
    phone: Phone,
    location: MapPin,
  };

  const contactInfo = contactSectionConfig.contactCards.map((card) => ({
    icon: iconMap[card.icon] || Mail,
    label: card.label,
    value: card.value,
    className: card.id === 'campus-desk' ? 'sm:col-span-2 lg:col-span-1' : undefined,
  }));

  const renderTitle = () => {
    const { title, highlightedWord } = contactSectionConfig.section;
    if (!highlightedWord || !title.includes(highlightedWord)) {
      return title;
    }
    const parts = title.split(highlightedWord);
    return (
      <>
        {parts[0]}
        <span className="text-[#2547FF]">{highlightedWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <section
      id={id}
      className={`relative w-full min-h-screen flex flex-col justify-center py-16 sm:py-24 px-3 sm:px-6 md:px-8 bg-transparent text-[#0A0A0A] scroll-mt-0 overflow-x-clip ${className}`}
      aria-label="Direct Contact Section"
    >
      <div className="mx-auto w-full max-w-6xl">
        <ContactCard
          title={renderTitle()}
          description={contactSectionConfig.section.description}
          contactInfo={contactInfo}
        >
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center text-center py-8 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-[#EDEFFC] text-[#2547FF] border border-[#2547FF]/20 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display font-normal text-2xl text-[#0A0A0A]">
                Message Received!
              </h3>
              <p className="font-sans text-sm text-[#262626]/75 max-w-xs leading-[1.6]">
                Thank you for reaching out. The E-Cell coordinator team will respond within 1 business day.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="mt-2 text-xs font-mono uppercase tracking-wider rounded-full border-[#E5E5E7] hover:border-[#0A0A0A]"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {apiError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Transmission Error</p>
                    <p className="mt-0.5 text-red-600/90 leading-relaxed">{apiError}</p>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="contact-fullName" className="text-xs font-mono uppercase tracking-wider text-[#0A0A0A]/70">
                  Full Name <span className="text-[#2547FF]">*</span>
                </Label>
                <Input
                  id="contact-fullName"
                  type="text"
                  placeholder="e.g. Alex Henderson"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  error={errors.fullName}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact-email" className="text-xs font-mono uppercase tracking-wider text-[#0A0A0A]/70">
                  Email Address <span className="text-[#2547FF]">*</span>
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="alex@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact-phone" className="text-xs font-mono uppercase tracking-wider text-[#0A0A0A]/70">
                  Phone (Optional)
                </Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact-message" className="text-xs font-mono uppercase tracking-wider text-[#0A0A0A]/70">
                  Message <span className="text-[#2547FF]">*</span>
                </Label>
                <Textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Tell us what you would like to discuss…"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  error={errors.message}
                  disabled={isSubmitting}
                  className="resize-y"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-full bg-[#2547FF] hover:bg-[#1E3AE0] text-white font-sans font-medium text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Transmitting…</span>
                  </span>
                ) : (
                  <>
                    <span>{contactSectionConfig.form.submitButtonText}</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </form>
          )}
        </ContactCard>
      </div>
    </section>
  );
}

export default ContactSection;
