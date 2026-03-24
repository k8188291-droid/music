import { usePlayer } from '../../hooks/usePlayer'
import { useRecent } from '../../hooks/useRecent'

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function TrackItem({ track, index, queue, album, maxDuration }) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer()
  const { addRecent } = useRecent()
  const isCurrent = currentTrack?.id === track.id
  const relativeWidth = maxDuration ? `${(track.duration / maxDuration) * 100}%` : '0%'

  function handlePlay() {
    if (isCurrent) {
      togglePlay()
    } else {
      playTrack(
        track,
        queue.map((t) => ({ ...t, albumCover: album.coverImage, albumTitle: album.title, albumArtist: album.artist })),
        index,
      )
      addRecent(album.id)
    }
  }

  return (
    <div
      onClick={handlePlay}
      className="group flex items-center gap-4 px-4 py-4 cursor-pointer transition-all duration-200"
      style={{
        background: isCurrent ? 'rgba(var(--accent-rgb, 212,160,83), 0.04)' : 'transparent',
        borderLeft: isCurrent ? '2px solid var(--accent)' : '2px solid transparent',
        borderRadius: isCurrent ? '0 8px 8px 0' : '8px',
      }}
      onMouseEnter={(e) => {
        if (!isCurrent) e.currentTarget.style.background = 'var(--bg-hover)'
      }}
      onMouseLeave={(e) => {
        if (!isCurrent) e.currentTarget.style.background = 'transparent'
      }}
    >
      {/* Number / Play icon */}
      <div className="w-8 text-center flex-shrink-0">
        {isCurrent && isPlaying ? (
          <SoundWave />
        ) : (
          <>
            <span
              className="text-[13px] tabular-nums group-hover:hidden"
              style={{ color: isCurrent ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              {track.trackNumber}
            </span>
            <svg
              className="w-4 h-4 hidden group-hover:block mx-auto"
              style={{ color: isCurrent ? 'var(--accent)' : 'var(--text-primary)' }}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              {isCurrent && !isPlaying ? (
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              ) : (
                <path d="M8 5v14l11-7z" />
              )}
            </svg>
          </>
        )}
      </div>

      {/* Title + duration bar */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[13px] truncate font-medium mb-1.5"
          style={{ color: isCurrent ? 'var(--accent)' : 'var(--text-primary)' }}
        >
          {track.title}
        </p>
        {/* Relative duration bar */}
        <div
          className="h-[2px] rounded-full overflow-hidden"
          style={{ background: 'var(--bg-hover)', maxWidth: '180px' }}
        >
          <div
            style={{
              width: relativeWidth,
              height: '100%',
              background: isCurrent ? 'var(--accent)' : 'var(--text-muted)',
              borderRadius: '9999px',
              opacity: isCurrent ? 0.8 : 0.4,
              transition: 'width 400ms ease',
            }}
          />
        </div>
      </div>

      {/* Duration */}
      <span
        className="hidden sm:block text-[12px] tabular-nums flex-shrink-0 transition-opacity duration-200"
        style={{ color: 'var(--text-muted)' }}
      >
        {formatDuration(track.duration)}
      </span>

      {/* Duration on mobile */}
      <span
        className="sm:hidden text-[12px] tabular-nums flex-shrink-0"
        style={{ color: 'var(--text-muted)' }}
      >
        {formatDuration(track.duration)}
      </span>
    </div>
  )
}

function SoundWave() {
  return (
    <div className="flex items-end justify-center gap-[2px] h-4">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-[2.5px] rounded-full sound-bar"
          style={{
            background: 'var(--accent)',
            height: `${40 + i * 15}%`,
          }}
        />
      ))}
    </div>
  )
}
