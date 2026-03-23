import { useQuery } from '@tanstack/react-query'
import { fetchAlbums } from '../api/albumApi'
import AlbumCard from '../components/album/AlbumCard'
import AlbumCardSkeleton from '../components/album/AlbumCardSkeleton'

export default function HomePage() {
  const { data: albums, isLoading, isError, refetch } = useQuery({
    queryKey: ['albums'],
    queryFn: fetchAlbums,
  })

  return (
    <div className="px-6 py-8">
      <h1 className="text-white text-3xl font-bold mb-6">我的音樂收藏</h1>

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

      <div
        className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4"
      >
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => <AlbumCardSkeleton key={i} />)
          : albums?.map((album) => <AlbumCard key={album.id} album={album} />)}
      </div>
    </div>
  )
}
