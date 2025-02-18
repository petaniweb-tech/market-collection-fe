import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/routes/__root'
import LoginForm from '../components/LoginForm'

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginForm,
})

export const authRoutes = [loginRoute]