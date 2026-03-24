import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export const fetchAlbums = () => api.get('/albums').then((r) => r.data)
export const fetchAlbum = (id) => api.get(`/albums/${id}`).then((r) => r.data)

export const fetchFavorites = () => api.get('/favorites').then((r) => r.data)
export const toggleFavorite = (id) => api.post(`/favorites/${id}/toggle`).then((r) => r.data)

export const fetchRecent = () => api.get('/recent').then((r) => r.data)
export const addRecent = (id) => api.post('/recent', { albumId: id }).then((r) => r.data)
