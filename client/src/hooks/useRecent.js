import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_RECENT = 50

export const useRecent = create(
  persist(
    (set) => ({
      recentIds: [],

      addRecent: (albumId) =>
        set((s) => {
          const filtered = s.recentIds.filter((id) => id !== albumId)
          return { recentIds: [albumId, ...filtered].slice(0, MAX_RECENT) }
        }),
    }),
    { name: 'musicbox-recent' }
  )
)
