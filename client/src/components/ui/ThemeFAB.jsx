import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../../hooks/useTheme'

const THEMES = [
  {
    id: 'vinyl',
    label: 'Vinyl',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" opacity="0.3" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" fill="var(--bg-base)" />
      </svg>
    ),
  },
  {
    id: 'cinema',
    label: 'Cinema',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" strokeLinecap="round" strokeWidth="3" />
        <line x1="3" y1="12" x2="3.01" y2="12" strokeLinecap="round" strokeWidth="3" />
        <line x1="3" y1="18" x2="3.01" y2="18" strokeLinecap="round" strokeWidth="3" />
      </svg>
    ),
  },
]

export default function ThemeFAB() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: 'calc(var(--player-h) + 1.25rem)',
        right: '1.5rem',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
      }}
    >
      {/* Menu */}
      {open && (
        <div
          className="animate-fade-in-up"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '6px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            minWidth: '148px',
            animationDuration: '180ms',
          }}
        >
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id); setOpen(false) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '9px 12px',
                borderRadius: '9px',
                background: theme === t.id ? 'var(--bg-hover)' : 'transparent',
                color: theme === t.id ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: theme === t.id ? '600' : '400',
                cursor: 'pointer',
                border: 'none',
                textAlign: 'left',
                transition: 'background 150ms, color 150ms',
              }}
              onMouseEnter={(e) => {
                if (theme !== t.id) e.currentTarget.style.background = 'var(--bg-hover)'
              }}
              onMouseLeave={(e) => {
                if (theme !== t.id) e.currentTarget.style.background = 'transparent'
              }}
            >
              <span style={{ opacity: theme === t.id ? 1 : 0.6 }}>{t.icon}</span>
              <span style={{ flex: 1 }}>{t.label}</span>
              {theme === t.id && (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: open ? 'var(--accent)' : 'var(--bg-elevated)',
          color: open ? '#000' : 'var(--text-secondary)',
          border: '1px solid var(--border)',
          boxShadow: open
            ? '0 8px 24px var(--accent-glow)'
            : '0 4px 16px rgba(0,0,0,0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 200ms, color 200ms, box-shadow 200ms, transform 200ms',
          transform: open ? 'rotate(45deg)' : 'none',
        }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
        </svg>
      </button>
    </div>
  )
}
