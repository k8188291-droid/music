import { Link } from 'react-router-dom'

export default function AlbumCard({ album }) {
  return (
    <Link
      to={`/album/${album.id}`}
      className="group block break-inside-avoid mb-4 rounded-lg overflow-hidden bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
    >
      <div className="relative overflow-hidden">
        <img
          src={album.coverImage}
          alt={album.title}
          loading="lazy"
          className="w-full object-cover block transition-transform duration-500 group-hover:scale-105"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => e.preventDefault()}
            className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-2xl translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
          >
            <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-3">
        <p className="text-white font-semibold text-sm truncate">{album.title}</p>
        <p className="text-white/60 text-xs mt-0.5 truncate">{album.artist}</p>
        <p className="text-white/40 text-xs mt-0.5">{album.year}</p>
      </div>
    </Link>
  )
}
