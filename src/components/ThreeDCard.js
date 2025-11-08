'use client';

import { useEffect, useRef, useState } from 'react';

export function ThreeDCard({ children }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      if (window.innerWidth < 768) return; // Disable on mobile

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 });
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div className="[perspective:1000px]">
      <div
        ref={cardRef}
        className="bg-black/60 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-indigo-500/20 dark:border-indigo-400/30 dark:shadow-[0_0_12px_rgba(129,140,248,0.2)] hover:scale-105 hover:shadow-lg dark:hover:shadow-[0_0_18px_rgba(129,140,248,0.3)] dark:hover:border-indigo-400/40 transition-all duration-300"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  );
}

