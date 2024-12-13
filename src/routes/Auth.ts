// src/routes/barberRoutes.ts
import { Router } from 'express'
import { endpointRoute } from './endpointRoute'
import {
  login,
  logout,
  register,
  verifyEmail,
  forgetToken,
} from '../controllers/Auth'

const router: Router = Router()

router.get(endpointRoute.auth.logout.relative, logout)
router.post(endpointRoute.auth.login.relative, login)
router.post(endpointRoute.auth.register.relative, register)
router.get(endpointRoute.auth.verifyEmail.relative, verifyEmail)
router.post(endpointRoute.auth.generateLink.relative, forgetToken)
export default router
