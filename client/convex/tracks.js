import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const create = mutation({
  args: {
    albumId: v.id('albums'),
    trackNumber: v.number(),
    title: v.string(),
    duration: v.number(),
    audioFileId: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('tracks', args)
  },
})
