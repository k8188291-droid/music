import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  albums: defineTable({
    title: v.string(),
    artist: v.string(),
    year: v.number(),
    genre: v.string(),
    coverImageId: v.optional(v.id('_storage')),
    coverImageUrl: v.optional(v.string()),
    color: v.string(),
  }),
  tracks: defineTable({
    albumId: v.id('albums'),
    trackNumber: v.number(),
    title: v.string(),
    duration: v.number(),
    audioFileId: v.optional(v.id('_storage')),
    audioFileUrl: v.optional(v.string()),
  }).index('by_album', ['albumId']),
})
