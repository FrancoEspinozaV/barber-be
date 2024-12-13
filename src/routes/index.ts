import { Router } from 'express'
import barberRoutes from './BarberRoutes'
import { endpointRoute } from './endpointRoute'
import authRoutes from './Auth'

const router: Router = Router()

router.use(endpointRoute.barber.base, barberRoutes)
router.use(endpointRoute.auth.base, authRoutes)

export default router
