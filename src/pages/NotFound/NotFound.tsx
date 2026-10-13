import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
      <span className="font-mono text-xs font-normal uppercase tracking-[0.2em] text-[#2547FF] mb-3">
        404 • Not Found
      </span>
      <h1 className="font-display font-normal text-3xl sm:text-4xl text-[#0A0A0A] tracking-[-0.025em] leading-[1.1]">
        Page Not Found
      </h1>
      <p className="mt-3 font-sans font-normal text-base leading-[1.6] text-[#262626]/70 max-w-md">
        The project or page you are looking for doesn't exist or has moved.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Link
          to="/projects"
          className="px-5 py-2.5 rounded-full bg-[#2547FF] text-white font-sans text-sm font-medium hover:bg-[#1E3AE0] transition-colors"
        >
          View Projects
        </Link>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-full border border-[#E5E5E7] text-[#0A0A0A] font-sans text-sm font-medium hover:border-[#0A0A0A] transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
