import { create } from 'zustand'
import { persist } from 'zustand/middleware'

let _nextId = Date.now()
function uid() {
  return 'pl_' + (++_nextId).toString(36)
}

export const usePlaylists = create(
  persist(
    (set, get) => ({
      playlists: [],

      createPlaylist: ({ name, color, coverId, coverUrl }) => {
        const id = uid()
        set((s) => ({
          playlists: [
            ...s.playlists,
            {
              id,
              name: name || '未命名播放清單',
              color: color || '#d4a053',
              coverId: coverId || 'waves',
              coverUrl: coverUrl || null,
              trackIds: [],
              createdAt: Date.now(),
            },
          ],
        }))
        return id
      },

      updatePlaylist: (id, updates) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deletePlaylist: (id) =>
        set((s) => ({
          playlists: s.playlists.filter((p) => p.id !== id),
        })),

      addTrack: (playlistId, track) =>
        set((s) => ({
          playlists: s.playlists.map((p) => {
            if (p.id !== playlistId) return p
            if (p.trackIds.some((t) => t.id === track.id)) return p
            return { ...p, trackIds: [...p.trackIds, track] }
          }),
        })),

      removeTrack: (playlistId, trackId) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId
              ? { ...p, trackIds: p.trackIds.filter((t) => t.id !== trackId) }
              : p
          ),
        })),

      reorderTracks: (playlistId, fromIndex, toIndex) =>
        set((s) => ({
          playlists: s.playlists.map((p) => {
            if (p.id !== playlistId) return p
            const tracks = [...p.trackIds]
            const [moved] = tracks.splice(fromIndex, 1)
            tracks.splice(toIndex, 0, moved)
            return { ...p, trackIds: tracks }
          }),
        })),

      getPlaylist: (id) => get().playlists.find((p) => p.id === id) ?? null,
    }),
    { name: 'musicbox-playlists' }
  )
)
