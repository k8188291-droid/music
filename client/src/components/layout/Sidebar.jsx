import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  {
    to: '/',
    end: true,
    label: '首頁',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    to: '/queue',
    label: '當前播放清單',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h8v-2H3v2zm13 0v-4l-5 4 5 4v-4z" />
      </svg>
    ),
  },
  {
    to: '/favorites',
    label: '我的最愛',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
  {
    to: '/recent',
    label: '近期播放',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-52 bg-black flex flex-col z-30 select-none">
      {/* Logo */}
      <div className="px-6 pt-6 pb-4">
        <span className="text-white font-bold text-lg tracking-tight">MusicBox</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ to, end, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'text-white bg-white/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section — could expand later */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-white/30 text-xs">© 2025 MusicBox</p>
      </div>
    </aside>
  )
}
