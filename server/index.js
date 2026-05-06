import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import albumsRouter from './routes/albums.js'
import favoritesRouter from './routes/favorites.js'
import recentRouter from './routes/recent.js'
import playlistsRouter from './routes/playlists.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

const app = express()

app.use(cors({ origin: CLIENT_ORIGIN }))
app.use(express.json())

// Static assets (images, audio)
app.use('/images', express.static(join(__dirname, 'public/images')))
app.use('/audio', express.static(join(__dirname, 'public/audio')))

// API routes
app.use('/api/albums', albumsRouter)
app.use('/api/favorites', favoritesRouter)
app.use('/api/recent', recentRouter)
app.use('/api/playlists', playlistsRouter)

// 404 fallback
app.use((_req, res) => res.status(404).json({ message: 'Not found' }))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
