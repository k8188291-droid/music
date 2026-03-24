import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useTheme = create(
  persist(
    (set) => ({
      theme: 'vinyl',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'musicbox-theme' }
  )
)
