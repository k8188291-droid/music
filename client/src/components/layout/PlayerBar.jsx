import { useRef, useEffect, useState } from 'react'
import { usePlayer } from '../../hooks/usePlayer'

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

export default function PlayerBar() {
  const {
    queue, currentIndex, isPlaying, volume, progress, duration,
    shuffleMode, repeatMode,
    togglePlay, next, prev, seek, setVolume, setProgress, setDuration,
    toggleShuffle, toggleRepeat,
  } = usePlayer()

  const audioRef = useRef(null)
  const currentTrack = queue[currentIndex] ?? null
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack?.audioFile) return
    if (isPlaying) audio.play().catch(() => {})
    else audio.pause()
  }, [isPlaying, currentIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (currentTrack?.audioFile) {
      audio.src = currentTrack.audioFile
      audio.load()
      if (isPlaying) audio.play().catch(() => {})
    }
  }, [currentIndex, currentTrack?.audioFile])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = volume
  }, [volume])

  if (!currentTrack) return null

  const pct = duration ? (progress / duration) * 100 : 0

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress(e.target.currentTime)}
        onDurationChange={(e) => setDuration(e.target.duration)}
        onEnded={() => next()}
      />

      {/* ── Expanded fullscreen player (mobile) ── */}
      {expanded && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center px-8 py-10"
          style={{
            background: 'var(--bg-base)',
          }}
        >
          {/* Close / collapse button */}
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'var(--bg-hover)', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Cover art */}
          <img
            src={currentTrack.albumCover || currentTrack.coverImage}
            alt={currentTrack.title}
            className="w-64 h-64 rounded-2xl object-cover mb-8"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
          />

          {/* Track info */}
          <p
            className="text-xl font-bold text-center mb-1 max-w-full truncate"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            {currentTrack.title}
          </p>
          <p className="text-sm text-center mb-8" style={{ color: 'var(--text-secondary)' }}>
            {currentTrack.albumArtist || currentTrack.artist || ''}
          </p>

          {/* Progress bar */}
          <div className="flex items-center gap-3 w-full max-w-sm mb-8">
            <span className="text-[11px] w-9 text-right tabular-nums" style={{ color: 'var(--text-muted)' }}>
              {formatTime(progress)}
            </span>
            <div
              className="flex-1 h-[4px] rounded-full cursor-pointer relative"
              style={{ background: 'rgba(255,255,255,0.1)' }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const t = ((e.clientX - rect.left) / rect.width) * duration
                seek(t)
                if (audioRef.current) audioRef.current.currentTime = t
              }}
            >
              <div
                className="h-full rounded-full relative"
                style={{ width: `${pct}%`, background: 'var(--accent)' }}
              >
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full"
                  style={{ background: 'var(--accent)', boxShadow: '0 0 8px rgba(212,160,83,0.4)' }}
                />
              </div>
            </div>
            <span className="text-[11px] w-9 tabular-nums" style={{ color: 'var(--text-muted)' }}>
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-8 mb-8">
            <button
              onClick={toggleShuffle}
              className="transition-colors duration-200"
              style={{ color: shuffleMode ? 'var(--accent)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <ShuffleIcon />
            </button>
            <button
              onClick={prev}
              className="transition-colors duration-200"
              style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <SkipPrevIcon />
            </button>
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'var(--text-primary)', color: 'var(--bg-base)', border: 'none', cursor: 'pointer' }}
            >
              {isPlaying ? <PauseIconLg /> : <PlayIconLg />}
            </button>
            <button
              onClick={next}
              className="transition-colors duration-200"
              style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <SkipNextIcon />
            </button>
            <button
              onClick={toggleRepeat}
              className="relative transition-colors duration-200"
              style={{ color: repeatMode !== 'none' ? 'var(--accent)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <RepeatIcon />
              {repeatMode === 'one' && (
                <span className="absolute -top-1 -right-1.5 text-[8px] font-bold" style={{ color: 'var(--accent)' }}>1</span>
              )}
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 w-full max-w-[200px]">
            <VolumeIcon volume={volume} />
            <div
              className="flex-1 h-[3px] rounded-full cursor-pointer relative"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const v = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
                setVolume(v)
                if (audioRef.current) audioRef.current.volume = v
              }}
            >
              <div
                className="h-full rounded-full transition-colors"
                style={{ width: `${volume * 100}%`, background: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Mini bar (always visible at bottom) ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          height: 'var(--player-h)',
          background: 'rgba(10, 10, 14, 0.85)',
          backdropFilter: 'blur(32px) saturate(1.5)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div className="h-full max-w-screen-xl mx-auto flex items-center gap-4 px-5 max-md:gap-2 max-md:px-3">
          {/* ── Left: track info with mini vinyl ── */}
          <div
            className="flex items-center gap-3.5 w-60 flex-shrink-0 min-w-0 max-md:w-auto max-md:gap-2.5 max-md:flex-1 max-md:cursor-pointer"
            onClick={() => {
              if (window.innerWidth < 768) setExpanded(true)
            }}
          >
            <div className="relative flex-shrink-0">
              <img
                src={currentTrack.albumCover || currentTrack.coverImage}
                alt={currentTrack.title}
                className="w-12 h-12 rounded-md object-cover max-md:w-10 max-md:h-10"
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
              />
              {/* Tiny spinning vinyl behind — hidden on mobile */}
              <div
                className={`absolute -right-1.5 top-1 w-10 h-10 rounded-full -z-10 max-md:hidden ${isPlaying ? 'vinyl-spin' : 'vinyl-spin paused'}`}
                style={{
                  background: 'conic-gradient(from 0deg, #111, #1a1a1a, #111, #151515, #111)',
                  boxShadow: 'inset 0 0 0 4px #0a0a0a',
                }}
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
              </div>
            </div>
            <div className="min-w-0">
              <p
                className="text-[13px] font-medium truncate max-md:text-[12px]"
                style={{ color: 'var(--text-primary)' }}
              >
                {currentTrack.title}
              </p>
              <p className="text-[11px] truncate max-md:text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {currentTrack.albumArtist || currentTrack.artist || ''}
              </p>
            </div>
            {/* Expand chevron on mobile */}
            <svg className="w-4 h-4 flex-shrink-0 hidden max-md:block" style={{ color: 'var(--text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M5 15l7-7 7 7" />
            </svg>
          </div>

          {/* ── Center: controls + progress ── */}
          <div className="flex-1 flex flex-col items-center gap-1.5 max-md:flex-none">
            <div className="flex items-center gap-5 max-md:gap-3">
              <button
                onClick={toggleShuffle}
                className="transition-colors duration-200 max-md:hidden"
                style={{ color: shuffleMode ? 'var(--accent)' : 'var(--text-muted)' }}
              >
                <ShuffleIcon />
              </button>
              <button
                onClick={prev}
                className="transition-colors duration-200 hover:brightness-150"
                style={{ color: 'var(--text-secondary)' }}
              >
                <SkipPrevIcon />
              </button>
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 max-md:w-8 max-md:h-8"
                style={{ background: 'var(--text-primary)', color: 'var(--bg-base)' }}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button
                onClick={next}
                className="transition-colors duration-200 hover:brightness-150"
                style={{ color: 'var(--text-secondary)' }}
              >
                <SkipNextIcon />
              </button>
              <button
                onClick={toggleRepeat}
                className="relative transition-colors duration-200 max-md:hidden"
                style={{ color: repeatMode !== 'none' ? 'var(--accent)' : 'var(--text-muted)' }}
              >
                <RepeatIcon />
                {repeatMode === 'one' && (
                  <span
                    className="absolute -top-1 -right-1.5 text-[8px] font-bold"
                    style={{ color: 'var(--accent)' }}
                  >
                    1
                  </span>
                )}
              </button>
            </div>

            {/* Progress bar — hidden on mobile */}
            <div className="flex items-center gap-2.5 w-full max-w-md max-md:hidden">
              <span className="text-[10px] w-8 text-right tabular-nums" style={{ color: 'var(--text-muted)' }}>
                {formatTime(progress)}
              </span>
              <div
                className="flex-1 h-[3px] rounded-full cursor-pointer group relative"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const t = ((e.clientX - rect.left) / rect.width) * duration
                  seek(t)
                  if (audioRef.current) audioRef.current.currentTime = t
                }}
              >
                <div
                  className="h-full rounded-full transition-colors relative"
                  style={{ width: `${pct}%`, background: 'var(--text-primary)' }}
                >
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'var(--text-primary)', boxShadow: '0 0 6px rgba(240,236,228,0.3)' }}
                  />
                </div>
              </div>
              <span className="text-[10px] w-8 tabular-nums" style={{ color: 'var(--text-muted)' }}>
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* ── Right: volume — hidden on mobile ── */}
          <div className="flex items-center gap-2 w-32 justify-end flex-shrink-0 max-md:hidden">
            <VolumeIcon volume={volume} />
            <div
              className="w-20 h-[3px] rounded-full cursor-pointer group relative"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const v = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
                setVolume(v)
                if (audioRef.current) audioRef.current.volume = v
              }}
            >
              <div
                className="h-full rounded-full transition-colors"
                style={{ width: `${volume * 100}%`, background: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ── SVG Icons ── */
const PlayIcon = () => (
  <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
)
const PauseIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
)
const PlayIconLg = () => (
  <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
)
const PauseIconLg = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
)
const SkipPrevIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
  </svg>
)
const SkipNextIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
)
const ShuffleIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17zm4.76-.71 3.65 3.65-3.65 3.65L16.76 17l5-5-5-5zM7.41 20 8.83 18.59l-5.17-5.17L2.24 14.83zm3.18-3.17 5.17-5.17L14.34 10 9.17 15.17z" />
  </svg>
)
const RepeatIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 7h10v3l4-4-4-4v3H5v6h2zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2z" />
  </svg>
)
const VolumeIcon = ({ volume }) => (
  <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="currentColor" viewBox="0 0 24 24">
    {volume === 0 ? (
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
    ) : volume < 0.5 ? (
      <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
    ) : (
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    )}
  </svg>
)
