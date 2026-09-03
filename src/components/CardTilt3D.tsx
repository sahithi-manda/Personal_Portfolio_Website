import React, { useRef } from 'react';

interface CardTilt3DProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTilt3D: React.FC<CardTilt3DProps> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const maxRotation = 10;
      const rotateYVal = ((x - centerX) / centerX) * maxRotation;
      const rotateXVal = -((y - centerY) / centerY) * maxRotation;
      
      card.style.transition = 'none';
      card.style.transform = `perspective(1000px) rotateX(${rotateXVal.toFixed(2)}deg) rotateY(${rotateYVal.toFixed(2)}deg) scale3d(1.02, 1.02, 1)`;
    });
  };

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    cardRef.current.style.willChange = 'transform';
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.willChange = 'auto';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      }}
      className={`relative ${className}`}
    >
      <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
};
