import { useParams, Link, Navigate } from "react-router-dom";
import { getProjectBySlug, PROJECTS } from "@/data/projects";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  if (!project) {
    return <Navigate to="/404" replace />;
  }

  // Find next project for exploration
  const currentIndex = PROJECTS.findIndex((p) => p.slug === project.slug);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0A0A0A] selection:bg-[#2547FF] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-[#E5E5E7] bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.16em] uppercase text-[#262626]/75 hover:text-[#2547FF] transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Projects
          </Link>

          <Link
            to="/"
            className="text-xs font-mono tracking-widest uppercase text-[#262626]/50 hover:text-[#0A0A0A] transition-colors"
          >
            PSG Tech E-Cell
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1080px] mx-auto px-6 py-12 sm:py-16 md:py-20">
        {/* Domain & Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {project.domain && (
            <span className="px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-[#EDEFFC] text-[#2547FF] font-medium">
              {project.domain}
            </span>
          )}
          {project.featured && (
            <span className="px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-[#0A0A0A] text-white font-medium">
              Featured Initiative
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#0A0A0A] tracking-[-0.03em] leading-[1.08]">
          {project.title}
        </h1>
        {project.tagline && (
          <p className="mt-3 text-lg sm:text-xl text-[#262626]/70 font-sans tracking-[-0.01em]">
            {project.tagline}
          </p>
        )}

        {/* Cover Image */}
        <div className="mt-10 rounded-2xl overflow-hidden border border-[#E5E5E7] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] bg-[#F1F1F4] aspect-[16/9] max-h-[520px] w-full">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {/* Main Description */}
          <div className="md:col-span-2">
            <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-[#71717A] mb-4">
              Project Overview
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#262626] leading-relaxed">
              {project.description}
            </p>

            {/* Technologies */}
            <div className="mt-10">
              <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-[#71717A] mb-3">
                Technologies & Tools
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono bg-white border border-[#E5E5E7] text-[#262626]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Meta: Team & Links */}
          <aside className="border-t md:border-t-0 md:border-l border-[#E5E5E7] md:pl-8 pt-8 md:pt-0 space-y-8">
            <div>
              <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-[#71717A] mb-2">
                Project Lead
              </h3>
              <p className="font-display font-semibold text-[#0A0A0A] text-base">
                {project.teamLead}
              </p>
            </div>

            {project.teamMembers && project.teamMembers.length > 0 && (
              <div>
                <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-[#71717A] mb-2">
                  Collaborators
                </h3>
                <ul className="space-y-1 text-sm text-[#262626]/80 font-sans">
                  {project.teamMembers.map((member) => (
                    <li key={member}>{member}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.links && project.links.length > 0 && (
              <div>
                <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-[#71717A] mb-3">
                  External Links
                </h3>
                <div className="flex flex-col gap-2">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2547FF] hover:underline"
                    >
                      {link.label}
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Next Project Footer Bar */}
        <section className="mt-16 sm:mt-24 pt-10 border-t border-[#E5E5E7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#71717A] uppercase block">
              Up Next
            </span>
            <span className="font-display font-bold text-xl text-[#0A0A0A]">
              {nextProject.title}
            </span>
          </div>
          <Link
            to={`/projects/${nextProject.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0A0A0A] text-white text-xs font-mono tracking-wider uppercase hover:bg-[#2547FF] transition-colors"
          >
            Explore Next Project →
          </Link>
        </section>
      </main>
    </div>
  );
}
