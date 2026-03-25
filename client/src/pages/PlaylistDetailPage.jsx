import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePlaylists } from '../hooks/usePlaylists'
import { usePlayer } from '../hooks/usePlayer'
import { PlaylistCover } from '../components/playlist/PlaylistCovers'
import PlaylistEditModal from '../components/playlist/PlaylistEditModal'

function formatDuration(s) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function totalDuration(tracks) {
  const secs = tracks.reduce((sum, t) => sum + t.duration, 0)
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  return h > 0 ? `${h} 小時 ${m} 分鐘` : `${m} 分鐘`
}

export default function PlaylistDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPlaylist, updatePlaylist, removeTrack, reorderTracks, deletePlaylist } = usePlaylists()
  const { playTrack, currentTrack, isPlaying, togglePlay, playAlbum } = usePlayer()
  const [showEdit, setShowEdit] = useState(false)
  const [dragIndex, setDragIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const dragRef = useRef(null)

  const playlist = getPlaylist(id)

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 animate-fade-in">
        <p style={{ color: 'var(--text-secondary)' }}>找不到該播放清單</p>
        <button
          onClick={() => navigate('/queue')}
          className="text-sm underline underline-offset-4 transition-colors"
          style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          返回播放清單
        </button>
      </div>
    )
  }

  const tracks = playlist.trackIds

  function handleEditSave(data) {
    updatePlaylist(id, data)
    setShowEdit(false)
  }

  function handleDelete() {
    deletePlaylist(id)
    navigate('/queue')
  }

  function handlePlayAll() {
    if (tracks.length === 0) return
    playAlbum(tracks, 0)
  }

  // Drag & drop reorder
  function handleDragStart(i) {
    setDragIndex(i)
    dragRef.current = i
  }

  function handleDragOver(e, i) {
    e.preventDefault()
    setDragOverIndex(i)
  }

  function handleDrop(i) {
    if (dragRef.current !== null && dragRef.current !== i) {
      reorderTracks(id, dragRef.current, i)
    }
    setDragIndex(null)
    setDragOverIndex(null)
    dragRef.current = null
  }

  function handleDragEnd() {
    setDragIndex(null)
    setDragOverIndex(null)
    dragRef.current = null
  }

  // Move track up/down with buttons
  function moveUp(i) {
    if (i > 0) reorderTracks(id, i, i - 1)
  }
  function moveDown(i) {
    if (i < tracks.length - 1) reorderTracks(id, i, i + 1)
  }

  return (
    <div className="pb-12 animate-fade-in">
      {/* Hero header */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${playlist.color}33 0%, transparent 60%)` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-base))' }}
        />

        <div className="relative px-8 pt-10 pb-8">
          {/* Back button */}
          <button
            onClick={() => navigate('/queue')}
            className="flex items-center gap-2 mb-8 transition-all duration-200 group"
            style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 group-hover:scale-105"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </span>
            <span className="text-[13px] font-medium">播放清單</span>
          </button>

          <div className="flex gap-8 items-end">
            {/* Cover */}
            <div className="flex-shrink-0 animate-scale-in">
              <PlaylistCover
                coverId={playlist.coverId}
                coverUrl={playlist.coverUrl}
                color={playlist.color}
                size={200}
              />
            </div>

            {/* Info */}
            <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <p
                className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-2"
                style={{ color: playlist.color }}
              >
                播放清單
              </p>
              <h1
                className="text-4xl font-bold leading-tight mb-4"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                {playlist.name}
              </h1>
              <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full text-[12px]"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              >
                <span>{tracks.length} 首歌曲</span>
                {tracks.length > 0 && (
                  <>
                    <span style={{ color: 'var(--border)' }}>|</span>
                    <span>{totalDuration(tracks)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="px-8 py-5 flex items-center gap-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
        {/* Play all */}
        <button
          onClick={handlePlayAll}
          disabled={tracks.length === 0}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 hover:brightness-110 disabled:opacity-40"
          style={{ background: playlist.color, color: '#000', border: 'none', cursor: tracks.length > 0 ? 'pointer' : 'default', boxShadow: `0 8px 24px ${playlist.color}33` }}
        >
          <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        {/* Edit */}
        <button
          onClick={() => setShowEdit(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer' }}
          title="編輯播放清單"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer' }}
          title="刪除播放清單"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Track list */}
      {tracks.length === 0 ? (
        <div className="mx-8 flex flex-col items-center justify-center py-16 rounded-2xl"
          style={{ background: 'var(--bg-elevated)', border: '1px dashed var(--border)' }}
        >
          <svg className="w-12 h-12 mb-3" style={{ color: 'var(--text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            播放清單是空的
          </p>
          <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
            在專輯頁面將歌曲加入此播放清單
          </p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div
            className="mx-8 mb-1 grid gap-4 text-[10px] uppercase tracking-[0.15em] font-semibold pb-3"
            style={{
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border)',
              gridTemplateColumns: '2rem 2.5rem 1fr 1fr 3.5rem 5rem',
            }}
          >
            <span />
            <span className="text-center">#</span>
            <span>標題</span>
            <span className="hidden sm:block">專輯</span>
            <span className="text-right">
              <svg className="w-3.5 h-3.5 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            <span className="text-center">操作</span>
          </div>

          {/* Tracks */}
          <div className="mx-4">
            {tracks.map((track, i) => {
              const isCurrent = currentTrack?.id === track.id
              const isDragging = dragIndex === i
              const isDragOver = dragOverIndex === i

              return (
                <div
                  key={`${track.id}-${i}`}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDrop={() => handleDrop(i)}
                  onDragEnd={handleDragEnd}
                  className="grid gap-4 items-center px-4 py-3 rounded-lg transition-all duration-150 group"
                  style={{
                    gridTemplateColumns: '2rem 2.5rem 1fr 1fr 3.5rem 5rem',
                    background: isCurrent ? 'var(--accent-glow)' : isDragOver ? 'var(--bg-hover)' : 'transparent',
                    opacity: isDragging ? 0.4 : 1,
                    borderTop: isDragOver && dragIndex > i ? `2px solid ${playlist.color}` : '2px solid transparent',
                    borderBottom: isDragOver && dragIndex < i ? `2px solid ${playlist.color}` : '2px solid transparent',
                    cursor: 'grab',
                  }}
                  onMouseEnter={(e) => { if (!isCurrent && !isDragOver) e.currentTarget.style.background = 'var(--bg-hover)' }}
                  onMouseLeave={(e) => { if (!isCurrent && !isDragOver) e.currentTarget.style.background = 'transparent' }}
                >
                  {/* Drag handle */}
                  <span className="flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
                    <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="9" cy="6" r="1.5" />
                      <circle cx="15" cy="6" r="1.5" />
                      <circle cx="9" cy="12" r="1.5" />
                      <circle cx="15" cy="12" r="1.5" />
                      <circle cx="9" cy="18" r="1.5" />
                      <circle cx="15" cy="18" r="1.5" />
                    </svg>
                  </span>

                  {/* Number */}
                  <span
                    className="text-center text-[13px] cursor-pointer"
                    style={{ color: isCurrent ? playlist.color : 'var(--text-muted)' }}
                    onClick={() => {
                      if (isCurrent) togglePlay()
                      else playTrack(track, tracks, i)
                    }}
                  >
                    {isCurrent && isPlaying ? (
                      <span className="inline-flex items-end gap-[2px] h-3">
                        {[0, 1, 2].map((j) => (
                          <span key={j} className="sound-bar inline-block w-[3px] rounded-sm" style={{ background: playlist.color, height: '100%' }} />
                        ))}
                      </span>
                    ) : (
                      i + 1
                    )}
                  </span>

                  {/* Title + artist */}
                  <div
                    className="flex items-center gap-3 min-w-0 cursor-pointer"
                    onClick={() => {
                      if (isCurrent) togglePlay()
                      else playTrack(track, tracks, i)
                    }}
                  >
                    {track.albumCover && (
                      <img src={track.albumCover} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium truncate" style={{ color: isCurrent ? playlist.color : 'var(--text-primary)' }}>
                        {track.title}
                      </p>
                      <p className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                        {track.albumArtist}
                      </p>
                    </div>
                  </div>

                  {/* Album */}
                  <span className="text-[12px] truncate hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
                    {track.albumTitle}
                  </span>

                  {/* Duration */}
                  <span className="text-right text-[12px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
                    {formatDuration(track.duration)}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => moveUp(i)}
                      disabled={i === 0}
                      className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-20"
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: i === 0 ? 'default' : 'pointer' }}
                      title="上移"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveDown(i)}
                      disabled={i === tracks.length - 1}
                      className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-20"
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: i === tracks.length - 1 ? 'default' : 'pointer' }}
                      title="下移"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeTrack(id, track.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      title="移除"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Edit modal */}
      {showEdit && (
        <PlaylistEditModal
          playlist={playlist}
          onSave={handleEditSave}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  )
}
