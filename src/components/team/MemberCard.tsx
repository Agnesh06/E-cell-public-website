import React from 'react';
import { TeamMember } from '@/types/team';

interface MemberCardProps {
  member: TeamMember;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border text-center transition-transform hover:-translate-y-1 shadow-md">
      <div className="w-24 h-24 mb-4 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-primary/30">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to avatar silhouette if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('fallback-avatar');
            }}
          />
        ) : (
          <span className="text-xl font-bold text-muted-foreground">
            {member.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
      <p className="text-sm text-primary font-medium mt-1">{member.role}</p>
    </div>
  );
};

