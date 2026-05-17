// Image placeholders — painterly CSS/SVG compositions representing flowers
// No dependency on external image URLs. Each has a gradient + silhouette hints.

// Palette helper
export const palettes: Record<string, string[]> = {
  roseWhite: ['#f5e8e4', '#e8c9c0', '#c88a7d', '#7d4a3e'],
  creamPink: ['#f7ead8', '#f0c6c1', '#d99289', '#8a4f4a'],
  sage: ['#e6ebe0', '#bdc9b3', '#7a8c71', '#3f4c38'],
  haki: ['#e7e3d1', '#c3bf9d', '#8c8a5a', '#45432a'],
  toprak: ['#f1e3c4', '#d6b37e', '#9c7432', '#5a3f14'],
  moody: ['#e2dcd4', '#a69b8e', '#5f5347', '#2b2319'],
  dusty: ['#ede3e5', '#c8a4a8', '#90636a', '#49262c'],
  garden: ['#eae7d3', '#b8bd8a', '#7f8c4a', '#3b4521'],
};

// Real photo URLs (Unsplash — free, direct hotlinking allowed)
export const PHOTOS: Record<string, string> = {
  // Hero / wedding — gerçek konuya uygun Unsplash görselleri
  heroWedding: 'https://images.unsplash.com/photo-1641834919507-b0271fe5186b?w=1600&q=80',
  heroTable: 'https://images.unsplash.com/photo-1769812343285-ec0775437680?w=1600&q=80',
  heroCorporate: 'https://images.unsplash.com/photo-1758714919725-d2740fc99f14?w=1600&q=80',
  heroProposal: 'https://images.unsplash.com/photo-1589095181425-c038b3871b6a?w=1600&q=80',
  heroDried: 'https://images.unsplash.com/photo-1675089728888-5a8a54a46a8d?w=1600&q=80',

  // Services — her hizmet için konuya uygun görsel
  sWedding: 'https://images.unsplash.com/photo-1738025277281-582526f674c4?w=1200&q=80',
  sCorporate: 'https://images.unsplash.com/photo-1765305596432-5fdc41b64d8e?w=1200&q=80',
  sBirthday: 'https://images.unsplash.com/photo-1608935387815-8963f8d5cf88?w=1200&q=80',
  sProposal: 'https://images.unsplash.com/photo-1672724332593-9ab35de16efd?w=1200&q=80',
  sBachelor: 'https://images.unsplash.com/photo-1719776427907-fe38be9648dd?w=1200&q=80',
  sVenue: 'https://images.unsplash.com/photo-1773745060497-4cc1df774c72?w=1200&q=80',
  sCongress: 'https://images.unsplash.com/photo-1762968274962-20c12e6e8ecd?w=1200&q=80',
  sEvent: 'https://images.unsplash.com/photo-1761110787206-2cc164e4913c?w=1200&q=80',
  sLandscape: 'https://images.unsplash.com/photo-1636489571981-e46df15657ce?w=1200&q=80',

  // Gallery
  gLobby: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
  gTable: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80',
  gDried: 'https://images.unsplash.com/photo-1604323990536-6e49834c6885?w=1200&q=80',
  gGift: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=1200&q=80',
  gWelcome: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80',
  gAisle: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80',
  gArch: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
  gCenter: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1200&q=80',
  gBouquet: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80',
  gPeyzaj: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=80',

  // About/team/values
  atelier: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80',
  team1: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=800&q=80',
  team2: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
  team3: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  team4: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80',

  // Blog
  blog1: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&q=80',
  blog2: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80',
  blog3: 'https://images.unsplash.com/photo-1558051815-0f18e64e6280?w=1200&q=80',
  blog4: 'https://images.unsplash.com/photo-1536819114556-1e10f967fb61?w=1200&q=80',
  blog5: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=1200&q=80',
  blog6: 'https://images.unsplash.com/photo-1595207759571-3a4df3c49230?w=1200&q=80',

  // Kurumsal services
  cWelcome: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&q=80',
  cLobby: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
  cMeeting: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1200&q=80',
  cGift: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80',
  cDriedGift: 'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=1200&q=80',

  // Organizasyon
  oBoat: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&q=80',
  oBrideCar: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',

  // B2C ürünleri
  pBouquet: 'https://images.unsplash.com/photo-1530092285049-1c42085fd395?w=1200&q=80',
  pArrangement: 'https://images.unsplash.com/photo-1502780402662-acc01917a35f?w=1200&q=80',
  pPot: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80',
  pOrchid: 'https://images.unsplash.com/photo-1567748157439-651aca2ff064?w=1200&q=80',
  pTebrik: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80',
  pWreath: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=1200&q=80',
  pDried: 'https://images.unsplash.com/photo-1604323990536-6e49834c6885?w=1200&q=80',
};

