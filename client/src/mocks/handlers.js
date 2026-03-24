import { http, HttpResponse, delay } from 'msw'
import { albums } from './data'

const BASE = '/api'

// In-memory mock state
let favoriteIds = albums.slice(0, 5).map((a) => a.id)
let recentIds = albums.slice(0, 10).map((a) => a.id)

export const handlers = [
  // GET /api/albums — list without tracks
  http.get(`${BASE}/albums`, async () => {
    await delay(400)
    const list = albums.map(({ tracks, ...rest }) => ({
      ...rest,
      trackCount: tracks.length,
    }))
    return HttpResponse.json(list)
  }),

  // GET /api/albums/:id — single album with tracks
  http.get(`${BASE}/albums/:id`, async ({ params }) => {
    await delay(300)
    const album = albums.find((a) => a.id === params.id)
    if (!album) {
      return HttpResponse.json({ message: 'Album not found' }, { status: 404 })
    }
    return HttpResponse.json(album)
  }),

  // GET /api/favorites — list favorite album IDs
  http.get(`${BASE}/favorites`, async () => {
    await delay(200)
    return HttpResponse.json(favoriteIds)
  }),

  // POST /api/favorites/:id/toggle — toggle favorite
  http.post(`${BASE}/favorites/:id/toggle`, async ({ params }) => {
    await delay(150)
    const { id } = params
    if (favoriteIds.includes(id)) {
      favoriteIds = favoriteIds.filter((fid) => fid !== id)
      return HttpResponse.json({ favorited: false, id })
    } else {
      favoriteIds.push(id)
      return HttpResponse.json({ favorited: true, id })
    }
  }),

  // GET /api/recent — list recent album IDs
  http.get(`${BASE}/recent`, async () => {
    await delay(200)
    return HttpResponse.json(recentIds)
  }),

  // POST /api/recent — add to recent
  http.post(`${BASE}/recent`, async ({ request }) => {
    await delay(150)
    const { albumId } = await request.json()
    recentIds = [albumId, ...recentIds.filter((id) => id !== albumId)].slice(0, 50)
    return HttpResponse.json(recentIds)
  }),
]
