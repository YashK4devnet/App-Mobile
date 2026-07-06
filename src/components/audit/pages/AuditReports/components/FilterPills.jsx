import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const FILTER_STYLES = {
  "All": {
    bg: "bg-[#4ecdc4]/20",
    border: "border-[#4ecdc4]/50",
    activeText: "text-[#4ecdc4]",
  },
  "Assigned": {
    bg: "bg-blue-500/20",
    border: "border-blue-500/40",
    activeText: "text-blue-400",
  },
  "Completed": {
    bg: "bg-purple-500/20",
    border: "border-purple-500/40",
    activeText: "text-purple-400",
  },
  "Waiting for Approval": {
    bg: "bg-amber-500/20",
    border: "border-amber-500/40",
    activeText: "text-amber-400",
  },
  "Approved": {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/40",
    activeText: "text-emerald-400",
  },
  "Rejected": {
    bg: "bg-rose-500/20",
    border: "border-rose-500/40",
    activeText: "text-rose-400",
  }
};

const DEFAULT_STYLE = {
  bg: "bg-white/10",
  border: "border-white/20",
  activeText: "text-white",
};

export default function FilterPills({ filters, activeFilter, onSelectFilter }) {
  const scrollRef = useRef(null);

  // Allow horizontal scrolling with mouse wheel (optional but nice UX for desktop)
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
            className={`relative px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors duration-300 ${
              isActive ? style.activeText : 'text-white/50 hover:text-white/80 bg-white/5 hover:bg-white/10'
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

