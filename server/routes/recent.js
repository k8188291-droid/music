import { Router } from 'express'

const router = Router()

// In-memory store (resets on server restart)
let recentIds = []

// GET /api/recent
router.get('/', (_req, res) => {
  res.json(recentIds)
})

// POST /api/recent
router.post('/', (req, res) => {
  const { albumId } = req.body
  if (!albumId) {
    return res.status(400).json({ message: 'albumId is required' })
  }
  recentIds = [albumId, ...recentIds.filter((id) => id !== albumId)].slice(0, 50)
  res.json(recentIds)
})

export default router
