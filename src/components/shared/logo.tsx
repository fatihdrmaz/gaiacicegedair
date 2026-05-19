// GAIA · ÇİÇEĞE DAİR logo — görsel tabanlı

export function GaiaLogo({
  size = 52,
  color,
}: {
  size?: number;
  color?: string;
  stacked?: boolean;
  tagline?: boolean;
}) {
  // color verildiyse (footer / portal gibi koyu zeminler) logo beyaza çevrilir
  const onDark = Boolean(color);
  return (
    <img
      src="/logo.png"
      alt="GAIA Çiçeğe Dair"
      style={{
        height: size * 1.2,
        width: 'auto',
        display: 'block',
        filter: onDark ? 'brightness(0) invert(1)' : 'none',
      }}
    />
  );
}

// Küçük çiçek işareti (favicon vurgusu olarak)
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
