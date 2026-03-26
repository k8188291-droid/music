import { http, HttpResponse, delay } from 'msw'
import { albums } from './data'

const BASE = '/api'

// In-memory mock state
let favoriteIds = albums.slice(0, 5).map((a) => a.id)
let recentTracks = albums.slice(0, 10).flatMap((a) =>
  a.tracks.slice(0, 1).map((t) => ({
    ...t,
    albumCover: a.coverImage,
    albumTitle: a.title,
    albumArtist: a.artist,
  }))
)
let nextPlId = 100
let playlists = [
  {
    id: 'pl_demo1',
    name: '放鬆時光',
    color: '#3ecfcf',
    coverId: 'waves',
    coverUrl: null,
    trackIds: albums.slice(0, 3).flatMap((a) =>
      a.tracks.slice(0, 3).map((t) => ({
        ...t,
        albumCover: a.coverImage,
        albumTitle: a.title,
        albumArtist: a.artist,
      }))
    ),
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'pl_demo2',
    name: '運動歌單',
    color: '#e85d4a',
    coverId: 'star',
    coverUrl: null,
    trackIds: albums.slice(5, 8).flatMap((a) =>
      a.tracks.slice(0, 2).map((t) => ({
        ...t,
        albumCover: a.coverImage,
        albumTitle: a.title,
        albumArtist: a.artist,
      }))
    ),
    createdAt: Date.now() - 43200000,
  },
]

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

  // GET /api/recent — list recent tracks
  http.get(`${BASE}/recent`, async () => {
    await delay(200)
    return HttpResponse.json(recentTracks)
  }),

  // POST /api/recent — add track to recent
  http.post(`${BASE}/recent`, async ({ request }) => {
    await delay(150)
    const { track } = await request.json()
    recentTracks = [track, ...recentTracks.filter((t) => t.id !== track.id)].slice(0, 50)
    return HttpResponse.json(recentTracks)
  }),

  // ── Playlists ──────────────────────────────────────────────────

  // GET /api/playlists
  http.get(`${BASE}/playlists`, async () => {
    await delay(200)
    return HttpResponse.json(playlists)
  }),

  // GET /api/playlists/:id
  http.get(`${BASE}/playlists/:id`, async ({ params }) => {
    await delay(200)
    const pl = playlists.find((p) => p.id === params.id)
    if (!pl) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(pl)
  }),

  // POST /api/playlists — create
  http.post(`${BASE}/playlists`, async ({ request }) => {
    await delay(200)
    const body = await request.json()
    const pl = { id: `pl_${++nextPlId}`, trackIds: [], createdAt: Date.now(), ...body }
    playlists.push(pl)
    return HttpResponse.json(pl, { status: 201 })
  }),

  // PUT /api/playlists/:id — update
  http.put(`${BASE}/playlists/:id`, async ({ params, request }) => {
    await delay(200)
    const body = await request.json()
    playlists = playlists.map((p) => (p.id === params.id ? { ...p, ...body } : p))
    const updated = playlists.find((p) => p.id === params.id)
    return HttpResponse.json(updated)
  }),

  // DELETE /api/playlists/:id
  http.delete(`${BASE}/playlists/:id`, async ({ params }) => {
    await delay(150)
    playlists = playlists.filter((p) => p.id !== params.id)
    return HttpResponse.json({ ok: true })
  }),

  // POST /api/playlists/:id/tracks — add track
  http.post(`${BASE}/playlists/:id/tracks`, async ({ params, request }) => {
    await delay(150)
    const { track } = await request.json()
    playlists = playlists.map((p) => {
      if (p.id !== params.id) return p
      if (p.trackIds.some((t) => t.id === track.id)) return p
      return { ...p, trackIds: [...p.trackIds, track] }
    })
    return HttpResponse.json(playlists.find((p) => p.id === params.id))
  }),

  // DELETE /api/playlists/:id/tracks/:trackId — remove track
  http.delete(`${BASE}/playlists/:id/tracks/:trackId`, async ({ params }) => {
    await delay(150)
    playlists = playlists.map((p) =>
      p.id === params.id
        ? { ...p, trackIds: p.trackIds.filter((t) => t.id !== params.trackId) }
        : p
    )
    return HttpResponse.json(playlists.find((p) => p.id === params.id))
  }),

  // PUT /api/playlists/:id/reorder — reorder tracks
  http.put(`${BASE}/playlists/:id/reorder`, async ({ params, request }) => {
    await delay(150)
    const { fromIndex, toIndex } = await request.json()
    playlists = playlists.map((p) => {
      if (p.id !== params.id) return p
      const tracks = [...p.trackIds]
      const [moved] = tracks.splice(fromIndex, 1)
      tracks.splice(toIndex, 0, moved)
      return { ...p, trackIds: tracks }
    })
    return HttpResponse.json(playlists.find((p) => p.id === params.id))
  }),
]
