import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Users } from 'lucide-react';
import { teamMembers, teamVerticals, type TeamMember, type TeamVertical } from '@/data/team';

export function TeamDirectory() {
  const [selectedVertical, setSelectedVertical] = useState<'All' | TeamVertical>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter members by tab and search query
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesVertical =
        selectedVertical === 'All' || member.vertical === selectedVertical;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.vertical.toLowerCase().includes(q) ||
        (member.location && member.location.toLowerCase().includes(q));

      return matchesVertical && matchesSearch;
    });
  }, [selectedVertical, searchQuery]);

  // Member counts per vertical
  const counts = useMemo(() => {
    const map: Record<string, number> = { All: teamMembers.length };
    teamMembers.forEach((m) => {
      map[m.vertical] = (map[m.vertical] || 0) + 1;
    });
    return map;
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Light Theme Card Container matching site color palette */}
      <div className="w-full rounded-2xl md:rounded-3xl bg-white/95 backdrop-blur-md border border-black/[0.08] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Card Header & Search */}
        <div className="p-6 md:p-8 pb-4 md:pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.06]">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-[#0B0B0F] tracking-tight">
              Team directory
            </h2>
            <p className="text-xs md:text-sm text-neutral-500 mt-1">
              Browse by department & vertical
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name or role..."
              className="w-full pl-9 pr-9 py-2 rounded-full bg-[#F4F5FB] border border-black/[0.08] text-[#0B0B0F] placeholder-neutral-400 text-xs md:text-sm focus:outline-none focus:border-[#2547FF] focus:bg-white focus:ring-2 focus:ring-[#2547FF]/15 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#0B0B0F] transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Strip: Horizontally scrollable on mobile */}
        <div className="relative border-b border-black/[0.06] px-4 md:px-8 bg-[#FAFAFD] overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-6 md:gap-8 min-w-max">
            {teamVerticals.map((tab) => {
              const isActive = selectedVertical === tab.id;
              const count = counts[tab.id] || 0;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedVertical(tab.id)}
                  className={`relative py-4 text-xs md:text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                    isActive ? 'text-[#0B0B0F] font-semibold' : 'text-neutral-500 hover:text-[#0B0B0F]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[11px] font-mono px-1.5 py-0.5 rounded-full transition-colors ${
                      isActive
                        ? 'bg-[#2547FF] text-white'
                        : 'bg-neutral-200/60 text-neutral-600'
                    }`}
                  >
                    {count}
                  </span>

                  {/* Active Indicator Underline matching reference */}
                  {isActive && (
                    <motion.div
                      layoutId="directoryActiveTab"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2547FF]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Members Directory List */}
        <div className="divide-y divide-black/[0.06] min-h-[380px] bg-white">
          <AnimatePresence mode="popLayout">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <motion.div
                  key={member.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between py-4 px-5 md:px-8 hover:bg-[#F4F5FB]/80 transition-colors group cursor-default"
                >
                  {/* Left: Avatar initials & Member info */}
                  <div className="flex items-center gap-3.5 md:gap-4 min-w-0">
                    {/* Circle Avatar badge with site palette soft ghost blue */}
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#EDEFFC] border border-[#CBD5FF] text-[#2547FF] font-mono font-semibold text-xs md:text-sm flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:border-[#2547FF] transition-all">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span>{member.initials}</span>
                      )}
                    </div>

                    {/* Name & Role */}
                    <div className="min-w-0">
                      <h3 className="font-sans font-medium text-sm md:text-base text-[#0B0B0F] tracking-tight truncate group-hover:text-[#2547FF] transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs md:text-[13px] text-neutral-500 mt-0.5 truncate font-normal">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Right: Vertical Badge */}
                  <div className="flex items-center shrink-0 ml-4">
                    {/* Vertical Pill Tag */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] md:text-[11px] font-mono tracking-wider uppercase border transition-colors ${
                        member.vertical === 'Heads'
                          ? 'bg-[#EEF2FF] text-[#2547FF] border-[#CBD5FF]'
                          : member.vertical === 'Technical'
                          ? 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]'
                          : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]'
                      }`}
                    >
                      {member.vertical}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              /* Empty State */
              <div className="py-16 px-6 flex flex-col items-center justify-center text-center bg-white">
                <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-[#0B0B0F] font-medium text-sm md:text-base">
                  No members found
                </h4>
                <p className="text-xs md:text-sm text-neutral-500 mt-1 max-w-xs">
                  {searchQuery
                    ? `No results match "${searchQuery}". Try a different keyword.`
                    : 'No members currently assigned to this department.'}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-xs font-mono text-[#2547FF] hover:underline cursor-pointer"
                  >
                    Clear search filter
                  </button>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Directory Footer Info */}
        <div className="px-6 md:px-8 py-3.5 bg-[#F8F9FD] border-t border-black/[0.06] flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>
            Showing {filteredMembers.length} of {teamMembers.length} members
          </span>
          <span className="hidden sm:inline">PSG College of Technology · E-Cell 2026</span>
        </div>
      </div>
    </div>
  );
}

export default TeamDirectory;
