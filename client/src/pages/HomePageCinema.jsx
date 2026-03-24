import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAlbums } from '../api/albumApi'
import AlbumCardCinema from '../components/album/AlbumCardCinema'

export default function HomePageCinema({ search = '' }) {
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

  return (
    <div className="px-8 py-8">
      {/* Header */}
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

      {/* Error */}
      {isError && (
        <div className="text-center py-24">
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

      {/* Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl animate-shimmer"
              style={{ background: 'var(--bg-elevated)' }}
            />
          ))}
        </div>
      )}

      {/* Cinema grid — uniform square, CSS Grid */}
      {!isLoading && albums.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {albums.map((album, i) => (
            <div
              key={album.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${(i % 15) * 30}ms` }}
            >
              <AlbumCardCinema album={album} />
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
