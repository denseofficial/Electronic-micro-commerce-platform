import { Router } from 'express'
import { register, login, getUserInfo } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// POST /api/auth/register
router.post('/register', register)

// POST /api/auth/login
router.post('/login', login)

// GET /api/auth/me
router.get('/me', authenticate, getUserInfo)

export default router
