import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/types/project";

export interface MobileProjectsGalleryProps {
  projects: Project[];
}

export default function MobileProjectsGallery({ projects }: MobileProjectsGalleryProps) {
  return (
    <section className="w-full">
      {/* Gallery Header (from Gallery02) */}
      <div className="mb-8 sm:mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-black/[0.06] pb-6">
        <div className="max-w-lg">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#2547FF] font-semibold block mb-2">
            Showcase ({String(projects.length).padStart(2, "0")})
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A0A0A]">
            Every venture, considered.
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#0A0A0A]/60 sm:text-right font-sans">
          Select any venture to explore specs & architecture.
        </p>
      </div>

      {/* Responsive Gallery Grid: 1 col on mobile, 2 cols on tablet */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6">
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            to={`/projects/${project.slug}`}
            className="group flex flex-col gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-black/[0.08] hover:border-[#2547FF]/35 transition-all shadow-xs hover:shadow-lg hover:shadow-[#2547FF]/10 active:scale-[0.99] cursor-pointer"
          >
            {/* Cinematic 16:9 Image Container */}
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-black/[0.06] bg-slate-100 relative [isolation:isolate]">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] rounded-[inherit]"
                loading="lazy"
              />

              {/* Top overlay metadata */}
              <div className="absolute inset-0 p-3 flex items-start justify-between pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-transparent">
                <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-black/60 text-white backdrop-blur-xs tracking-wider">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {project.domain && (
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-medium tracking-wide bg-white/90 text-[#0A0A0A] backdrop-blur-xs shadow-xs">
                    {project.domain}
                  </span>
                )}
              </div>

              {/* Subtle hover icon button */}
              <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 text-[#2547FF] backdrop-blur-xs flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Captions & Metadata */}
            <figcaption className="px-1 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#0A0A0A] tracking-tight group-hover:text-[#2547FF] transition-colors">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
                      Featured
                    </span>
                  )}
                </div>

                {project.tagline && (
                  <p className="mt-1 text-xs sm:text-sm font-medium text-[#2547FF]/85 font-sans">
                    {project.tagline}
                  </p>
                )}

                <p className="mt-2 text-xs sm:text-sm text-[#0A0A0A]/65 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Technologies row & Explore button */}
              <div className="mt-4 pt-3 border-t border-black/[0.05] flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono text-[#0A0A0A]/60 bg-black/[0.04]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-[#0A0A0A]/40 bg-black/[0.02]">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2547FF] shrink-0 group-hover:underline">
                  <span>Explore</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </figcaption>
          </Link>
        ))}
      </div>
    </section>
  );
}
