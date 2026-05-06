import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async (ctx) => {
    const albums = await ctx.db.query('albums').order('asc').collect()
    return Promise.all(
      albums.map(async (album) => {
        const trackCount = await ctx.db
          .query('tracks')
          .withIndex('by_album', (q) => q.eq('albumId', album._id))
          .collect()
          .then((t) => t.length)
        const coverImage = album.coverImageId
          ? await ctx.storage.getUrl(album.coverImageId)
          : (album.coverImageUrl ?? null)
        return {
          ...album,
          id: album._id,
          coverImage,
          trackCount,
        }
      })
    )
  },
})

export const get = query({
  args: { id: v.id('albums') },
  handler: async (ctx, args) => {
    const album = await ctx.db.get(args.id)
    if (!album) return null

    const tracks = await ctx.db
      .query('tracks')
      .withIndex('by_album', (q) => q.eq('albumId', args.id))
      .collect()

    const coverImage = album.coverImageId
      ? await ctx.storage.getUrl(album.coverImageId)
      : (album.coverImageUrl ?? null)

    const tracksWithUrls = await Promise.all(
      tracks.map(async (track) => ({
        ...track,
        id: track._id,
        audioFile: track.audioFileId
          ? await ctx.storage.getUrl(track.audioFileId)
          : (track.audioFileUrl ?? null),
      }))
    )

    return {
      ...album,
      id: album._id,
      coverImage,
      tracks: tracksWithUrls.sort((a, b) => a.trackNumber - b.trackNumber),
    }
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    artist: v.string(),
    year: v.number(),
    genre: v.string(),
    coverImageId: v.optional(v.id('_storage')),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('albums', args)
  },
})

export const remove = mutation({
  args: { id: v.id('albums') },
  handler: async (ctx, args) => {
    const tracks = await ctx.db
      .query('tracks')
      .withIndex('by_album', (q) => q.eq('albumId', args.id))
      .collect()
    for (const track of tracks) {
      if (track.audioFileId) await ctx.storage.delete(track.audioFileId)
      await ctx.db.delete(track._id)
    }
    const album = await ctx.db.get(args.id)
    if (album?.coverImageId) await ctx.storage.delete(album.coverImageId)
    await ctx.db.delete(args.id)
  },
})
