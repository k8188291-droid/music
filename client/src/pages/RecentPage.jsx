import { useQuery } from '@tanstack/react-query'
import { fetchAlbums } from '../api/albumApi'
import { useRecent } from '../hooks/useRecent'
import AlbumCard from '../components/album/AlbumCard'
import Spinner from '../components/ui/Spinner'

export default function RecentPage() {
  const { recentIds } = useRecent()
  const { data: albums, isLoading } = useQuery({
    queryKey: ['albums'],
    queryFn: fetchAlbums,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '70vh' }}>
        <Spinner size={48} />
      </div>
    )
  }

  const albumMap = new Map((albums ?? []).map((a) => [a.id, a]))
  const recentAlbums = recentIds.map((id) => albumMap.get(id)).filter(Boolean)

  if (recentAlbums.length === 0) {
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
        {recentAlbums.length} 張專輯
      </p>

      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        }}
      >
        {recentAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  )
}
