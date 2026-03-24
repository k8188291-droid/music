import { usePlayer } from '../hooks/usePlayer'

function formatDuration(s) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function QueuePage() {
  const { queue, currentIndex, isPlaying, playTrack, togglePlay, currentTrack } = usePlayer()

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 animate-fade-in">
        <svg className="w-16 h-16" style={{ color: 'var(--text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
        </svg>
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          播放清單
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          播放音樂後，佇列將會顯示在這裡
        </p>
      </div>
    )
  }

  return (
    <div className="px-8 py-6 animate-fade-in">
      <h1
        className="text-3xl font-bold mb-1"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
      >
        播放清單
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        {queue.length} 首歌曲
      </p>

      {/* Header */}
      <div
        className="grid grid-cols-[2.5rem_1fr_1fr_3.5rem] gap-4 text-[10px] uppercase tracking-[0.15em] font-semibold pb-3 mb-1"
        style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}
      >
        <span className="text-center">#</span>
        <span>標題</span>
        <span className="hidden sm:block">專輯</span>
        <span className="text-right">
          <svg className="w-3.5 h-3.5 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </span>
      </div>

      {/* Track list */}
      {queue.map((track, i) => {
        const isCurrent = i === currentIndex
        return (
          <button
            key={`${track.id}-${i}`}
            onClick={() => {
              if (isCurrent) togglePlay()
              else playTrack(track, queue, i)
            }}
            className="w-full grid grid-cols-[2.5rem_1fr_1fr_3.5rem] gap-4 items-center px-2 py-3 rounded-lg transition-colors duration-150"
            style={{
              background: isCurrent ? 'var(--accent-glow)' : 'transparent',
              color: isCurrent ? 'var(--accent)' : 'var(--text-primary)',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              if (!isCurrent) e.currentTarget.style.background = 'var(--bg-hover)'
            }}
            onMouseLeave={(e) => {
              if (!isCurrent) e.currentTarget.style.background = 'transparent'
            }}
          >
            <span className="text-center text-[13px]" style={{ color: isCurrent ? 'var(--accent)' : 'var(--text-muted)' }}>
              {isCurrent && isPlaying ? (
                <span className="inline-flex items-end gap-[2px] h-3">
                  {[0, 1, 2].map((j) => (
                    <span
                      key={j}
                      className="sound-bar inline-block w-[3px] rounded-sm"
                      style={{ background: 'var(--accent)', height: '100%' }}
                    />
                  ))}
                </span>
              ) : (
                i + 1
              )}
            </span>

            <div className="flex items-center gap-3 min-w-0">
              {track.albumCover && (
                <img
                  src={track.albumCover}
                  alt=""
                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-[13px] font-medium truncate">{track.title}</p>
                <p className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                  {track.albumArtist}
                </p>
              </div>
            </div>

            <span className="text-[12px] truncate hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
              {track.albumTitle}
            </span>

            <span className="text-right text-[12px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
              {formatDuration(track.duration)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
