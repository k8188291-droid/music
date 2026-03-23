const RATIOS = ['aspect-square', 'aspect-[3/4]', 'aspect-video', 'aspect-[4/3]']

export default function AlbumCardSkeleton({ index = 0 }) {
  const aspectClass = RATIOS[index % RATIOS.length]

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
      <div className={`${aspectClass} animate-shimmer`} style={{ background: 'var(--bg-hover)' }} />
      <div className="px-3.5 py-3 space-y-2">
        <div className="h-3 rounded-full w-3/4 animate-shimmer" style={{ background: 'var(--bg-hover)' }} />
        <div className="h-2.5 rounded-full w-1/2 animate-shimmer" style={{ background: 'var(--bg-hover)' }} />
      </div>
    </div>
  )
}
