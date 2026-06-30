import { useState } from 'react';

export function useSwipeGesture({ onSwipeLeft, onSwipeRight }) {
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSwipeLocked, setIsSwipeLocked] = useState(false);

  const onTouchStart = (e) => {
    if (!e.targetTouches || e.targetTouches.length === 0) return;
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setDragX(0);
    setIsDragging(true);
    setIsSwipeLocked(false);
  };

  const onTouchMove = (e) => {
    if (!isDragging || !e.targetTouches || e.targetTouches.length === 0) return;
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const diffX = currentX - touchStartX;
    const diffY = currentY - touchStartY;

    // Lock the gesture direction once threshold is crossed
    if (!isSwipeLocked) {
      const threshold = 10;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
        setIsSwipeLocked(true);
      } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > threshold) {
        // Cancel dragging so browser can handle vertical scroll naturally
        setIsDragging(false);
        setDragX(0);
        return;
      }
    }

    if (isSwipeLocked) {
      setDragX(diffX);
    }
  };

  const onTouchEnd = () => {
    if (!isSwipeLocked) {
      setIsDragging(false);
      setDragX(0);
      return;
    }

    const minSwipeDistance = 60;
    if (dragX < -minSwipeDistance && onSwipeLeft) {
      onSwipeLeft();
    } else if (dragX > minSwipeDistance && onSwipeRight) {
      onSwipeRight();
    } else {
      setIsDragging(false);
      setDragX(0);
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    dragX: isDragging ? dragX : 0,
    isDragging
  };
}
