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
        className="bg-white/70 dark:bg-black/50 backdrop-blur-lg rounded-2xl p-8 border-2 border-indigo-500/20 dark:border-indigo-400/70 dark:shadow-[0_0_50px_rgba(129,140,248,0.6),0_0_100px_rgba(167,139,250,0.4),inset_0_0_30px_rgba(129,140,248,0.1)] hover:scale-105 hover:shadow-lg dark:hover:shadow-[0_0_60px_rgba(129,140,248,0.9),0_0_120px_rgba(167,139,250,0.7),0_0_180px_rgba(236,72,153,0.5)] dark:hover:border-indigo-300 transition-all duration-300"
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

