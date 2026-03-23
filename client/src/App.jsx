import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from './pages/HomePage'
import AlbumPage from './pages/AlbumPage'
import PlayerBar from './components/layout/PlayerBar'
import Sidebar from './components/layout/Sidebar'
import SearchBar from './components/layout/SearchBar'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
})

function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center h-96 text-white/30 text-xl">
      {title}
    </div>
  )
}

export default function App() {
  const [search, setSearch] = useState('')

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Sidebar />
        <SearchBar value={search} onChange={setSearch} />

        {/* offset: sidebar (ml-52) + header (pt-16) + player (pb-24) */}
        <main className="ml-52 pt-16 pb-24 min-h-screen bg-[#121212] text-white">
          <Routes>
            <Route path="/" element={<HomePage search={search} />} />
            <Route path="/album/:id" element={<AlbumPage />} />
            <Route path="/queue" element={<PlaceholderPage title="當前播放清單" />} />
            <Route path="/favorites" element={<PlaceholderPage title="我的最愛" />} />
            <Route path="/recent" element={<PlaceholderPage title="近期播放" />} />
          </Routes>
        </main>

        <PlayerBar />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
