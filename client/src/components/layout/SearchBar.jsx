export default function SearchBar({ value, onChange }) {
  return (
    <header className="fixed top-0 left-52 right-0 h-16 bg-[#121212]/90 backdrop-blur-md z-20 flex items-center px-6 gap-4 border-b border-white/5">
      <div className="relative w-full max-w-md">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <input
          type="search"
          placeholder="搜尋專輯、藝人..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/10 text-white placeholder-white/40 text-sm rounded-full pl-10 pr-4 py-2 outline-none focus:bg-white/15 transition-colors"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}
      </div>
    </header>
  )
}
