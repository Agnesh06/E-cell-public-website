import Hero from '@/components/home/Hero';
import ProjectPreview from '@/components/home/ProjectPreview';
import TeamSection from '@/components/team/TeamSection';
import Collaboration from '@/pages/Collaboration/Collaboration';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#FAFAFC] text-[#0A0A0A]">
      {/* Hero Section */}
      <Hero />

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

      {/* Global Site Footer */}
      <Footer />
    </main>
  );
}
