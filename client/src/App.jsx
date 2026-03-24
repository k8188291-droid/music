import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from './pages/HomePage'
import AlbumPage from './pages/AlbumPage'
import PlayerBar from './components/layout/PlayerBar'
import Sidebar from './components/layout/Sidebar'
import SearchBar from './components/layout/SearchBar'
import ThemeFAB from './components/ui/ThemeFAB'
import { useTheme } from './hooks/useTheme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
})

function PlaceholderPage({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3 animate-fade-in">
      <h2
        className="text-3xl font-bold"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
      >
        {title}
      </h2>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
    </div>
  )
}

function AppInner() {
  const [search, setSearch] = useState('')
  const { theme } = useTheme()

  return (
    <div data-theme={theme} style={{ minHeight: '100vh' }}>
      <Sidebar />
      <SearchBar value={search} onChange={setSearch} />

      <main
        style={{
          marginLeft: 'var(--sidebar-w)',
          paddingTop: 'var(--header-h)',
          paddingBottom: 'calc(var(--player-h) + 1rem)',
          minHeight: '100vh',
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage search={search} />} />
          <Route path="/album/:id" element={<AlbumPage />} />
          <Route path="/queue" element={<PlaceholderPage title="播放清單" subtitle="你的播放佇列將在這裡顯示" />} />
          <Route path="/favorites" element={<PlaceholderPage title="我的最愛" subtitle="你收藏的專輯將在這裡顯示" />} />
          <Route path="/recent" element={<PlaceholderPage title="近期播放" subtitle="最近聆聽的紀錄" />} />
        </Routes>
      </main>

      <PlayerBar />
      <ThemeFAB />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
