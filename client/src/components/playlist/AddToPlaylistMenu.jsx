import { useState, useEffect, useRef } from 'react'
import { usePlaylists } from '../../hooks/usePlaylists'
import { PlaylistCover } from './PlaylistCovers'
import PlaylistEditModal from './PlaylistEditModal'

export default function AddToPlaylistMenu({ tracks, onClose }) {
  const { playlists, addTrack, createPlaylist } = usePlaylists()
  const [showCreate, setShowCreate] = useState(false)
  const [added, setAdded] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    if (showCreate) return
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose, showCreate])

  function handleAdd(playlistId) {
    tracks.forEach((track) => addTrack(playlistId, track))
    setAdded(playlistId)
    setTimeout(() => onClose(), 600)
  }

  function handleCreateAndAdd(data) {
    const newId = createPlaylist(data)
    tracks.forEach((track) => addTrack(newId, track))
    setShowCreate(false)
    setAdded(newId)
    setTimeout(() => onClose(), 600)
  }

  if (showCreate) {
    return (
      <PlaylistEditModal
        onSave={handleCreateAndAdd}
        onClose={() => setShowCreate(false)}
      />
    )
  }

  return (
    <div
      ref={ref}
      className="rounded-xl py-2 animate-fade-in-up"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
        minWidth: 220,
        maxHeight: 320,
        overflowY: 'auto',
        animationDuration: '150ms',
      }}
    >
      <p className="px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: 'var(--text-muted)' }}>
        加入播放清單 ({tracks.length} 首)
      </p>

      {playlists.map((pl) => (
        <button
          key={pl.id}
          onClick={() => handleAdd(pl.id)}
          className="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors"
          style={{
            background: added === pl.id ? `${pl.color}22` : 'transparent',
            color: added === pl.id ? pl.color : 'var(--text-primary)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
          }}
          onMouseEnter={(e) => { if (added !== pl.id) e.currentTarget.style.background = 'var(--bg-hover)' }}
          onMouseLeave={(e) => { if (added !== pl.id) e.currentTarget.style.background = 'transparent' }}
        >
          <PlaylistCover coverId={pl.coverId} coverUrl={pl.coverUrl} color={pl.color} size={32} />
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium text-[13px]">{pl.name}</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{pl.trackIds.length} 首</p>
          </div>
          {added === pl.id && (
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      ))}

      {/* Create new */}
      <div style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4 }}>
        <button
          onClick={() => setShowCreate(true)}
          className="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors"
          style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', fontSize: '13px' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: 'var(--bg-hover)', border: '1px dashed var(--border)' }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <span className="font-medium">新增播放清單</span>
        </button>
      </div>
    </div>
  )
}
