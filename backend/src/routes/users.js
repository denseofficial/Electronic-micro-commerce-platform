import { Router } from 'express'
import { getAddresses, addAddress, updateAddress, deleteAddress, updateProfile } from '../controllers/userController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// 所有用户接口需要登录
router.use(authenticate)

// GET /api/users/addresses
router.get('/addresses', getAddresses)

// POST /api/users/addresses
router.post('/addresses', addAddress)

// PUT /api/users/addresses/:id
router.put('/addresses/:id', updateAddress)

// DELETE /api/users/addresses/:id
router.delete('/addresses/:id', deleteAddress)

// PUT /api/users/profile
router.put('/profile', updateProfile)

export default router
