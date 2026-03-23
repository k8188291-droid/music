import { Link } from 'react-router-dom'

const ASPECT_STYLE = {
  '1:1':  'aspect-square',
  '3:4':  'aspect-[3/4]',
  '16:9': 'aspect-video',
  '4:3':  'aspect-[4/3]',
}

export default function AlbumCard({ album, style }) {
  const aspectClass = ASPECT_STYLE[album.aspectRatio] ?? 'aspect-square'

  return (
    <Link
      to={`/album/${album.id}`}
      className="group block rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{ background: 'var(--bg-elevated)', ...style }}
    >
      {/* Image + vinyl peek */}
      <div className={`relative overflow-hidden ${aspectClass}`}>
        <img
          src={album.coverImage}
          alt={album.title}
          loading="lazy"
          className="w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />

        {/* Gradient veil */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}
        />

        {/* Play button */}
        <div className="absolute bottom-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => e.preventDefault()}
            className="w-11 h-11 rounded-full flex items-center justify-center shadow-xl transition-transform duration-200 hover:scale-110"
            style={{ background: 'var(--accent)', color: '#000' }}
          >
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>

        {/* Genre pill */}
        {album.genre && (
          <div
            className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-medium opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'var(--text-primary)' }}
          >
            {album.genre}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-3.5 py-3">
        <p
          className="text-[13px] font-semibold truncate"
          style={{ color: 'var(--text-primary)' }}
        >
          {album.title}
        </p>
        <p
          className="text-[11px] mt-0.5 truncate"
          style={{ color: 'var(--text-secondary)' }}
        >
          {album.artist}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span
            className="text-[10px] font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            {album.year}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span
            className="text-[10px]"
            style={{ color: 'var(--text-muted)' }}
          >
            {album.trackCount} 首
          </span>
        </div>
      </div>
    </Link>
  )
}