// Real-photo image component
export function PhotoImage({
  src,
  ratio = '4/5',
  style,
  className,
  label,
  overlay = 0,
}: any) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        aspectRatio: ratio,
        overflow: 'hidden',
        background: 'var(--paper-warm)',
        ...style,
      }}
    >
      <img
        src={src}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {overlay > 0 && (
        <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${overlay})` }} />
      )}
      {label && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            color: '#fff',
            fontSize: 12,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textShadow: '0 1px 8px rgba(0,0,0,0.4)',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

// Generate a floral painterly SVG image
export function FloralImage({
  palette = 'sage',
  seed = 1,
  style,
  className,
  ratio = '4/5',
  label,
  photo,
}: any) {
  // If photo key supplied, render real image instead
  if (photo && PHOTOS[photo]) {
    return <PhotoImage src={PHOTOS[photo]} ratio={ratio} style={style} className={className} label={label} />;
  }
  const p = palettes[palette] || palettes.sage;
  // Deterministic pseudo-random
  const rand = (n: number) => {
    const x = Math.sin(seed * 99 + n * 37) * 10000;
    return x - Math.floor(x);
  };
  const flowers: any[] = [];
  const nF = 7 + Math.floor(rand(0) * 5);
  for (let i = 0; i < nF; i++) {
    const cx = 20 + rand(i * 2) * 360;
    const cy = 40 + rand(i * 2 + 1) * 420;
    const r = 28 + rand(i * 3) * 60;
    const color = p[2 + Math.floor(rand(i * 5) * 2) - 1] || p[2];
    flowers.push({ cx, cy, r, color, i });
  }
  const leaves: any[] = [];
  const nL = 10 + Math.floor(rand(50) * 8);
  for (let i = 0; i < nL; i++) {
    const cx = rand(i * 7 + 100) * 400;
    const cy = rand(i * 7 + 101) * 500;
    const rot = rand(i * 7 + 102) * 360;
    const len = 40 + rand(i * 7 + 103) * 60;
    leaves.push({ cx, cy, rot, len, i });
  }

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        aspectRatio: ratio,
        background: `linear-gradient(135deg, ${p[0]}, ${p[1]})`,
        overflow: 'hidden',
        ...style,
      }}
    >
      <svg
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id={`glow-${seed}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={p[0]} stopOpacity="1" />
            <stop offset="100%" stopColor={p[1]} stopOpacity="0" />
          </radialGradient>
          <filter id={`blur-${seed}`}>
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        <rect width="400" height="500" fill={`url(#glow-${seed})`} />

        {leaves.map((l) => (
          <g key={l.i} transform={`translate(${l.cx} ${l.cy}) rotate(${l.rot})`} opacity="0.55">
            <ellipse cx="0" cy="0" rx={l.len} ry={l.len / 4} fill={p[3]} opacity="0.4" />
          </g>
        ))}

        {flowers.map((f) => (
          <g key={f.i} transform={`translate(${f.cx} ${f.cy})`} filter={`url(#blur-${seed})`}>
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <ellipse
                key={k}
                cx={Math.cos(k * 1.047) * f.r * 0.4}
                cy={Math.sin(k * 1.047) * f.r * 0.4}
                rx={f.r * 0.6}
                ry={f.r * 0.45}
                fill={f.color}
                opacity="0.7"
                transform={`rotate(${k * 60})`}
              />
            ))}
            <circle cx="0" cy="0" r={f.r * 0.25} fill={p[3]} opacity="0.9" />
          </g>
        ))}

        <rect width="400" height="500" fill="url(#grain)" opacity="0.04" />
      </svg>

      {label && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            color: '#fff',
            fontSize: 12,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textShadow: '0 1px 8px rgba(0,0,0,0.4)',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

// Themed named images for service cards + hero slides
export const IMAGES: Record<string, any> = {
  wedding: { palette: 'creamPink', seed: 3, label: 'Düğün', photo: 'sWedding' },
  corporate: { palette: 'sage', seed: 7, label: 'Kurumsal', photo: 'sCorporate' },
  birthday: { palette: 'dusty', seed: 11, label: 'Doğum Günü', photo: 'sBirthday' },
  proposal: { palette: 'dusty', seed: 17, label: 'Teklif', photo: 'sProposal' },
  bachelor: { palette: 'roseWhite', seed: 23, label: 'Bekarlığa Veda', photo: 'sBachelor' },
  venue: { palette: 'sage', seed: 29, label: 'Mekan Süsleme', photo: 'sVenue' },
  congress: { palette: 'moody', seed: 31, label: 'Kongre', photo: 'sCongress' },
  event: { palette: 'haki', seed: 37, label: 'Etkinlik', photo: 'sEvent' },
  landscape: { palette: 'garden', seed: 41, label: 'Peyzaj', photo: 'sLandscape' },
  lobby: { palette: 'sage', seed: 43, label: 'Lobi', photo: 'gLobby' },
  table: { palette: 'creamPink', seed: 47, label: 'Masa', photo: 'gTable' },
  dried: { palette: 'toprak', seed: 53, label: 'Kurutulmuş', photo: 'gDried' },
  gift: { palette: 'dusty', seed: 59, label: 'Hediye', photo: 'gGift' },
  welcome: { palette: 'roseWhite', seed: 61, label: 'Karşılama', photo: 'gWelcome' },
  aisle: { palette: 'creamPink', seed: 67, label: 'Gelin Yolu', photo: 'gAisle' },
  arch: { palette: 'sage', seed: 71, label: 'Ark', photo: 'gArch' },
  centerpc: { palette: 'roseWhite', seed: 73, label: 'Sunum', photo: 'gCenter' },
};

// Wrap FloralImage so callers that pass a key don't need to know about PHOTOS lookup
export function Img(props: any) {
  const { imgKey, ...rest } = props;
  const meta = IMAGES[imgKey];
  if (meta && meta.photo)
    return <FloralImage {...rest} palette={meta.palette} seed={meta.seed} photo={meta.photo} />;
  return <FloralImage {...rest} />;
}
