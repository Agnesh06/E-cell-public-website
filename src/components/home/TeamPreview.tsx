import React from 'react';
import { Link } from 'react-router-dom';
import { getOfficeBearers } from '@/data/team';
import { MemberCard } from '@/components/team/MemberCard';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

export const TeamPreview: React.FC = () => {
  const officeBearers = getOfficeBearers();

  return (
    <section className="py-24 px-6 md:px-12 bg-background border-t border-border/40 relative z-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Meet the Team
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Driven student leaders cultivating the entrepreneurial spirit across PSG College of Technology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {officeBearers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to={ROUTES.TEAM}>View Full Team Directory &rarr;</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

