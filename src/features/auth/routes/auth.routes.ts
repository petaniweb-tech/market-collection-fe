import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/routes/__root'
import LoginForm from '../components/LoginForm'
import Verify from '../components/Verify'

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginForm,
})
export const verifyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/verify',
  component: Verify,
})

export const authRoutes = [loginRoute, verifyRoute]