import React, { useRef } from 'react';

interface CardTilt3DProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTilt3D: React.FC<CardTilt3DProps> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Position within card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Centralized offsets
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max rotation bounds in degrees
    const maxRotation = 12;
    
    const rotateYVal = ((x - centerX) / centerX) * maxRotation;
    const rotateXVal = -((y - centerY) / centerY) * maxRotation;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateXVal}deg) rotateY(${rotateYVal}deg) scale3d(1.02, 1.02, 1)`;
  };

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = 'transform 0.05s ease-out';
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
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
