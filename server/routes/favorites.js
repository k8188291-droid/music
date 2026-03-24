import { Router } from 'express'

const router = Router()

// In-memory store (resets on server restart)
let favoriteIds = []

// GET /api/favorites
router.get('/', (_req, res) => {
  res.json(favoriteIds)
})

// POST /api/favorites/:id/toggle
router.post('/:id/toggle', (req, res) => {
  const { id } = req.params
  if (favoriteIds.includes(id)) {
    favoriteIds = favoriteIds.filter((fid) => fid !== id)
    res.json({ favorited: false, id })
  } else {
    favoriteIds.push(id)
    res.json({ favorited: true, id })
  }
})

export default router
