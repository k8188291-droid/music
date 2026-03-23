import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchAlbum } from '../api/albumApi'
import TrackItem from '../components/album/TrackItem'
import Spinner from '../components/ui/Spinner'
import { usePlayer } from '../hooks/usePlayer'

function totalDuration(tracks) {
  const secs = tracks.reduce((sum, t) => sum + t.duration, 0)
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  return h > 0 ? `${h} 小時 ${m} 分鐘` : `${m} 分鐘`
}

export default function AlbumPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { playAlbum, currentTrack, isPlaying, togglePlay } = usePlayer()

  const { data: album, isLoading, isError } = useQuery({
    queryKey: ['album', id],
    queryFn: () => fetchAlbum(id),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size={48} />
      </div>
    )
  }

  if (isError || !album) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-white/50">找不到該專輯</p>
        <button onClick={() => navigate(-1)} className="text-white underline text-sm">
          返回
        </button>
      </div>
    )
  }

  const tracksWithMeta = album.tracks.map((t) => ({
    ...t,
    albumCover: album.coverImage,
    albumTitle: album.title,
    albumArtist: album.artist,
  }))

  const isThisAlbumPlaying =
    isPlaying && album.tracks.some((t) => t.id === currentTrack?.id)

  function handlePlayAll() {
    if (isThisAlbumPlaying) {
      togglePlay()
    } else if (album.tracks.some((t) => t.id === currentTrack?.id)) {
      togglePlay()
    } else {
      playAlbum(tracksWithMeta)
    }
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Header with gradient */}
      <div
        className="relative px-6 pt-16 pb-6"
        style={{
          background: `linear-gradient(to bottom, ${album.color}cc 0%, ${album.color}44 60%, transparent 100%)`,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-white/70 hover:text-white flex items-center gap-1 text-sm transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          返回
        </button>

        <div className="flex gap-6 items-end">
          <img
            src={album.coverImage}
            alt={album.title}
            className="w-48 h-48 object-cover rounded shadow-2xl flex-shrink-0"
          />
          <div>
            <p className="text-white/70 text-xs uppercase tracking-widest mb-1">專輯</p>
            <h1 className="text-white font-bold text-4xl mb-3">{album.title}</h1>
            <p className="text-white/80 text-sm">
              <span className="font-semibold">{album.artist}</span>
              <span className="text-white/50"> • {album.year} • {album.tracks.length} 首歌曲</span>
              <span className="text-white/50"> • {totalDuration(album.tracks)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 flex items-center gap-4">
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
        >
          {isThisAlbumPlaying ? (
            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Track list header */}
      <div className="px-6 mb-2 grid grid-cols-[2rem_1fr_4rem] gap-4 text-white/50 text-xs uppercase tracking-widest border-b border-white/10 pb-2">
        <span className="text-center">#</span>
        <span>標題</span>
        <span className="text-right">
          <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
          </svg>
        </span>
      </div>

      {/* Tracks */}
      <div className="px-2">
        {album.tracks.map((track, i) => (
          <TrackItem
            key={track.id}
            track={track}
            index={i}
            queue={tracksWithMeta}
            album={album}
          />
        ))}
      </div>
    </div>
  )
}
