import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { useQuery } from 'convex/react'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { api } from '../../convex/_generated/api'
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
const SIDEBAR_PX = 240
const H_PADDING   = 64

function calcColumns(width) {
  if (width >= 1400) return 6
  if (width >= 1100) return 5
  if (width >= 850)  return 4
  if (width >= 560)  return 3
  return 2
}

function initialWidth() {
  if (typeof window === 'undefined') return 800
  return Math.max(300, window.innerWidth - SIDEBAR_PX - H_PADDING)
}

export default function HomePageVinyl({ search = '' }) {
  const allAlbums = useQuery(api.albums.list)
  const isLoading = allAlbums === undefined

  const outerRef      = useRef(null)
  const [containerWidth, setContainerWidth] = useState(initialWidth)
  const columnsRef    = useRef(calcColumns(containerWidth))
  const virtualizerRef  = useRef(null)
  const savedIndexRef   = useRef(null)
  const prevColumnsRef  = useRef(calcColumns(containerWidth))

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

  const columns   = calcColumns(containerWidth)
  const cardWidth = (containerWidth - GAP * (columns - 1)) / columns
  columnsRef.current = columns

  const estimateSize = useCallback(
    (i) => {
      const factor = RATIO_FACTOR[albums[i]?.aspectRatio ?? '1:1'] ?? 1
      return Math.round(cardWidth * factor + INFO_HEIGHT + GAP)
    },
    [albums, cardWidth],
  )

  const virtualizer = useWindowVirtualizer({
    count: albums.length,
    lanes: columns,
    estimateSize,
    gap: GAP,
    overscan: 5,
  })
  virtualizerRef.current = virtualizer

  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    let timer = null
    const ro = new ResizeObserver(([entry]) => {
      const newW    = entry.contentRect.width
      const newCols = calcColumns(newW)
      if (newCols !== columnsRef.current && savedIndexRef.current === null) {
        const items = virtualizerRef.current?.getVirtualItems() ?? []
        if (items.length > 0) savedIndexRef.current = items[0].index
      }
      clearTimeout(timer)
      timer = setTimeout(() => setContainerWidth(newW), 200)
    })
    ro.observe(el)
    const w = el.getBoundingClientRect().width
    if (w > 0) setContainerWidth(w)
    return () => { ro.disconnect(); clearTimeout(timer) }
  }, [])

  useEffect(() => {
    if (columns === prevColumnsRef.current) return
    prevColumnsRef.current = columns
    const idx = savedIndexRef.current
    savedIndexRef.current = null
    if (idx === null) return
    requestAnimationFrame(() => {
      virtualizerRef.current?.scrollToIndex(idx, { align: 'start', behavior: 'instant' })
    })
  }, [columns])

  return (
    <div ref={outerRef} className="px-8 py-8">
      <div className="mb-8 animate-fade-in-up">
        <h1
          className="text-4xl font-bold tracking-tight mb-1"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          {search ? `搜尋「${search}」` : '探索音樂'}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {isLoading ? '載入中…' : search && albums.length === 0 ? '沒有找到相關的結果' : `${albums.length} 張專輯`}
        </p>
      </div>

      {isLoading && (
        <div className="grid gap-[18px]" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns * 3 }).map((_, i) => (
            <AlbumCardSkeleton key={i} index={i} />
          ))}
        </div>
      )}

      {!isLoading && albums.length > 0 && (
        <div style={{ position: 'relative', height: virtualizer.getTotalSize() }}>
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

      {!isLoading && search && albums.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
          <svg className="w-14 h-14 mb-4" style={{ color: 'var(--text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
          </svg>
          <p style={{ color: 'var(--text-secondary)' }}>找不到「{search}」相關的內容</p>
        </div>
      )}
    </div>
  )
}
