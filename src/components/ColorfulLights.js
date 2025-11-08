'use client';

export function ColorfulLights() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 bg-black hidden dark:block"
      style={{
        backgroundImage: `
          radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
          radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px, 64px 64px',
        backgroundPosition: '0 0, 16px 16px',
      }}
    >
      {/* Subtle gradient overlays for depth and professional look */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(255, 255, 255, 0.03) 0%, transparent 50%)',
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />
      {/* Subtle animated glow effect for trending look */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 100% 50% at 50% 0%, rgba(129, 140, 255, 0.08) 0%, transparent 60%)',
          animation: 'dotGridPulse 8s ease-in-out infinite',
        }}
      />
    </div>
  );
}
