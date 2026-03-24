// ─── helpers ────────────────────────────────────────────────────────────────

const RATIOS = ['1:1', '3:4', '16:9', '4:3']

const RATIO_DIMS = {
  '1:1':  { w: 400, h: 400 },
  '3:4':  { w: 300, h: 400 },
  '16:9': { w: 400, h: 225 },
  '4:3':  { w: 400, h: 300 },
}

const ARTISTS = [
  'The Weeknd', 'Kendrick Lamar', 'Tame Impala', 'Ed Sheeran', 'Daft Punk',
  'Fleetwood Mac', 'Frank Ocean', 'Taylor Swift', 'Billie Eilish', 'Arctic Monkeys',
  'Radiohead', 'Beyoncé', 'Tyler the Creator', 'SZA', 'Mac Miller',
  'Chance the Rapper', 'Childish Gambino', 'J. Cole', 'Drake', 'Post Malone',
  'Lana Del Rey', 'Bon Iver', 'LCD Soundsystem', 'James Blake', 'FKA twigs',
  'Vampire Weekend', 'Angel Olsen', 'Mitski', 'Japanese Breakfast', 'Soccer Mommy',
]

const ALBUM_TITLES = [
  'After Hours', 'DAMN.', 'Currents', '÷ Divide', 'Random Access Memories',
  'Rumours', 'Blonde', 'folklore', 'When We All Fall Asleep', 'AM',
  'OK Computer', 'Lemonade', 'IGOR', 'SOS', 'Swimming',
  'Coloring Book', 'Awaken My Love', 'KOD', 'Take Care', "Hollywood's Bleeding",
  'Born to Die', 'For Emma', 'Sound of Silver', 'Overgrown', 'LP1',
  'Father of the Bride', 'All Mirrors', 'Puberty 2', 'Psychopomp', 'Sometimes Forever',
  'Starboy', 'good kid m.A.A.d city', 'The Slow Rush', 'Equals', 'Discovery',
  'Tango in the Night', 'Channel Orange', 'evermore', 'Hit Me Hard and Soft', 'Humbug',
  'Kid A', 'Renaissance', 'Flower Boy', 'Ctrl', 'Circles',
  'Acid Rap', 'Camp', '2014 Forest Hills Drive', 'Nothing Was the Same', 'Beerbongs & Bentleys',
  'Norman Fucking Rockwell', 'i,i', 'American Dream', 'Before the Morning Sun', 'Magdalene',
  'This Is Happening', 'Assume Form', 'Vespertine', 'Debut', 'Ágætis byrjun',
  'Illinois', 'Carrie & Lowell', 'Turn Blue', 'El Camino', 'Brothers',
  'Dark Side of the Moon', 'Thriller', 'Purple Rain', "Sign o' the Times", 'Innervisions',
  "There's a Riot Goin' On", 'Songs in the Key of Life', 'Exile on Main St.', 'Tapestry', 'Blue',
  'Court and Spark', 'Low', 'Horses', 'Marquee Moon', 'Unknown Pleasures',
  'Closer', 'Post', 'Homogenic', 'Medúlla', 'Vulnicura',
  'Safe in the Hands of Love', 'Yeezus', 'My Beautiful Dark Twisted Fantasy', 'Graduation', '808s & Heartbreak',
  'Ultraviolence', 'Honeymoon', 'Chemtrails over the Country Club', 'Blue Banisters', 'Did You Know That There\'s a Tunnel Under Ocean Blvd',
  'Javelin', 'Rat Saw God', 'God Save the Animals', 'Dragon New Warm Mountain', 'Fetch the Bolt Cutters',
]

const GENRES = [
  'R&B', 'Hip-Hop', 'Psychedelic Pop', 'Pop', 'Electronic',
  'Soft Rock', 'Indie Folk', 'Alternative', 'Indie Rock', 'Soul',
  'Jazz', 'Dream Pop', 'Neo-Soul', 'Trap', 'Art Pop',
]

const COLORS = [
  '#8B0000', '#1a3a5c', '#2d5a27', '#c8952a', '#4a3728',
  '#d4a843', '#808080', '#1a1a2e', '#2c3e50', '#6b2d5e',
  '#1e5799', '#2980b9', '#8e44ad', '#27ae60', '#e74c3c',
]

const TRACK_NAMES = [
  'Intro', 'Neon Lights', 'Midnight Drive', 'Lost in the Echo',
  'Shallow Waters', 'Burning Sky', 'Golden Hour', 'Afterglow',
  'Phantom Limb', 'Static', 'Drift', 'Tidal Wave',
  'Interlude', 'Breathe', 'Hold On', 'Let Go',
  'Silhouette', 'Undone', 'Spiral', 'Cascade',
  'Ember', 'Fracture', 'The Crossing', 'Wavelength',
  'Hollow', 'Resonate', 'Shoreline', 'Meridian',
]

function generateTracks(albumId, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${albumId}-${i + 1}`,
    trackNumber: i + 1,
    title: TRACK_NAMES[(parseInt(albumId) * 3 + i) % TRACK_NAMES.length],
    duration: 120 + ((parseInt(albumId) * 17 + i * 31) % 240),
    audioFile: null,
  }))
}

function generateAlbums(count) {
  return Array.from({ length: count }, (_, i) => {
    const id = String(i + 1)
    const ratio = RATIOS[i % RATIOS.length]
    const { w, h } = RATIO_DIMS[ratio]
    const trackCount = 8 + (i % 10)
    return {
      id,
      title: ALBUM_TITLES[i % ALBUM_TITLES.length],
      artist: ARTISTS[i % ARTISTS.length],
      year: 1975 + (i % 50),
      genre: GENRES[i % GENRES.length],
      coverImage: `https://picsum.photos/seed/alb${id}/${w}/${h}`,
      aspectRatio: ratio,
      color: COLORS[i % COLORS.length],
      trackCount,
      tracks: generateTracks(id, trackCount),
    }
  })
}

export const albums = generateAlbums(100)
