// GAIA · ÇİÇEĞE DAİR logo — text-based, uses display font

export function GaiaLogo({
  size = 52,
  color,
  stacked = true,
  tagline = true,
}: {
  size?: number;
  color?: string;
  stacked?: boolean;
  tagline?: boolean;
}) {
  const c = color || 'var(--accent)';
  if (!stacked) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 12, color: c, fontFamily: 'var(--font-display)' }}>
        <span style={{ fontSize: size, letterSpacing: '0.08em', fontWeight: 400, lineHeight: 1 }}>GAIA</span>
        {tagline && (
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: size * 0.22,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              opacity: 0.85,
              fontWeight: 400,
            }}
          >
            Çiçeğe Dair
          </span>
        )}
      </div>
    );
  }
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: c,
        fontFamily: 'var(--font-display)',
        lineHeight: 1,
      }}
    >
      <span style={{ fontSize: size, letterSpacing: '0.12em', fontWeight: 400, lineHeight: 0.95 }}>GAIA</span>
      {tagline && (
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: size * 0.18,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            marginTop: size * 0.14,
            fontWeight: 400,
          }}
        >
          Çiçeğe Dair
        </span>
      )}
    </div>
  );
}

// Small flower mark used as favicon-style accent
export function GaiaMark({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.1" strokeLinecap="round">
      <path d="M16 16 C 16 10, 20 6, 24 7 C 22 11, 19 14, 16 16 Z" fill={color} fillOpacity="0.18" />
      <path d="M16 16 C 22 16, 26 20, 25 24 C 21 22, 18 19, 16 16 Z" fill={color} fillOpacity="0.18" />
      <path d="M16 16 C 16 22, 12 26, 8 25 C 10 21, 13 18, 16 16 Z" fill={color} fillOpacity="0.18" />
      <path d="M16 16 C 10 16, 6 12, 7 8 C 11 10, 14 13, 16 16 Z" fill={color} fillOpacity="0.18" />
      <circle cx="16" cy="16" r="1.8" fill={color} />
    </svg>
  );
}

export default GaiaLogo;
export { GaiaLogo as Logo };
