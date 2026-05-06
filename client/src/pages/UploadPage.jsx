import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

const ACCENT_COLORS = [
  '#8B0000', '#1a3a5c', '#2d5a27', '#c8952a', '#4a3728',
  '#d4a843', '#808080', '#6b3fa0', '#c0392b', '#1a6b3c',
]

function readAudioDuration(file) {
  return new Promise((resolve) => {
    const audio = new Audio()
    audio.src = URL.createObjectURL(file)
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src)
      resolve(Math.round(audio.duration))
    }
    audio.onerror = () => resolve(0)
  })
}

function TrackRow({ track, index, onChange, onRemove, onAudioSelect }) {
  const fileRef = useRef(null)

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
    >
      <span
        className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full text-[11px] font-bold"
        style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}
      >
        {index + 1}
      </span>

      {/* Title */}
      <input
        type="text"
        placeholder="曲目名稱"
        value={track.title}
        onChange={(e) => onChange({ ...track, title: e.target.value })}
        className="flex-1 min-w-0 bg-transparent text-sm outline-none"
        style={{ color: 'var(--text-primary)' }}
      />

      {/* Duration */}
      <input
        type="number"
        placeholder="秒"
        min="1"
        value={track.duration || ''}
        onChange={(e) => onChange({ ...track, duration: parseInt(e.target.value, 10) || 0 })}
        className="w-16 bg-transparent text-sm outline-none text-center rounded-lg px-1 py-0.5"
        style={{
          color: 'var(--text-secondary)',
          border: '1px solid var(--border)',
        }}
        title="時長（秒）"
      />

      {/* Audio file button */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors flex-shrink-0"
        style={{
          background: track.audioFile ? 'rgba(212,160,83,0.15)' : 'var(--bg-surface)',
          color: track.audioFile ? 'var(--accent)' : 'var(--text-muted)',
          border: `1px solid ${track.audioFile ? 'var(--accent)' : 'var(--border)'}`,
        }}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
        </svg>
        {track.audioFile ? track.audioFile.name : '選擇音檔'}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          const duration = await readAudioDuration(file)
          onAudioSelect(file, duration)
        }}
      />

      <button
        type="button"
        onClick={onRemove}
        className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function UploadPage() {
  const navigate = useNavigate()
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const createAlbum = useMutation(api.albums.create)
  const createTrack = useMutation(api.tracks.create)

  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [genre, setGenre] = useState('')
  const [color, setColor] = useState(ACCENT_COLORS[0])
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [tracks, setTracks] = useState([{ title: '', duration: 0, audioFile: null }])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const coverInputRef = useRef(null)

  async function uploadFile(file) {
    const uploadUrl = await generateUploadUrl()
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    })
    if (!res.ok) throw new Error('File upload failed')
    const { storageId } = await res.json()
    return storageId
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !artist.trim()) {
      setError('請填入專輯名稱和藝術家')
      return
    }
    if (tracks.some((t) => !t.title.trim())) {
      setError('每首曲目都必須有名稱')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      let coverImageId
      if (coverFile) {
        coverImageId = await uploadFile(coverFile)
      }

      const albumId = await createAlbum({
        title: title.trim(),
        artist: artist.trim(),
        year: Number(year),
        genre: genre.trim(),
        color,
        ...(coverImageId ? { coverImageId } : {}),
      })

      for (let i = 0; i < tracks.length; i++) {
        const t = tracks[i]
        let audioFileId
        if (t.audioFile) {
          audioFileId = await uploadFile(t.audioFile)
        }
        await createTrack({
          albumId,
          trackNumber: i + 1,
          title: t.title.trim(),
          duration: t.duration || 0,
          ...(audioFileId ? { audioFileId } : {}),
        })
      }

      navigate(`/album/${albumId}`)
    } catch (err) {
      setError(err.message || '上傳失敗，請重試')
    } finally {
      setSubmitting(false)
    }
  }

  function addTrack() {
    setTracks((prev) => [...prev, { title: '', duration: 0, audioFile: null }])
  }

  function updateTrack(i, patch) {
    setTracks((prev) => prev.map((t, idx) => (idx === i ? patch : t)))
  }

  function updateTrackAudio(i, file, duration) {
    setTracks((prev) =>
      prev.map((t, idx) =>
        idx === i ? { ...t, audioFile: file, duration: duration || t.duration } : t
      )
    )
  }

  function removeTrack(i) {
    setTracks((prev) => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div className="px-8 py-8 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          新增專輯
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          建立專輯並上傳音樂檔案
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover + basic info */}
        <div className="flex gap-6">
          {/* Cover image */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="w-36 h-36 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-200 hover:opacity-80"
              style={{
                background: coverPreview ? 'transparent' : 'var(--bg-elevated)',
                border: coverPreview ? 'none' : '2px dashed var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              {coverPreview ? (
                <img src={coverPreview} alt="封面" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path strokeLinecap="round" d="m21 15-5-5L5 21" />
                  </svg>
                  <span className="text-[11px]">封面圖片</span>
                </div>
              )}
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setCoverFile(file)
                setCoverPreview(URL.createObjectURL(file))
              }}
            />
          </div>

          {/* Basic info */}
          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                專輯名稱 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="輸入專輯名稱"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)' }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)' }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                藝術家 *
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="輸入藝術家名稱"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)' }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)' }}
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  年份
                </label>
                <input
                  type="number"
                  value={year}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)' }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  曲風
                </label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="例：Pop"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Color picker */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
            主題顏色
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-7 h-7 rounded-full transition-all duration-150"
                style={{
                  background: c,
                  outline: color === c ? `2px solid var(--accent)` : '2px solid transparent',
                  outlineOffset: '2px',
                  transform: color === c ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-7 h-7 rounded-full cursor-pointer border-0 p-0"
              style={{ background: 'var(--bg-elevated)' }}
              title="自訂顏色"
            />
          </div>
        </div>

        {/* Tracks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              曲目 ({tracks.length})
            </label>
          </div>

          <div className="space-y-2 mb-3">
            {tracks.map((track, i) => (
              <TrackRow
                key={i}
                track={track}
                index={i}
                onChange={(patch) => updateTrack(i, patch)}
                onRemove={() => removeTrack(i)}
                onAudioSelect={(file, duration) => updateTrackAudio(i, file, duration)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addTrack}
            className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            style={{
              background: 'transparent',
              border: '1px dashed var(--border)',
              color: 'var(--text-muted)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
            新增曲目
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
            disabled={submitting}
          >
            取消
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: submitting ? 'rgba(212,160,83,0.4)' : 'var(--accent)',
              color: '#000',
            }}
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                上傳中…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 10l-4-4m0 0L8 10m4-4v12" />
                </svg>
                建立專輯
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
