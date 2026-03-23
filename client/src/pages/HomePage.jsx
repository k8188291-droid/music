import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { fetchAlbums } from '../api/albumApi'
import AlbumCard from '../components/album/AlbumCard'
import AlbumCardSkeleton from '../components/album/AlbumCardSkeleton'

const RATIO_FACTOR = {
  '1:1':  1,
  '3:4':  4 / 3,
  '16:9': 9 / 16,
  '4:3':  3 / 4,
}
const INFO_HEIGHT = 72
const GAP = 18

function useContainerWidth(ref) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [ref])
  return width
}

function useColumnCount(width) {
  if (width >= 1400) return 6
  if (width >= 1100) return 5
  if (width >= 850)  return 4
  if (width >= 560)  return 3
  return 2
}

export default function HomePage({ search = '' }) {
  const { data: allAlbums, isLoading, isError, refetch } = useQuery({
    queryKey: ['albums'],
    queryFn: fetchAlbums,
  })

  const containerRef = useRef(null)
  const containerWidth = useContainerWidth(containerRef)
  const columns = useColumnCount(containerWidth)

  const albums = useMemo(() => {
    if (!allAlbums) return []
    if (!search.trim()) return allAlbums
    const q = search.toLowerCase()
    return allAlbums.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.artist.toLowerCase().includes(q) ||
        a.genre?.toLowerCase().includes(q),
    )
  }, [allAlbums, search])

  const cardWidth = containerWidth > 0
    ? (containerWidth - GAP * (columns - 1)) / columns
    : 200

  const estimateSize = useCallback(
    (i) => {
      const ratio = albums[i]?.aspectRatio || '1:1'
      const factor = RATIO_FACTOR[ratio] ?? 1
      return Math.round(cardWidth * factor + INFO_HEIGHT + GAP)
    },
    [albums, cardWidth],
  )

  const virtualizer = useWindowVirtualizer({
    count: albums.length,
    lanes: columns,
    estimateSize,
    gap: GAP,
    overscan: 4,
  })

  return (
    <div className="px-8 py-8">
      {/* Page header */}
      <div className="mb-8 animate-fade-in-up">
        <h1
          className="text-4xl font-bold tracking-tight mb-1"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          {search ? `搜尋「${search}」` : '探索音樂'}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {isLoading
            ? '載入中…'
            : search && albums.length === 0
              ? '沒有找到相關的結果'
              : `${albums.length} 張專輯`
          }
        </p>
      </div>

      {/* Error state */}
      {isError && (
        <div className="text-center py-24 animate-fade-in">
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>載入失敗</p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2 rounded-full text-sm font-medium transition-colors"
            style={{ background: 'var(--accent)', color: '#000' }}
          >
            重試
          </button>
        </div>
      )}

      {/* Loading skeleton grid */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[18px]">
          {Array.from({ length: 15 }).map((_, i) => (
            <AlbumCardSkeleton key={i} index={i} />
          ))}
        </div>
      )}

      {/* Virtual masonry grid */}
      {!isLoading && albums.length > 0 && (
        <div
          ref={containerRef}
          style={{ position: 'relative', height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((item) => (
            <div
              key={item.key}
              data-index={item.index}
              ref={virtualizer.measureElement}
              className="animate-fade-in-up"
              style={{
                position: 'absolute',
                top: item.start,
                left: item.lane * (cardWidth + GAP),
                width: cardWidth,
                animationDelay: `${(item.index % 12) * 40}ms`,
              }}
            >
              <AlbumCard album={albums[item.index]} />
            </div>
          ))}
        </div>
      )}

      {/* Empty search results */}
      {!isLoading && !isError && search && albums.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
          <svg
            className="w-16 h-16 mb-4"
            style={{ color: 'var(--text-muted)' }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="m21 21-4.35-4.35" />
          </svg>
          <p style={{ color: 'var(--text-secondary)' }}>
            找不到「{search}」相關的內容
          </p>
        </div>
      )}
    </div>
  )
}
