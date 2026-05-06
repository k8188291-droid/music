// Preset SVG cover patterns for playlists
// Each cover is a function that takes { color, size } and returns an SVG

export const PRESET_COVERS = [
  {
    id: 'waves',
    label: '波浪',
    render: (color, size = 80) => (
      <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill={color} />
        <path d="M0 40 Q10 30 20 40 T40 40 T60 40 T80 40 V80 H0Z" fill="rgba(255,255,255,0.15)" />
        <path d="M0 50 Q10 40 20 50 T40 50 T60 50 T80 50 V80 H0Z" fill="rgba(255,255,255,0.1)" />
        <path d="M0 60 Q10 50 20 60 T40 60 T60 60 T80 60 V80 H0Z" fill="rgba(255,255,255,0.07)" />
      </svg>
    ),
  },
  {
    id: 'circles',
    label: '圓圈',
    render: (color, size = 80) => (
      <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill={color} />
        <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <circle cx="40" cy="40" r="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <circle cx="40" cy="40" r="10" fill="rgba(255,255,255,0.2)" />
      </svg>
    ),
  },
  {
    id: 'grid',
    label: '格子',
    render: (color, size = 80) => (
      <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill={color} />
        {[20, 40, 60].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="80" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        ))}
        {[20, 40, 60].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="80" y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        ))}
        <rect x="22" y="22" width="16" height="16" rx="3" fill="rgba(255,255,255,0.15)" />
        <rect x="42" y="42" width="16" height="16" rx="3" fill="rgba(255,255,255,0.15)" />
      </svg>
    ),
  },
  {
    id: 'diamond',
    label: '菱形',
    render: (color, size = 80) => (
      <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill={color} />
        <path d="M40 10 L65 40 L40 70 L15 40 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <path d="M40 22 L55 40 L40 58 L25 40 Z" fill="rgba(255,255,255,0.1)" />
        <circle cx="40" cy="40" r="4" fill="rgba(255,255,255,0.25)" />
      </svg>
    ),
  },
  {
    id: 'music',
    label: '音符',
    render: (color, size = 80) => (
      <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill={color} />
        <path d="M30 55 V22 L55 17 V50" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="26" cy="55" r="6" fill="rgba(255,255,255,0.2)" />
        <circle cx="51" cy="50" r="6" fill="rgba(255,255,255,0.2)" />
      </svg>
    ),
  },
  {
    id: 'stripes',
    label: '條紋',
    render: (color, size = 80) => (
      <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill={color} />
        {[0, 16, 32, 48, 64].map((y) => (
          <rect key={y} x="0" y={y} width="80" height="8" fill="rgba(255,255,255,0.08)" />
        ))}
        <rect x="15" y="25" width="50" height="30" rx="6" fill="rgba(255,255,255,0.12)" />
      </svg>
    ),
  },
  {
    id: 'star',
    label: '星星',
    render: (color, size = 80) => (
      <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill={color} />
        <path d="M40 15 L46 32 L64 32 L50 43 L55 60 L40 50 L25 60 L30 43 L16 32 L34 32 Z" fill="rgba(255,255,255,0.2)" />
        <circle cx="18" cy="18" r="2" fill="rgba(255,255,255,0.15)" />
        <circle cx="65" cy="22" r="1.5" fill="rgba(255,255,255,0.12)" />
        <circle cx="60" cy="65" r="2" fill="rgba(255,255,255,0.1)" />
      </svg>
    ),
  },
  {
    id: 'heart',
    label: '愛心',
    render: (color, size = 80) => (
      <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill={color} />
        <path d="M40 62 C25 50 12 40 12 28 C12 20 18 14 26 14 C32 14 37 18 40 22 C43 18 48 14 54 14 C62 14 68 20 68 28 C68 40 55 50 40 62Z" fill="rgba(255,255,255,0.2)" />
      </svg>
    ),
  },
]

export const PLAYLIST_COLORS = [
  '#d4a053', '#e85d4a', '#3ecfcf', '#1ed760',
  '#8b5cf6', '#ec4899', '#f59e0b', '#6366f1',
  '#14b8a6', '#ef4444', '#3b82f6', '#a855f7',
]

export function PlaylistCover({ coverId, coverUrl, color, size = 80, className = '' }) {
  if (coverUrl) {
    return (
      <img
        src={coverUrl}
        alt=""
        className={`object-cover ${className}`}
        style={{ width: size, height: size, borderRadius: 8 }}
      />
    )
  }
  const preset = PRESET_COVERS.find((c) => c.id === coverId) ?? PRESET_COVERS[0]
  return (
    <div className={className} style={{ width: size, height: size, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
      {preset.render(color, size)}
    </div>
  )
}
