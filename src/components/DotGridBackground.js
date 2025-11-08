'use client';

export function DotGridBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          radial-gradient(circle, rgba(129, 140, 248, 0.2) 1px, transparent 1px),
          radial-gradient(circle, rgba(167, 139, 250, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px, 80px 80px',
        backgroundPosition: '0 0, 20px 20px',
      }}
    >
      {/* Subtle gradient overlays for depth and professional look */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(129, 140, 248, 0.1) 0%, transparent 60%)',
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center bottom, rgba(167, 139, 250, 0.08) 0%, transparent 60%)',
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
        }}
      />
    </div>
  );
}

