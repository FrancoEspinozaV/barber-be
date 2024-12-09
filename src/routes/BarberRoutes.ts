// src/routes/barberRoutes.ts
import { Router } from 'express'
import { createBarber, getBarbers } from '../controllers/BarberController'

const router: Router = Router()

router.post('/', createBarber)
router.get('/', getBarbers)

export default router
