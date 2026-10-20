import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, PlusIcon } from 'lucide-react';

export type ContactInfoProps = React.ComponentProps<'div'> & {
  icon: LucideIcon;
  label: string;
  value: string;
};

export type ContactCardProps = Omit<React.ComponentProps<'div'>, 'title'> & {
  title?: React.ReactNode;
  description?: string;
  contactInfo?: ContactInfoProps[];
  formSectionClassName?: string;
};

export function ContactCard({
  title = "Contact With Us",
  description = "If you have any questions regarding our initiatives, incubation programs, or need collaboration assistance, please reach out to our team.",
  contactInfo,
  className,
  formSectionClassName,
  children,
  ...props
}: ContactCardProps) {
  return (
    <div
      className={cn(
        'relative grid h-full w-full rounded-none border border-[#E5E5E7] bg-white/95 backdrop-blur-md shadow-xl md:grid-cols-2 lg:grid-cols-3 overflow-visible min-w-0',
        className
      )}
      {...props}
    >
      {/* 4 Decorative Precision Corner Plus Markers */}
      <PlusIcon
        className="absolute -top-3 -left-3 h-6 w-6 text-[#2547FF] stroke-[2] pointer-events-none z-20"
        aria-hidden="true"
      />
      <PlusIcon
        className="absolute -top-3 -right-3 h-6 w-6 text-[#2547FF] stroke-[2] pointer-events-none z-20"
        aria-hidden="true"
      />
      <PlusIcon
        className="absolute -bottom-3 -left-3 h-6 w-6 text-[#2547FF] stroke-[2] pointer-events-none z-20"
        aria-hidden="true"
      />
      <PlusIcon
        className="absolute -right-3 -bottom-3 h-6 w-6 text-[#2547FF] stroke-[2] pointer-events-none z-20"
        aria-hidden="true"
      />

      {/* Left Info Pane (2 columns on large screens) */}
      <div className="flex flex-col justify-between p-4 sm:p-8 md:p-10 lg:col-span-2 min-w-0 w-full">
        <div className="relative h-full space-y-4 sm:space-y-5">
          <h2 className="font-display font-bold text-2xl sm:text-4xl lg:text-[44px] text-[#0A0A0A] tracking-[-0.025em] leading-[1.15]">
            {title}
          </h2>

          <p className="font-sans font-normal text-xs sm:text-base text-[#262626]/75 max-w-xl leading-[1.6]">
            {description}
          </p>

          <div className="pt-2 sm:pt-4 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
            {contactInfo?.map((info, index) => (
              <ContactInfo key={`${info.label}-${index}`} {...info} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Pane */}
      <div
        className={cn(
          'bg-[#FAFAFC]/90 flex h-full w-full flex-col justify-center border-t border-[#E5E5E7] p-4 sm:p-8 md:col-span-1 md:border-t-0 md:border-l rounded-none min-w-0',
          formSectionClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ContactInfo({
  icon: Icon,
  label,
  value,
  className,
  ...props
}: ContactInfoProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white border border-[#E5E5E7]/80 shadow-xs hover:border-[#2547FF]/40 transition-colors min-w-0',
        className
      )}
      {...props}
    >
      <div className="rounded-xl bg-[#EDEFFC] p-2 sm:p-2.5 text-[#2547FF] shrink-0 border border-[#2547FF]/15">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-sans font-medium text-xs sm:text-sm text-[#0A0A0A] truncate">{label}</p>
        <p className="font-mono text-[11px] sm:text-xs text-[#262626]/70 truncate mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default ContactCard;
