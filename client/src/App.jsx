import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from './pages/HomePage'
import AlbumPage from './pages/AlbumPage'
import PlayerBar from './components/layout/PlayerBar'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-[#121212] text-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/album/:id" element={<AlbumPage />} />
          </Routes>
          <PlayerBar />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
