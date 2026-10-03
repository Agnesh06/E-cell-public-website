import React from 'react';
import { HomeScrollScene } from '@/components/home/HomeScrollScene';
import { TeamPreview } from '@/components/home/TeamPreview';

export const Home: React.FC = () => {
  return (
    <div className="w-full relative theme-gradient">
      {/* Scroll-driven home story */}
      <HomeScrollScene />

      {/* Normal page flow: Team preview */}
      <TeamPreview />
    </div>
  );
};

export default Home;

