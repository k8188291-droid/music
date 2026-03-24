import { useTheme } from '../hooks/useTheme'
import HomePageVinyl from './HomePageVinyl'
import HomePageCinema from './HomePageCinema'
import HomePageArchive from './HomePageArchive'

export default function HomePage({ search }) {
  const { theme } = useTheme()
  if (theme === 'cinema') return <HomePageCinema search={search} />
  if (theme === 'archive') return <HomePageArchive search={search} />
  return <HomePageVinyl search={search} />
}
