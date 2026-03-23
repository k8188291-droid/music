import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { fetchAlbums } from '../api/albumApi'
import AlbumCard from '../components/album/AlbumCard'
import AlbumCardSkeleton from '../components/album/AlbumCardSkeleton'

// Aspect ratio → card height estimate (image + info bar)
const RATIO_ESTIMATE = {
  '1:1':  (w) => w + 60,
  '3:4':  (w) => w * (4 / 3) + 60,
  '16:9': (w) => w * (9 / 16) + 60,
  '4:3':  (w) => w * (3 / 4) + 60,
}

const GAP = 16

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
  if (width >= 800)  return 4
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
      return Math.round((RATIO_ESTIMATE[ratio] ?? RATIO_ESTIMATE['1:1'])(cardWidth))
    },
    [albums, cardWidth],
  )

  const virtualizer = useWindowVirtualizer({
    count: albums.length,
    lanes: columns,
    estimateSize,
    gap: GAP,
    overscan: 3,
  })

  const totalHeight = virtualizer.getTotalSize()

  return (
    <div className="px-6 py-8">
      <h1 className="text-white text-3xl font-bold mb-1">我的音樂收藏</h1>
      <p className="text-white/40 text-sm mb-6">
        {isLoading ? '載入中…' : `${albums.length} 張專輯`}
      </p>

      {isError && (
        <div className="text-center py-20">
          <p className="text-white/50 mb-4">載入失敗</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-white/90"
          >
            重試
          </button>
        </div>
      )}

      {!isError && search && albums.length === 0 && (
        <p className="text-white/40 text-sm mt-20 text-center">
          找不到「{search}」相關的專輯
        </p>
      )}

      {/* Skeleton grid while loading */}
      {isLoading && (
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <AlbumCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Virtual masonry grid */}
      {!isLoading && albums.length > 0 && (
        <div ref={containerRef} style={{ position: 'relative', height: totalHeight }}>
          {virtualizer.getVirtualItems().map((item) => (
            <div
              key={item.key}
              data-index={item.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: item.start,
                left: item.lane * (cardWidth + GAP),
                width: cardWidth,
              }}
            >
              <AlbumCard album={albums[item.index]} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
