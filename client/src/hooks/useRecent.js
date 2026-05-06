import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_RECENT = 50

export const useRecent = create(
  persist(
    (set) => ({
      recentTracks: [],

      addRecent: (track) =>
        set((s) => {
          const filtered = s.recentTracks.filter((t) => t.id !== track.id)
          return { recentTracks: [track, ...filtered].slice(0, MAX_RECENT) }
        }),
    }),
    { name: 'musicbox-recent' }
  )
)
