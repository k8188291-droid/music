import { create } from 'zustand'

export const usePlayer = create((set, get) => ({
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  shuffleMode: false,
  repeatMode: 'none', // 'none' | 'one' | 'all'

  get currentTrack() {
    const { queue, currentIndex } = get()
    return queue[currentIndex] ?? null
  },

  playTrack: (track, queue = [track], startIndex = 0) => {
    set({ queue, currentIndex: startIndex, isPlaying: true, progress: 0 })
  },

  playAlbum: (tracks, startIndex = 0) => {
    set({ queue: tracks, currentIndex: startIndex, isPlaying: true, progress: 0 })
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  next: () => {
    const { queue, currentIndex, repeatMode, shuffleMode } = get()
    if (queue.length === 0) return
    if (repeatMode === 'one') {
      set({ progress: 0, isPlaying: true })
      return
    }
    let nextIndex
    if (shuffleMode) {
      nextIndex = Math.floor(Math.random() * queue.length)
    } else {
      nextIndex = currentIndex + 1
      if (nextIndex >= queue.length) {
        if (repeatMode === 'all') nextIndex = 0
        else { set({ isPlaying: false }); return }
      }
    }
    set({ currentIndex: nextIndex, progress: 0, isPlaying: true })
  },

  prev: () => {
    const { queue, currentIndex, progress } = get()
    if (progress > 3) { set({ progress: 0 }); return }
    const prevIndex = Math.max(0, currentIndex - 1)
    set({ currentIndex: prevIndex, progress: 0, isPlaying: true })
  },

  seek: (seconds) => set({ progress: seconds }),
  setVolume: (v) => set({ volume: v }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),

  toggleShuffle: () => set((s) => ({ shuffleMode: !s.shuffleMode })),

  toggleRepeat: () =>
    set((s) => ({
      repeatMode:
        s.repeatMode === 'none' ? 'all' : s.repeatMode === 'all' ? 'one' : 'none',
    })),
}))
