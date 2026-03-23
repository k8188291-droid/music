import { Router } from 'express'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_PATH = join(__dirname, '../data/albums.json')

function loadAlbums() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
}

const router = Router()

// GET /api/albums — list without tracks
router.get('/', (_req, res) => {
  const albums = loadAlbums()
  const list = albums.map(({ tracks, ...rest }) => ({
    ...rest,
    trackCount: tracks.length,
  }))
  res.json(list)
})

// GET /api/albums/:id — single album with tracks
router.get('/:id', (req, res) => {
  const albums = loadAlbums()
  const album = albums.find((a) => a.id === req.params.id)
  if (!album) {
    return res.status(404).json({ message: 'Album not found' })
  }
  res.json(album)
})

export default router
