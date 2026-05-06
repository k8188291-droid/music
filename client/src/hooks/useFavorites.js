import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavorites = create(
  persist(
    (set, get) => ({
      favoriteIds: [],

      toggleFavorite: (albumId) =>
        set((s) => {
          const exists = s.favoriteIds.includes(albumId)
          return {
            favoriteIds: exists
              ? s.favoriteIds.filter((id) => id !== albumId)
              : [...s.favoriteIds, albumId],
          }
        }),

      isFavorite: (albumId) => get().favoriteIds.includes(albumId),
    }),
    { name: 'musicbox-favorites' }
  )
)
