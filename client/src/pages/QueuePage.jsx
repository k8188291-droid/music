import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlayer } from '../hooks/usePlayer'
import { usePlaylists } from '../hooks/usePlaylists'
import { PlaylistCover } from '../components/playlist/PlaylistCovers'
import PlaylistEditModal from '../components/playlist/PlaylistEditModal'

function formatDuration(s) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function QueuePage() {
  const { queue, currentIndex, isPlaying, playTrack, togglePlay } = usePlayer()
  const { playlists, createPlaylist, deletePlaylist } = usePlaylists()
  const [showCreate, setShowCreate] = useState(false)
  const [menuId, setMenuId] = useState(null)

  function handleCreate(data) {
    createPlaylist(data)
    setShowCreate(false)
  }

  return (
    <div className="px-8 py-6 animate-fade-in">
      {/* Title + create button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            播放清單
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            管理你的播放清單和播放佇列
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-110"
          style={{ background: 'var(--accent)', color: '#000', border: 'none', cursor: 'pointer' }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
          新增播放清單
        </button>
      </div>

      {/* User playlists grid */}
      {playlists.length > 0 && (
        <div className="mb-10">
          <p
            className="text-[11px] uppercase tracking-[0.15em] font-semibold mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            我的播放清單
          </p>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {playlists.map((pl) => (
              <div key={pl.id} className="relative group">
                <Link
                  to={`/playlist/${pl.id}`}
                  className="flex items-center gap-3.5 p-3 rounded-xl transition-all duration-200"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', textDecoration: 'none' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)' }}
                >
                  <PlaylistCover coverId={pl.coverId} coverUrl={pl.coverUrl} color={pl.color} size={52} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {pl.name}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {pl.trackIds.length} 首歌曲
                    </p>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: pl.color }}
                  />
                </Link>

                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuId(menuId === pl.id ? null : pl.id) }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="6" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="18" r="1.5" />
                  </svg>
                </button>
                {menuId === pl.id && (
                  <div
                    className="absolute top-10 right-2 z-50 rounded-lg py-1 animate-fade-in"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', minWidth: 120 }}
                  >
                    <button
                      onClick={() => { deletePlaylist(pl.id); setMenuId(null) }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[12px] transition-colors"
                      style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      刪除播放清單
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for playlists */}
      {playlists.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-12 mb-10 rounded-2xl"
          style={{ background: 'var(--bg-elevated)', border: '1px dashed var(--border)' }}
        >
          <svg className="w-12 h-12 mb-3" style={{ color: 'var(--text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
          </svg>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            還沒有播放清單
          </p>
          <p className="text-[12px] mb-4" style={{ color: 'var(--text-muted)' }}>
            建立你的第一個播放清單來整理喜歡的音樂
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:brightness-110"
            style={{ background: 'var(--accent)', color: '#000', border: 'none', cursor: 'pointer' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
            新增播放清單
          </button>
        </div>
      )}

      {/* Current queue section */}
      <div>
        <p
          className="text-[11px] uppercase tracking-[0.15em] font-semibold mb-4"
          style={{ color: 'var(--text-muted)' }}
        >
          目前播放佇列 {queue.length > 0 && `· ${queue.length} 首`}
        </p>

        {queue.length === 0 ? (
          <div className="flex items-center gap-3 py-8 justify-center" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span className="text-sm">播放音樂後，佇列將會顯示在這裡</span>
          </div>
        ) : (
          <>
            {/* Header */}
            <div
              className="grid grid-cols-[2.5rem_1fr_1fr_3.5rem] gap-4 text-[10px] uppercase tracking-[0.15em] font-semibold pb-3 mb-1"
              style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}
            >
              <span className="text-center">#</span>
              <span>標題</span>
              <span className="hidden sm:block">專輯</span>
              <span className="text-right">
                <svg className="w-3.5 h-3.5 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
            </div>

            {queue.map((track, i) => {
              const isCurrent = i === currentIndex
              return (
                <button
                  key={`${track.id}-${i}`}
                  onClick={() => {
                    if (isCurrent) togglePlay()
                    else playTrack(track, queue, i)
                  }}
                  className="w-full grid grid-cols-[2.5rem_1fr_1fr_3.5rem] gap-4 items-center px-2 py-3 rounded-lg transition-colors duration-150"
                  style={{
                    background: isCurrent ? 'var(--accent-glow)' : 'transparent',
                    color: isCurrent ? 'var(--accent)' : 'var(--text-primary)',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.background = 'var(--bg-hover)' }}
                  onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.background = 'transparent' }}
                >
                  <span className="text-center text-[13px]" style={{ color: isCurrent ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {isCurrent && isPlaying ? (
                      <span className="inline-flex items-end gap-[2px] h-3">
                        {[0, 1, 2].map((j) => (
                          <span key={j} className="sound-bar inline-block w-[3px] rounded-sm" style={{ background: 'var(--accent)', height: '100%' }} />
                        ))}
                      </span>
                    ) : (
                      i + 1
                    )}
                  </span>

                  <div className="flex items-center gap-3 min-w-0">
                    {track.albumCover && (
                      <img src={track.albumCover} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium truncate">{track.title}</p>
                      <p className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>{track.albumArtist}</p>
                    </div>
                  </div>

                  <span className="text-[12px] truncate hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
                    {track.albumTitle}
                  </span>

                  <span className="text-right text-[12px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
                    {formatDuration(track.duration)}
                  </span>
                </button>
              )
            })}
          </>
        )}
      </div>

      {/* Create modal */}
      {showCreate && (
        <PlaylistEditModal onSave={handleCreate} onClose={() => setShowCreate(false)} />
      )}
    </div>
  )
}
