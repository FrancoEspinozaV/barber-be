import { Router } from 'express'
import barberRoutes from './BarberRoutes'

const router: Router = Router()

router.use('/api/barbers', barberRoutes)

export default router
