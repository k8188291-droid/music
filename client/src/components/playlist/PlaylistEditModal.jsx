import { useState, useRef, useEffect } from 'react'
import { PRESET_COVERS, PLAYLIST_COLORS, PlaylistCover } from './PlaylistCovers'

export default function PlaylistEditModal({ playlist, onSave, onClose }) {
  const isNew = !playlist
  const [name, setName] = useState(playlist?.name ?? '')
  const [color, setColor] = useState(playlist?.color ?? PLAYLIST_COLORS[0])
  const [coverId, setCoverId] = useState(playlist?.coverId ?? 'waves')
  const [coverUrl, setCoverUrl] = useState(playlist?.coverUrl ?? null)
  const fileRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setCoverUrl(ev.target.result)
      setCoverId(null)
    }
    reader.readAsDataURL(file)
  }

  function selectPreset(id) {
    setCoverId(id)
    setCoverUrl(null)
  }

  function handleSave() {
    onSave({ name: name.trim() || '未命名播放清單', color, coverId, coverUrl })
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 animate-scale-in"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            {isNew ? '新增播放清單' : '編輯播放清單'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview + Name */}
        <div className="flex items-center gap-4 mb-6">
          <PlaylistCover coverId={coverId} coverUrl={coverUrl} color={color} size={72} />
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="播放清單名稱"
              autoFocus
              className="w-full text-lg font-semibold outline-none"
              style={{
                background: 'transparent',
                color: 'var(--text-primary)',
                border: 'none',
                borderBottom: '2px solid var(--border)',
                padding: '4px 0',
                fontFamily: 'var(--font-body)',
              }}
              onFocus={(e) => { e.target.style.borderBottomColor = color }}
              onBlur={(e) => { e.target.style.borderBottomColor = 'var(--border)' }}
            />
          </div>
        </div>

        {/* Cover selection */}
        <div className="mb-5">
          <p className="text-[11px] uppercase tracking-[0.15em] font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
            封面圖案
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_COVERS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset.id)}
                className="rounded-lg overflow-hidden transition-all duration-150"
                style={{
                  border: coverId === preset.id && !coverUrl ? `2px solid ${color}` : '2px solid transparent',
                  cursor: 'pointer',
                  background: 'transparent',
                  padding: 0,
                  opacity: coverId === preset.id && !coverUrl ? 1 : 0.6,
                }}
              >
                <div style={{ width: 44, height: 44, overflow: 'hidden', borderRadius: 6 }}>
                  {preset.render(color, 44)}
                </div>
              </button>
            ))}
            {/* Upload button */}
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-lg flex items-center justify-center transition-all duration-150"
              style={{
                width: 48, height: 48,
                border: coverUrl ? `2px solid ${color}` : '2px dashed var(--border)',
                cursor: 'pointer',
                background: coverUrl ? 'transparent' : 'var(--bg-hover)',
                color: 'var(--text-muted)',
                padding: 0,
              }}
            >
              {coverUrl ? (
                <img src={coverUrl} alt="" className="w-full h-full object-cover rounded-md" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                </svg>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </div>
        </div>

        {/* Color selection */}
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.15em] font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
            顏色
          </p>
          <div className="flex flex-wrap gap-2">
            {PLAYLIST_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-full transition-all duration-150 flex items-center justify-center"
                style={{
                  background: c,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: color === c ? `0 0 0 2px var(--bg-elevated), 0 0 0 4px ${c}` : 'none',
                  transform: color === c ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {color === c && (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:brightness-110"
            style={{ background: color, color: '#000', border: 'none', cursor: 'pointer' }}
          >
            {isNew ? '建立' : '儲存'}
          </button>
        </div>
      </div>
    </div>
  )
}
