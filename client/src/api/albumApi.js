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

export const fetchPlaylists = () => api.get('/playlists').then((r) => r.data)
export const fetchPlaylist = (id) => api.get(`/playlists/${id}`).then((r) => r.data)
export const createPlaylist = (data) => api.post('/playlists', data).then((r) => r.data)
export const updatePlaylist = (id, data) => api.put(`/playlists/${id}`, data).then((r) => r.data)
export const deletePlaylist = (id) => api.delete(`/playlists/${id}`).then((r) => r.data)
export const addTrackToPlaylist = (id, track) => api.post(`/playlists/${id}/tracks`, { track }).then((r) => r.data)
export const removeTrackFromPlaylist = (id, trackId) => api.delete(`/playlists/${id}/tracks/${trackId}`).then((r) => r.data)
export const reorderPlaylistTracks = (id, fromIndex, toIndex) => api.put(`/playlists/${id}/reorder`, { fromIndex, toIndex }).then((r) => r.data)
