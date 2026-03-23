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
      <div className="flex justify-center items-center" style={{ minHeight: '70vh' }}>
        <Spinner size={48} />
      </div>
    )
  }

  if (isError || !album) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 animate-fade-in" style={{ minHeight: '70vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>找不到該專輯</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm underline underline-offset-4 transition-colors"
          style={{ color: 'var(--accent)' }}
        >
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
    <div className="pb-12 animate-fade-in">
      {/* Hero header */}
      <div className="relative overflow-hidden">
        {/* Background blur from cover */}
        <div
          className="absolute inset-0 scale-110 blur-3xl opacity-30"
          style={{
            backgroundImage: `url(${album.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(6,6,10,0.4), var(--bg-base))' }}
        />

        <div className="relative px-8 pt-12 pb-8">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[13px] mb-8 transition-colors duration-200 group"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            返回
          </button>

          <div className="flex gap-8 items-end">
            {/* Album cover */}
            <div className="relative flex-shrink-0 animate-scale-in">
              <img
                src={album.coverImage}
                alt={album.title}
                className="w-56 h-56 object-cover rounded-lg"
                style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}
              />
              {/* Vinyl disc peeking */}
              <div
                className="absolute top-4 -right-6 w-48 h-48 rounded-full -z-10"
                style={{
                  background: 'conic-gradient(from 0deg, #111, #1a1a1a, #111, #151515, #111)',
                  boxShadow: 'inset 0 0 0 20px #0a0a0a, inset 0 0 0 22px #1a1a1a, inset 0 0 0 40px #0d0d0d',
                }}
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
              </div>
            </div>

            {/* Album info */}
            <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <p
                className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-2"
                style={{ color: 'var(--accent)' }}
              >
                專輯
              </p>
              <h1
                className="text-5xl font-bold leading-tight mb-4"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                {album.title}
              </h1>
              <div className="flex items-center gap-2 text-[13px] flex-wrap">
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{album.artist}</span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-secondary)' }}>{album.year}</span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-secondary)' }}>{album.tracks.length} 首歌曲</span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-secondary)' }}>{totalDuration(album.tracks)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="px-8 py-5 flex items-center gap-5 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 hover:brightness-110"
          style={{ background: 'var(--accent)', color: '#000', boxShadow: '0 8px 24px var(--accent-glow)' }}
        >
          {isThisAlbumPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Track list header */}
      <div
        className="mx-8 mb-1 grid grid-cols-[2.5rem_1fr_3.5rem] gap-4 text-[10px] uppercase tracking-[0.15em] font-semibold pb-3"
        style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}
      >
        <span className="text-center">#</span>
        <span>標題</span>
        <span className="text-right">
          <svg className="w-3.5 h-3.5 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </span>
      </div>

      {/* Tracks */}
      <div className="mx-4">
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
