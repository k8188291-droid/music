import { useRecent } from '../hooks/useRecent'
import TrackRow from '../components/album/TrackRow'

export default function RecentPage() {
  const { recentTracks } = useRecent()

  if (recentTracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 animate-fade-in">
        <svg className="w-16 h-16" style={{ color: 'var(--text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          近期播放
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          播放音樂後，紀錄將會顯示在這裡
        </p>
      </div>
    )
  }

  return (
    <div className="px-8 py-6 animate-fade-in">
      <h1
        className="text-3xl font-bold mb-1"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
      >
        近期播放
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        {recentTracks.length} 首歌曲
      </p>

      {/* Header */}
      <div
        className="grid gap-4 text-[10px] uppercase tracking-[0.15em] font-semibold pb-3 mb-1 px-2"
        style={{ gridTemplateColumns: '2.5rem 1fr 1fr auto 3.5rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}
      >
        <span className="text-center">#</span>
        <span>標題</span>
        <span className="hidden sm:block">專輯</span>
        <span />
        <span className="text-right">
          <svg className="w-3.5 h-3.5 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </span>
      </div>

      {recentTracks.map((track, i) => (
        <TrackRow key={`${track.id}-${i}`} track={track} index={i} queue={recentTracks} startIndex={i} />
      ))}
    </div>
  )
}
