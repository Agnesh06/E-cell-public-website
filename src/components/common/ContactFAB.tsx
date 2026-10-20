import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageSquare, X } from "lucide-react";

export default function ContactFAB() {
  const [isVisible, setIsVisible] = useState(false);
  const [isInsideContact, setIsInsideContact] = useState(false);
  const [isInsideForm, setIsInsideForm] = useState(false);
  const [isDismissedOnForm, setIsDismissedOnForm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isFormPage = location.pathname === "/collaboration";
  const isFormActive = isFormPage || isInsideForm;

  // Reset form dismissal when user leaves the form area
  useEffect(() => {
    if (!isFormActive) {
      setIsDismissedOnForm(false);
    }
  }, [isFormActive, location.pathname]);

  // Scroll & Intersection detection
  useEffect(() => {
    let contactObserver: IntersectionObserver | null = null;
    let formObserver: IntersectionObserver | null = null;

    const handleScroll = () => {
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
      // On desktop: visible immediately from first page (scrollY >= 0).
      // On mobile/tablet: visible after scrolling past hero fold (> 260px) or on dedicated sub-pages.
      const scrolled = isDesktop || window.scrollY > 260 || location.pathname !== "/";
      setIsVisible(scrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    // Observe #contact section (Get in Touch)
    const contactEl = document.getElementById("contact");
    if (contactEl && "IntersectionObserver" in window) {
      contactObserver = new IntersectionObserver(
        (entries) => {
          setIsInsideContact(entries[0].isIntersecting);
        },
        { threshold: 0.25 }
      );
      contactObserver.observe(contactEl);
    }

    // Observe #collaboration section (Form section on landing page)
    const formEl = document.getElementById("collaboration");
    if (formEl && "IntersectionObserver" in window) {
      formObserver = new IntersectionObserver(
        (entries) => {
          setIsInsideForm(entries[0].isIntersecting);
        },
        { threshold: 0.1 }
      );
      formObserver.observe(formEl);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (contactObserver) contactObserver.disconnect();
      if (formObserver) formObserver.disconnect();
    };
  }, [location.pathname]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "#contact");
      }
    } else {
      navigate("/#contact");
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissedOnForm(true);
  };

  // Determine active visual presence
  const showFab = isVisible && !isInsideContact && !(isFormActive && isDismissedOnForm);

  return (
    <>
      <style>{`
        /* Dynamic color inversion when in the blue portal stage (second page) */
        body[data-portal-blue="true"] .contact-fab-btn {
          background-color: #FFFFFF !important;
          color: #2547FF !important;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28), 0 0 16px rgba(255, 255, 255, 0.45) !important;
        }
        body[data-portal-blue="true"] .contact-fab-btn:hover {
          background-color: #F2F4FF !important;
          color: #1B3AE5 !important;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.35), 0 0 22px rgba(255, 255, 255, 0.6) !important;
        }
        body[data-portal-blue="true"] .contact-fab-icon {
          color: #2547FF !important;
        }
        body[data-portal-blue="true"] .contact-fab-pulse {
          background-color: #FFFFFF !important;
          opacity: 0.4 !important;
        }
        body[data-portal-blue="true"] .contact-fab-tooltip {
          background-color: #FFFFFF !important;
          color: #0A0A0A !important;
          border-color: rgba(0, 0, 0, 0.08) !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22) !important;
        }
      `}</style>

      <div
        className={`group fixed bottom-6 right-6 md:bottom-8 md:right-8 lg:bottom-auto lg:top-5 lg:right-24 z-40 transition-all duration-300 ease-out flex items-center gap-3 ${showFab
            ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
            : "opacity-0 scale-75 pointer-events-none translate-y-5"
          }`}
      >
        {/* Tooltip Badge: Appears to the left of the button on desktop hover */}
        <div
          aria-hidden="true"
          className="contact-fab-tooltip hidden md:flex items-center px-3.5 py-1.5 rounded-full bg-[#0A0A0A]/90 text-white text-xs font-mono font-medium tracking-wide shadow-lg backdrop-blur-sm opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none select-none border border-white/10"
        >
          <span>Get in Touch</span>
        </div>

        {/* Button Container with optional mobile close button */}
        <div className="relative">
          {/* Mobile-Only Close 'X' Button: Appears ONLY when user is in the form section/page on mobile */}
          {isFormActive && (
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close Floating Action Button"
              className="md:hidden absolute -top-1.5 -right-1.5 z-30 w-5 h-5 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center shadow-md border border-white/30 active:scale-75 transition-all cursor-pointer"
            >
              <X className="w-3 h-3 text-white stroke-[2.5]" />
            </button>
          )}

          {/* Main Floating Action Button */}
          <button
            type="button"
            onClick={handleClick}
            aria-label="Scroll to Get in Touch section"
            className="contact-fab-btn relative w-14 h-14 lg:w-12 lg:h-12 rounded-full bg-[#2547FF] hover:bg-[#1a38db] active:scale-95 transition-all duration-300 flex items-center justify-center text-white shadow-[0_8px_24px_rgba(37,71,255,0.42)] hover:shadow-[0_12px_32px_rgba(37,71,255,0.55)] cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2547FF]/40 hover:scale-105"
          >
            {/* Subtle Ambient Pulse Ring */}
            <span
              className="contact-fab-pulse absolute inset-0 rounded-full bg-[#2547FF] opacity-35 animate-ping pointer-events-none transition-colors duration-300"
              style={{ animationDuration: "3s" }}
            />

            {/* Message Icon with slight bounce on hover */}
            <MessageSquare className="contact-fab-icon relative z-10 w-6 h-6 lg:w-5 lg:h-5 transition-transform transition-colors duration-300 group-hover:scale-110" />
          </button>
        </div>
      </div>
    </>
  );
}
