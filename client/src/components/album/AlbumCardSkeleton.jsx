export default function AlbumCardSkeleton() {
  return (
    <div className="break-inside-avoid mb-4 rounded-lg overflow-hidden bg-white/5 animate-pulse">
      <div className="w-full aspect-square bg-white/10" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
      </div>
    </div>
  )
}
