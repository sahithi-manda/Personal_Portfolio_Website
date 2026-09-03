import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Snappy responsive spring configuration (zero perceived mouse latency)
  const ringX = useSpring(mouseX, { stiffness: 450, damping: 32 });
  const ringY = useSpring(mouseY, { stiffness: 450, damping: 32 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    // Optimized hover styles for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = !!(
        target.closest('a, button, [role="button"], canvas, .glow-card, .cursor-pointer')
      );
      setIsHovered(interactive);
    };

    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  // Hide on screens smaller than large devices (touch screens)
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        setIsVisible(false);
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize, { passive: true });
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Precise Center Dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-sky-400 rounded-full z-[9999] pointer-events-none shadow-[0_0_8px_rgba(56,189,248,0.8)]"
      />
      {/* Soft Spring Outer Trailing Ring - GPU scale transform */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 1.7 : 1,
          borderColor: isHovered ? 'rgba(56, 189, 248, 0.9)' : 'rgba(248, 250, 252, 0.4)',
          backgroundColor: isHovered ? 'rgba(56, 189, 248, 0.15)' : 'rgba(56, 189, 248, 0)',
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="fixed top-0 left-0 w-6 h-6 border rounded-full z-[9998] pointer-events-none will-change-transform shadow-xs"
      />
    </>
  );
};
