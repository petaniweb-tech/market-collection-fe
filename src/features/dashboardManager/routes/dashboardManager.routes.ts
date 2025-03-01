import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/routes/__root'
import HeadLocation from '../components/HeadLocation'


export const managerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manajer',
  component: HeadLocation,
})


export const dashboardManagerRoutes = [managerRoute]