import { NavLink, useLocation } from 'react-router-dom'
import { usePlaylists } from '../../hooks/usePlaylists'
import { PlaylistCover } from '../playlist/PlaylistCovers'

const NAV_ITEMS = [
  {
    to: '/',
    end: true,
    label: '首頁',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 flex-shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    to: '/queue',
    label: '播放清單',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 flex-shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
      </svg>
    ),
  },
  {
    to: '/favorites',
    label: '我的最愛',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 flex-shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
  {
    to: '/recent',
    label: '近期播放',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 flex-shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const location = useLocation()
  const { playlists } = usePlaylists()

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-30 flex flex-col select-none animate-slide-in-left"
      style={{
        width: 'var(--sidebar-w)',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="px-6 pt-8 pb-8">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex-shrink-0">
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #1a1a1a, #333, #1a1a1a, #2a2a2a, #1a1a1a)',
                boxShadow: 'inset 0 0 0 3px #111, inset 0 0 0 5px #222',
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
          </div>
          <span
            className="text-xl tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 700 }}
          >
            MusicBox
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <p
          className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: 'var(--text-muted)' }}
        >
          瀏覽
        </p>
        <div className="space-y-0.5">
          {NAV_ITEMS.map(({ to, end, label, icon }) => {
            const isActive = end ? location.pathname === to : location.pathname.startsWith(to)
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className="relative flex items-center gap-3.5 px-3 py-3.5 rounded-xl font-medium transition-all duration-200"
                style={{
                  fontSize: '14px',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-hover)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent'
                }}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
                <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {icon}
                </span>
                {label}
              </NavLink>
            )
          })}
        </div>

        {/* User playlists in sidebar */}
        {playlists.length > 0 && (
          <div className="mt-6">
            <p
              className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: 'var(--text-muted)' }}
            >
              我的清單
            </p>
            <div className="space-y-0.5">
              {playlists.map((pl) => {
                const isActive = location.pathname === `/playlist/${pl.id}`
                return (
                  <NavLink
                    key={pl.id}
                    to={`/playlist/${pl.id}`}
                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200"
                    style={{
                      fontSize: '13px',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--bg-hover)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {isActive && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full"
                        style={{ background: pl.color }}
                      />
                    )}
                    <PlaylistCover coverId={pl.coverId} coverUrl={pl.coverUrl} color={pl.color} size={28} />
                    <span className="truncate">{pl.name}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-6 py-6" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-[11px]" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          Curated with care
        </p>
      </div>
    </aside>
  )
}
