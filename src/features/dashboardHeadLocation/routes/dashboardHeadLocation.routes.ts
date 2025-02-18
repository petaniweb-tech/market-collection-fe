import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/routes/__root'
import HeadLocation from '../components/HeadLocation'


export const headLocationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/head-location',
  component: HeadLocation,
})


export const dashboardHeadLocationRoutes = [headLocationRoute]