import { Link } from 'react-router-dom'
import { usePlayer } from '../../hooks/usePlayer'

export default function AlbumListRow({ album, index, style }) {
  const { currentTrack } = usePlayer()
  const isCurrentAlbum = currentTrack?.albumTitle === album.title

  return (
    <div style={style}>
      <Link
        to={`/album/${album.id}`}
        className="group flex items-center gap-4 px-6 h-[72px] transition-colors duration-150"
        style={{
          background: isCurrentAlbum ? 'rgba(232,93,74,0.06)' : 'transparent',
          borderLeft: isCurrentAlbum ? '2px solid var(--accent)' : '2px solid transparent',
        }}
        onMouseEnter={(e) => {
          if (!isCurrentAlbum) e.currentTarget.style.background = 'var(--bg-elevated)'
        }}
        onMouseLeave={(e) => {
          if (!isCurrentAlbum) e.currentTarget.style.background = 'transparent'
        }}
      >
        {/* Row number / play icon */}
        <div className="w-8 flex-shrink-0 text-center">
          <span
            className="text-sm tabular-nums group-hover:hidden"
            style={{ color: isCurrentAlbum ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            {index + 1}
          </span>
          <svg
            className="w-4 h-4 mx-auto hidden group-hover:block"
            style={{ color: isCurrentAlbum ? 'var(--accent)' : 'var(--text-secondary)' }}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Album cover */}
        <img
          src={album.coverImage}
          alt={album.title}
          loading="lazy"
          className="w-11 h-11 object-cover flex-shrink-0"
          style={{ borderRadius: '4px' }}
        />

        {/* Title + artist */}
        <div className="flex-1 min-w-0">
          <p
            className="text-[14px] font-medium truncate"
            style={{ color: isCurrentAlbum ? 'var(--accent)' : 'var(--text-primary)' }}
          >
            {album.title}
          </p>
          <p className="text-[12px] truncate" style={{ color: 'var(--text-muted)' }}>
            {album.artist}
          </p>
        </div>

        {/* Genre badge */}
        <div
          className="hidden sm:flex flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide"
          style={{
            background: 'var(--bg-hover)',
            color: 'var(--text-muted)',
            minWidth: '80px',
            justifyContent: 'center',
          }}
        >
          {album.genre}
        </div>

        {/* Year */}
        <span
          className="hidden md:block w-12 text-right text-[12px] tabular-nums flex-shrink-0"
          style={{ color: 'var(--text-muted)' }}
        >
          {album.year}
        </span>

        {/* Track count */}
        <span
          className="w-14 text-right text-[12px] tabular-nums flex-shrink-0"
          style={{ color: 'var(--text-muted)' }}
        >
          {album.trackCount} 首
        </span>
      </Link>
    </div>
  )
}
