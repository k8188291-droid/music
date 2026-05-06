import { Router } from 'express'

const router = Router()

// In-memory store (resets on server restart)
let nextId = 100
let playlists = []

// GET /api/playlists
router.get('/', (_req, res) => {
  res.json(playlists)
})

// GET /api/playlists/:id
router.get('/:id', (req, res) => {
  const pl = playlists.find((p) => p.id === req.params.id)
  if (!pl) return res.status(404).json({ message: 'Not found' })
  res.json(pl)
})

// POST /api/playlists
router.post('/', (req, res) => {
  const { name, color, coverId, coverUrl } = req.body
  const pl = {
    id: `pl_${++nextId}`,
    name: name || '未命名播放清單',
    color: color || '#d4a053',
    coverId: coverId || 'waves',
    coverUrl: coverUrl || null,
    trackIds: [],
    createdAt: Date.now(),
  }
  playlists.push(pl)
  res.status(201).json(pl)
})

// PUT /api/playlists/:id
router.put('/:id', (req, res) => {
  const { id } = req.params
  playlists = playlists.map((p) => (p.id === id ? { ...p, ...req.body } : p))
  const updated = playlists.find((p) => p.id === id)
  if (!updated) return res.status(404).json({ message: 'Not found' })
  res.json(updated)
})

// DELETE /api/playlists/:id
router.delete('/:id', (req, res) => {
  playlists = playlists.filter((p) => p.id !== req.params.id)
  res.json({ ok: true })
})

// POST /api/playlists/:id/tracks
router.post('/:id/tracks', (req, res) => {
  const { track } = req.body
  if (!track) return res.status(400).json({ message: 'track is required' })
  playlists = playlists.map((p) => {
    if (p.id !== req.params.id) return p
    if (p.trackIds.some((t) => t.id === track.id)) return p
    return { ...p, trackIds: [...p.trackIds, track] }
  })
  const updated = playlists.find((p) => p.id === req.params.id)
  if (!updated) return res.status(404).json({ message: 'Not found' })
  res.json(updated)
})

// DELETE /api/playlists/:id/tracks/:trackId
router.delete('/:id/tracks/:trackId', (req, res) => {
  playlists = playlists.map((p) =>
    p.id === req.params.id
      ? { ...p, trackIds: p.trackIds.filter((t) => t.id !== req.params.trackId) }
      : p
  )
  const updated = playlists.find((p) => p.id === req.params.id)
  if (!updated) return res.status(404).json({ message: 'Not found' })
  res.json(updated)
})

// PUT /api/playlists/:id/reorder
router.put('/:id/reorder', (req, res) => {
  const { fromIndex, toIndex } = req.body
  playlists = playlists.map((p) => {
    if (p.id !== req.params.id) return p
    const tracks = [...p.trackIds]
    const [moved] = tracks.splice(fromIndex, 1)
    tracks.splice(toIndex, 0, moved)
    return { ...p, trackIds: tracks }
  })
  const updated = playlists.find((p) => p.id === req.params.id)
  if (!updated) return res.status(404).json({ message: 'Not found' })
  res.json(updated)
})

export default router
