import { http, HttpResponse, delay } from 'msw'
import { albums } from './data'

const BASE = '/api'

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
]
