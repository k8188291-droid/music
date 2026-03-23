import { useRef, useEffect } from 'react'

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null)

  useEffect(() => {
    function handleKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <header
      className="fixed top-0 right-0 z-20 flex items-center px-8 gap-4"
      style={{
        left: 'var(--sidebar-w)',
        height: 'var(--header-h)',
        background: 'rgba(6, 6, 10, 0.75)',
        backdropFilter: 'blur(24px) saturate(1.2)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Search field */}
      <div className="relative w-full max-w-sm group">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] pointer-events-none transition-colors duration-200"
          style={{ color: value ? 'var(--accent)' : 'var(--text-muted)' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          placeholder="搜尋專輯、藝人或風格…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-[13px] rounded-xl pl-10 pr-10 py-2.5 outline-none transition-all duration-200 placeholder:text-[var(--text-muted)] focus:ring-1"
          style={{
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-body)',
          }}
        />
        {value ? (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 hover:opacity-80"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <kbd
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded font-medium"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-hover)', border: '1px solid var(--border)' }}
          >
            ⌘K
          </kbd>
        )}
      </div>
    </header>
  )
}
