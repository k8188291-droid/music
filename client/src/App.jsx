import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AlbumPage from './pages/AlbumPage'
import QueuePage from './pages/QueuePage'
import PlaylistDetailPage from './pages/PlaylistDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import RecentPage from './pages/RecentPage'
import UploadPage from './pages/UploadPage'
import PlayerBar from './components/layout/PlayerBar'
import Sidebar from './components/layout/Sidebar'
import SearchBar from './components/layout/SearchBar'

function AppInner() {
  const [search, setSearch] = useState('')

  return (
    <div style={{ minHeight: '100vh' }}>
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
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/recent" element={<RecentPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </main>

      <PlayerBar />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
