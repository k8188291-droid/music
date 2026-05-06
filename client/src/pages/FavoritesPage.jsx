import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useFavorites } from '../hooks/useFavorites'
import AlbumCard from '../components/album/AlbumCard'
import Spinner from '../components/ui/Spinner'

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites()
  const albums = useQuery(api.albums.list)
  const isLoading = albums === undefined

  if (isLoading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '70vh' }}>
        <Spinner size={48} />
      </div>
    )
  }

  const favoriteAlbums = (albums ?? []).filter((a) => favoriteIds.includes(a.id))

  if (favoriteAlbums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 animate-fade-in">
        <svg className="w-16 h-16" style={{ color: 'var(--text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          我的最愛
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          點擊專輯頁面的愛心按鈕來收藏
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
        我的最愛
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        {favoriteAlbums.length} 張專輯
      </p>

      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
      >
        {favoriteAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  )
}
