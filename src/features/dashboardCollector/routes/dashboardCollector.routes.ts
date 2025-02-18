import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/routes/__root'
import Collector from '../components/Collector'
import DepositConfirmation from '../components/DepositConfirmation'


export const collectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/collector',
  component: Collector,
})

export const depositConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/deposit-confirmation',
  component: DepositConfirmation,
})

export const dashboardCollectorRoutes = [collectorRoute, depositConfirmationRoute]