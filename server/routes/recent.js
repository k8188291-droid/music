import { Router } from 'express'

const router = Router()

// In-memory store (resets on server restart)
let recentTracks = []

// GET /api/recent
router.get('/', (_req, res) => {
  res.json(recentTracks)
})

// POST /api/recent
router.post('/', (req, res) => {
  const { track } = req.body
  if (!track) {
    return res.status(400).json({ message: 'track is required' })
  }
  recentTracks = [track, ...recentTracks.filter((t) => t.id !== track.id)].slice(0, 50)
  res.json(recentTracks)
})

export default router
