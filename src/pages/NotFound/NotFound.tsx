import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#2547FF] font-semibold mb-3">
        404 • Not Found
      </span>
      <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-[#0A0A0A]">
        Page Not Found
      </h1>
      <p className="mt-3 text-base text-[#262626]/70 max-w-md">
        The project or page you are looking for doesn't exist or has moved.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Link
          to="/projects"
          className="px-5 py-2.5 rounded-full bg-[#2547FF] text-white text-xs font-mono tracking-wider uppercase hover:bg-[#1E3AE0] transition-colors"
        >
          View Projects
        </Link>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-full border border-[#E5E5E7] text-[#0A0A0A] text-xs font-mono tracking-wider uppercase hover:border-[#0A0A0A] transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
