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
      // Fade in after scrolling past top hero fold (> 260px) or on dedicated pages
      const scrolled = window.scrollY > 260 || location.pathname !== "/";
      setIsVisible(scrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
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
    <div
<<<<<<< HEAD
      className={`group fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 transition-all duration-300 ease-out flex items-center gap-3 ${
=======
      className={`group fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-40 transition-all duration-300 ease-out flex items-center gap-3 ${
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
        showFab
          ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
          : "opacity-0 scale-75 pointer-events-none translate-y-5"
      }`}
    >
      {/* Tooltip Badge: Appears to the left of the button on desktop hover */}
      <div
        aria-hidden="true"
        className="hidden md:flex items-center px-3.5 py-1.5 rounded-full bg-[#0A0A0A]/90 text-white text-xs font-mono font-medium tracking-wide shadow-lg backdrop-blur-sm opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none select-none border border-white/10"
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
<<<<<<< HEAD
          className="relative w-14 h-14 rounded-full bg-[#2547FF] hover:bg-[#1a38db] active:scale-95 transition-all duration-200 flex items-center justify-center text-white shadow-[0_8px_24px_rgba(37,71,255,0.42)] hover:shadow-[0_12px_32px_rgba(37,71,255,0.55)] cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2547FF]/40 hover:scale-105"
=======
          className="relative w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full bg-[#2547FF] hover:bg-[#1a38db] active:scale-95 transition-all duration-200 flex items-center justify-center text-white shadow-[0_6px_20px_rgba(37,71,255,0.38)] hover:shadow-[0_12px_32px_rgba(37,71,255,0.55)] cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2547FF]/40 hover:scale-105"
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
        >
          {/* Subtle Ambient Pulse Ring */}
          <span
            className="absolute inset-0 rounded-full bg-[#2547FF] opacity-35 animate-ping pointer-events-none"
            style={{ animationDuration: "3s" }}
          />

          {/* Message Icon with slight bounce on hover */}
<<<<<<< HEAD
          <MessageSquare className="relative z-10 w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
=======
          <MessageSquare className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:scale-110" />
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
        </button>
      </div>
    </div>
  );
}
