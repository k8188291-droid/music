import { usePlayer } from '../../hooks/usePlayer'

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function TrackItem({ track, index, queue, album }) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer()
  const isCurrent = currentTrack?.id === track.id

  function handlePlay() {
    if (isCurrent) {
      togglePlay()
    } else {
      playTrack(
        track,
        queue.map((t) => ({ ...t, albumCover: album.coverImage, albumTitle: album.title, albumArtist: album.artist })),
        index,
      )
    }
  }

  return (
    <div
      onClick={handlePlay}
      className={`group flex items-center gap-4 px-4 py-2 rounded-md cursor-pointer transition-colors ${
        isCurrent ? 'bg-white/10' : 'hover:bg-white/10'
      }`}
    >
      {/* Number / Play icon */}
      <div className="w-8 text-center flex-shrink-0">
        {isCurrent && isPlaying ? (
          <SoundWave />
        ) : (
          <>
            <span className={`text-sm group-hover:hidden ${isCurrent ? 'text-green-400' : 'text-white/50'}`}>
              {track.trackNumber}
            </span>
            <svg
              className="w-4 h-4 text-white hidden group-hover:block mx-auto"
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

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${isCurrent ? 'text-green-400' : 'text-white'}`}>
          {track.title}
        </p>
      </div>

      {/* Duration */}
      <span className="text-white/50 text-sm flex-shrink-0">{formatDuration(track.duration)}</span>
    </div>
  )
}

function SoundWave() {
  return (
    <div className="flex items-end justify-center gap-[2px] h-4">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[3px] bg-green-400 rounded-sm animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, height: `${50 + i * 20}%` }}
        />
      ))}
    </div>
  )
}
