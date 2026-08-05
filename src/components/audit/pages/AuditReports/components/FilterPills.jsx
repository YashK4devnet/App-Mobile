import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const FILTER_STYLES = {
  "All": {
    bg: "bg-[#ff7700]/10",
    border: "border-[#ff7700]/40",
    activeText: "text-[#ff7700]",
  },
  "Assigned": {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    activeText: "text-blue-600",
  },
  "In Progress": {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    activeText: "text-cyan-600",
  },
  "Completed": {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    activeText: "text-purple-600",
  },
  "Waiting for Approval": {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    activeText: "text-amber-600",
  },
  "Approved": {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    activeText: "text-emerald-600",
  },
  "Rejected": {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    activeText: "text-rose-600",
  }
};

const DEFAULT_STYLE = {
  bg: "bg-orange-500/10",
  border: "border-orange-500/30",
  activeText: "text-[#ff7700]",
};

export default function FilterPills({ filters, activeFilter, onSelectFilter }) {
  const scrollRef = useRef(null);

  const handleWheel = (e) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div 
      className="w-full overflow-x-auto scrollbar-none py-3 flex items-center gap-2"
      ref={scrollRef}
      onWheel={handleWheel}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      style={{ scrollBehavior: 'smooth' }}
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter;
        const style = FILTER_STYLES[filter] || DEFAULT_STYLE;

        return (
          <button
            key={filter}
            onClick={() => onSelectFilter(filter)}
            className={`relative px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors duration-300 ${
              isActive ? style.activeText : 'text-slate-500 hover:text-[#0f172a] bg-white border border-slate-200'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilterPill"
                className={`absolute inset-0 ${style.bg} border ${style.border} rounded-full z-0`}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{filter}</span>
          </button>
        );
      })}
    </div>
  );
}
