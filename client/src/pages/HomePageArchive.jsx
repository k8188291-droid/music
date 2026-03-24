import { useMemo, useRef, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { fetchAlbums } from '../api/albumApi'
import AlbumListRow from '../components/album/AlbumListRow'

const ROW_H = 72

export default function HomePageArchive({ search = '' }) {
  const { data: allAlbums, isLoading, isError, refetch } = useQuery({
    queryKey: ['albums'],
    queryFn: fetchAlbums,
  })

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

  const virtualizer = useWindowVirtualizer({
    count: albums.length,
    estimateSize: () => ROW_H,
    overscan: 10,
  })

  return (
    <div className="py-6">
      {/* Header */}
      <div className="px-8 mb-6 animate-fade-in-up">
        <h1
          className="text-4xl font-bold tracking-tight mb-1"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          {search ? `搜尋「${search}」` : '專輯庫'}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {isLoading ? '載入中…' : `${albums.length} 張專輯`}
        </p>
      </div>

      {/* Error */}
      {isError && (
        <div className="text-center py-24 px-8">
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>載入失敗</p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2 rounded-full text-sm font-medium"
            style={{ background: 'var(--accent)', color: '#000' }}
          >
            重試
          </button>
        </div>
      )}

      {/* Table header */}
      {!isLoading && albums.length > 0 && (
        <>
          <div
            className="flex items-center gap-4 px-6 pb-3 mb-1"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div className="w-8 text-center text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>#</div>
            <div className="w-11 flex-shrink-0" />
            <div className="flex-1 text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>標題</div>
            <div className="hidden sm:block w-[80px] text-center text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>風格</div>
            <div className="hidden md:block w-12 text-right text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>年份</div>
            <div className="w-14 text-right text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>曲目</div>
          </div>

          {/* Virtual list */}
          <div style={{ position: 'relative', height: virtualizer.getTotalSize() }}>
            {virtualizer.getVirtualItems().map((item) => (
              <AlbumListRow
                key={item.key}
                album={albums[item.index]}
                index={item.index}
                style={{
                  position: 'absolute',
                  top: item.start,
                  left: 0,
                  right: 0,
                  height: ROW_H,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Skeleton */}
      {isLoading && (
        <div className="px-6 space-y-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 h-[72px]">
              <div className="w-8" />
              <div className="w-11 h-11 rounded flex-shrink-0 animate-shimmer" style={{ background: 'var(--bg-elevated)' }} />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 rounded animate-shimmer" style={{ background: 'var(--bg-elevated)' }} />
                <div className="h-2.5 w-1/4 rounded animate-shimmer" style={{ background: 'var(--bg-elevated)' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && search && albums.length === 0 && (
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
