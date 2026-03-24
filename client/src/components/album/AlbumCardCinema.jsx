import { Link } from 'react-router-dom'

export default function AlbumCardCinema({ album }) {
  return (
    <Link
      to={`/album/${album.id}`}
      className="group relative block aspect-square overflow-hidden cursor-pointer"
      style={{ borderRadius: '16px' }}
    >
      {/* Full-bleed image */}
      <img
        src={album.coverImage}
        alt={album.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
      />

      {/* Permanent gradient veil at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)',
        }}
      />

      {/* Hover tint */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'rgba(62,207,207,0.08)' }}
      />

      {/* Always-visible text */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8">
        <p className="text-white font-bold text-[15px] leading-tight truncate drop-shadow-md">
          {album.title}
        </p>
        <p className="text-white/70 text-[12px] mt-0.5 truncate">{album.artist}</p>
      </div>

      {/* Play button — appears on hover */}
      <div className="absolute top-3 right-3 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
        <button
          onClick={(e) => e.preventDefault()}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-xl"
          style={{ background: 'var(--accent)', color: '#000' }}
        >
          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      {/* Genre badge — always visible */}
      {album.genre && (
        <div
          className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
          style={{
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            color: 'var(--accent)',
            border: '1px solid rgba(62,207,207,0.25)',
          }}
        >
          {album.genre}
        </div>
      )}
    </Link>
  )
}
