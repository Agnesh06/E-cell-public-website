import React, { useState } from 'react';
import { ContactCard } from '@/components/ui/contact-card';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface ContactSectionProps {
  id?: string;
  className?: string;
}

export function ContactSection({ id = "contact", className = "" }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) errs.message = 'Please enter your message.';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate reliable dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 900);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <section
      id={id}
      className={`relative w-full min-h-screen flex flex-col justify-center py-12 sm:py-24 px-3 sm:px-6 md:px-8 bg-transparent text-[#0A0A0A] scroll-mt-0 overflow-hidden ${className}`}
      aria-label="Direct Contact Section"
    >
      <div className="mx-auto w-full max-w-6xl min-w-0">
        <ContactCard
          title={
            <>
              Get in <span className="text-[#2547FF]">Touch</span>
            </>
          }
          description="Have questions about our initiatives, incubation facilities, corporate partnerships, or flagship events? Leave us a message or visit our campus office."
          contactInfo={[
            {
              icon: Mail,
              label: 'Email',
              value: 'csea.cse@psgtech.ac.in',
            },
            {
              icon: Phone,
              label: 'Phone',
              value: '+91 422 257 2177',
            },
            {
              icon: MapPin,
              label: 'Campus Desk',
              value: 'PSG Tech, Peelamedu, Coimbatore - 641004',
              className: 'sm:col-span-2 lg:col-span-1',
            },
          ]}
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
              <div className="space-y-1.5">
                <Label htmlFor="contact-name" className="text-xs font-mono uppercase tracking-wider text-[#0A0A0A]/70">
                  Full Name <span className="text-[#2547FF]">*</span>
                </Label>
                <Input
                  id="contact-name"
                  type="text"
                  placeholder="e.g. Alex Henderson"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
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
                    <span>Submit Message</span>
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
