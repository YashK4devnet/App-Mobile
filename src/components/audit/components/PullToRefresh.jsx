import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PullToRefresh({ onRefresh, children }) {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const containerRef = useRef(null);
  const MAX_PULL = 100;
  const THRESHOLD = 60;

  const handleTouchStart = (e) => {
    // Determine if we are at the top of the window or the scroll container
    const scrollTop = containerRef.current ? containerRef.current.scrollTop : window.scrollY;
    
    // Only allow pull-to-refresh if we're exactly at the top
    if (scrollTop <= 0 && !isRefreshing) {
      setStartY(e.touches[0].clientY);
    } else {
      setStartY(0);
    }
  };

  const handleTouchMove = (e) => {
    if (startY === 0 || isRefreshing) return;

    const scrollTop = containerRef.current ? containerRef.current.scrollTop : window.scrollY;
    if (scrollTop > 0) {
      // If user scrolled down natively, cancel pull-to-refresh
      setStartY(0);
      setPullDistance(0);
      return;
    }

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    if (distance > 0) {
      // Apply resistance: half the actual drag distance
      const resistanceDistance = Math.min(distance * 0.5, MAX_PULL);
      setPullDistance(resistanceDistance);
    } else {
      setPullDistance(0);
    }
  };

  const handleTouchEnd = async () => {
    if (startY === 0 || isRefreshing) return;

    if (pullDistance >= THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(THRESHOLD); // Snap to loading position
      
      try {
        if (onRefresh) {
          await onRefresh();
        }
        // Artificial delay to let the spinner spin for a moment
        await new Promise(resolve => setTimeout(resolve, 600));
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
    
    setStartY(0);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full"
      style={{ overscrollBehaviorY: 'none' }} // Prevent native browser pull-to-refresh
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: isRefreshing ? THRESHOLD * 0.4 : pullDistance * 0.5 - 20,
              scale: 1,
              rotate: isRefreshing ? 360 : (pullDistance / MAX_PULL) * 360
            }}
            exit={{ opacity: 0, y: -40, scale: 0.8, transition: { duration: 0.2 } }}
            transition={isRefreshing 
              ? { rotate: { repeat: Infinity, duration: 1, ease: "linear" } } 
              : { type: 'spring', stiffness: 300, damping: 25 }
            }
            className="absolute left-[calc(50%-20px)] top-2 z-[100] flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_0_20px_rgba(78,205,196,0.25)]"
          >
            <svg 
              className="w-5 h-5 text-[#4ecdc4]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        animate={{ y: isRefreshing ? THRESHOLD : pullDistance > 0 ? pullDistance : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
