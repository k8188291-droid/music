import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlayer } from '../../hooks/usePlayer'
import AddToPlaylistMenu from '../playlist/AddToPlaylistMenu'

function formatDuration(s) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function TrackRow({ track, index, queue, startIndex }) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer()
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false)
  const isCurrent = currentTrack?.id === track.id

  function handlePlay(e) {
    e.stopPropagation()
    if (isCurrent) togglePlay()
    else playTrack(track, queue, startIndex ?? index)
  }

  // Derive albumId from track — mock data uses "albumId-trackNum" format
  const albumId = track.id?.split('-')?.[0] || null

  return (
    <div
      className="w-full grid gap-4 items-center px-2 py-3 rounded-lg transition-colors duration-150 group"
      style={{
        gridTemplateColumns: '2.5rem 1fr 1fr auto 3.5rem',
        background: isCurrent ? 'var(--accent-glow)' : 'transparent',
        color: isCurrent ? 'var(--accent)' : 'var(--text-primary)',
      }}
      onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.background = 'var(--bg-hover)' }}
      onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.background = 'transparent' }}
    >
      {/* Number / playing indicator */}
      <span
        className="text-center text-[13px] cursor-pointer"
        style={{ color: isCurrent ? 'var(--accent)' : 'var(--text-muted)' }}
        onClick={handlePlay}
      >
        {isCurrent && isPlaying ? (
          <span className="inline-flex items-end gap-[2px] h-3">
            {[0, 1, 2].map((j) => (
              <span key={j} className="sound-bar inline-block w-[3px] rounded-sm" style={{ background: 'var(--accent)', height: '100%' }} />
            ))}
          </span>
        ) : (
          index + 1
        )}
      </span>

      {/* Title + artist + cover */}
      <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={handlePlay}>
        {track.albumCover && (
          <img src={track.albumCover} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-[13px] font-medium truncate">{track.title}</p>
          <p className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
            {track.albumArtist}
          </p>
        </div>
      </div>

      {/* Album title — link to album page */}
      <span className="text-[12px] truncate hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
        {albumId ? (
          <Link
            to={`/album/${albumId}`}
            className="hover:underline underline-offset-2"
            style={{ color: 'inherit', textDecoration: 'none' }}
            onClick={(e) => e.stopPropagation()}
          >
            {track.albumTitle}
          </Link>
        ) : (
          track.albumTitle
        )}
      </span>

      {/* Add to playlist */}
      <div className="relative flex-shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); setShowPlaylistMenu(!showPlaylistMenu) }}
          className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          title="加入播放清單"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
        </button>
        {showPlaylistMenu && (
          <div className="fixed z-[200]" style={{ top: 'auto', right: 16, bottom: 'calc(var(--player-h) + 1rem)' }}>
            <AddToPlaylistMenu
              tracks={[track]}
              onClose={() => setShowPlaylistMenu(false)}
            />
          </div>
        )}
      </div>

      {/* Duration */}
      <span className="text-right text-[12px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
        {formatDuration(track.duration)}
      </span>
    </div>
  )
}
