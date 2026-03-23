import { Link } from 'react-router-dom'

const ASPECT_CLASS = {
  '1:1':  'aspect-square',
  '3:4':  'aspect-[3/4]',
  '16:9': 'aspect-video',
  '4:3':  'aspect-[4/3]',
}

export default function AlbumCard({ album }) {
  const aspectClass = ASPECT_CLASS[album.aspectRatio] ?? 'aspect-square'

  return (
    <Link
      to={`/album/${album.id}`}
      className="group block rounded-lg overflow-hidden bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
    >
      <div className={`relative overflow-hidden ${aspectClass}`}>
        <img
          src={album.coverImage}
          alt={album.title}
          loading="lazy"
          className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => e.preventDefault()}
            className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-2xl translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
          >
            <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
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
