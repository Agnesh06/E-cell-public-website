import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getProjectBySlug, PROJECTS } from "@/data/projects";
import Topography from "@/components/ui/Topography";

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
    <div className="relative min-h-screen bg-[#FAFAFC] text-[#0A0A0A] selection:bg-[#2547FF] selection:text-white">
      {/* Pinned Stationary Background - Identical to Home and Projects */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      >
        <Topography
          lowColor="#2547FF"
          midColor="#4B6FFF"
          highColor="#8CA6FE"
          speed={0.08}
          morphAmount={1.4}
          morphSpeed={0.012}
          bands={2.4}
          thickness={0.007}
          scale={2.0}
          pixelSize={1.0}
          glow={0.0}
          colorMode="elevation"
          contrast={1.4}
          brightness={1.0}
          fillBands={false}
          opacity={0.16}
          grain={false}
          grainIntensity={0.0}
          mouseInteraction={false}
        />
      </div>

      {/* Floating Back to Projects Button - No white bar */}
      <div className="fixed top-4 left-4 sm:top-5 sm:left-6 lg:left-12 z-40 pointer-events-auto">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#0A0A0A]/80 hover:text-[#2547FF] transition-all bg-white/95 hover:bg-white border border-black/10 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-xs hover:shadow-md hover:border-[#2547FF]/30 active:scale-95 group backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1 text-[#2547FF]" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 pt-20 sm:pt-28 sm:pb-20 md:pt-32 pb-16">
        {/* Domain & Meta */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">
          {project.domain && (
            <span className="px-3 py-1 rounded-full text-xs font-mono font-normal tracking-wider uppercase bg-[#EDEFFC] text-[#2547FF]">
              {project.domain}
            </span>
          )}
          {project.featured && (
            <span className="px-3 py-1 rounded-full text-xs font-mono font-normal tracking-wider uppercase bg-[#0A0A0A] text-white">
              Featured Initiative
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <h1 className="font-display font-normal text-2xl sm:text-4xl md:text-5xl lg:text-[64px] text-[#0A0A0A] tracking-[-0.035em] leading-[1.1]">
          {project.title}
        </h1>
        {project.tagline && (
          <p className="mt-3 text-lg sm:text-xl text-[#262626]/75 font-sans font-normal leading-[1.6]">
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
            <h2 className="text-xs font-mono font-normal tracking-[0.2em] uppercase text-[#71717A] mb-4">
              Project Overview
            </h2>
            <p className="font-sans font-normal text-base text-[#262626] leading-[1.6]">
              {project.description}
            </p>

            {/* Technologies */}
            <div className="mt-10">
              <h2 className="text-xs font-mono font-normal tracking-[0.2em] uppercase text-[#71717A] mb-3">
                Technologies & Tools
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-normal bg-white border border-[#E5E5E7] text-[#262626]"
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
              <h3 className="text-xs font-mono font-normal tracking-[0.2em] uppercase text-[#71717A] mb-2">
                Project Lead
              </h3>
              <p className="font-sans font-medium text-lg text-[#0A0A0A]">
                {project.teamLead}
              </p>
            </div>

            {project.teamMembers && project.teamMembers.length > 0 && (
              <div>
                <h3 className="text-xs font-mono font-normal tracking-[0.2em] uppercase text-[#71717A] mb-2">
                  Collaborators
                </h3>
                <ul className="space-y-1 text-sm text-[#262626]/80 font-sans font-normal leading-[1.5]">
                  {project.teamMembers.map((member) => (
                    <li key={member}>{member}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.links && project.links.length > 0 && (
              <div>
                <h3 className="text-xs font-mono font-normal tracking-[0.2em] uppercase text-[#71717A] mb-3">
                  External Links
                </h3>
                <div className="flex flex-col gap-2">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium font-sans text-[#2547FF] hover:underline"
                    >
                      {link.label}
                      <ExternalLink className="w-3.5 h-3.5" />
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
            <span className="text-xs font-mono font-normal tracking-widest text-[#71717A] uppercase block">
              Up Next
            </span>
            <span className="font-display font-normal text-2xl text-[#0A0A0A]">
              {nextProject.title}
            </span>
          </div>
          <Link
            to={`/projects/${nextProject.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0A0A0A] text-white text-sm font-sans font-medium tracking-wider uppercase hover:bg-[#2547FF] transition-colors"
          >
            Explore Next Project →
          </Link>
        </section>
      </main>
    </div>
  );
}
