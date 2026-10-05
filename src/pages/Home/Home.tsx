import Hero from '@/components/home/Hero';
import ProjectPreview from '@/components/home/ProjectPreview';
import TeamSection from '@/components/team/TeamSection';
import Collaboration from '@/pages/Collaboration/Collaboration';
import Footer from '@/components/layout/Footer';
import Topography from '@/components/ui/Topography';

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#FAFAFC] text-[#0A0A0A]">
      {/* Hero Section with its vivid React Bits Topography */}
      <Hero />

      {/* Unified Sections Wrapper with Single Continuous Sticky Background for Projects, Team, and Form */}
      <div className="relative w-full bg-[#FAFAFC] z-10">
        {/* Sticky Background: Pinned across Projects, Team, and Collaboration */}
        <div
          aria-hidden="true"
          className="sticky top-0 h-screen w-full pointer-events-none z-0 -mb-[100vh] overflow-hidden select-none"
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

        {/* Content Layer: Smoothly glides over the sticky continuous topography */}
        <div className="relative z-10">
          {/* Selected Work / Projects Showcase */}
          <ProjectPreview />

          {/* Connected Team Section */}
          <TeamSection
            id="team"
            catchphrase="The minds building the future at PSG Tech E-Cell"
            subtitle="CORE TEAM '26"
          />

          {/* Corporate & Industry Collaboration 5-Step Form */}
          <Collaboration id="collaboration" />
        </div>
      </div>

      {/* Global Site Footer */}
      <Footer />
    </main>
  );
}
