import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export const fetchAlbums = () => api.get('/albums').then((r) => r.data)
export const fetchAlbum = (id) => api.get(`/albums/${id}`).then((r) => r.data)
