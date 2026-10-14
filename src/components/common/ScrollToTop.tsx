import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      if (hash) {
        const id = hash.replace("#", "");
        const scrollToTarget = () => {
          if (id === "about" || id === "about-us") {
            const aboutEl = document.getElementById("about") || document.getElementById("about-us");
            const homeEl = document.getElementById("home");
            if (aboutEl) {
              aboutEl.scrollIntoView({ behavior: "smooth" });
            } else if (homeEl) {
              const travel = (window.innerHeight || 800) * 2.2;
              window.scrollTo({ top: homeEl.offsetTop + travel * 0.88, behavior: "smooth" });
            }
            return;
          }
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        };

        // Scroll immediately if element is already present, then retry across layout/font settling
        scrollToTarget();
        const t1 = setTimeout(scrollToTarget, 100);
        const t2 = setTimeout(scrollToTarget, 300);
        const t3 = setTimeout(scrollToTarget, 600);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
        };
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }
  }, [pathname, hash]);

  return null;
}
