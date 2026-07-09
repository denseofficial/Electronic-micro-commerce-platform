import { Router } from 'express'
import authRoutes from './auth.js'
import productRoutes from './products.js'
import orderRoutes from './orders.js'
import userRoutes from './users.js'
import { getCategories } from '../controllers/productController.js'

const router = Router()

// GET /api/categories
router.get('/categories', getCategories)

// /api/auth/*
router.use('/auth', authRoutes)

// /api/products/*
router.use('/products', productRoutes)

// /api/orders/*
router.use('/orders', orderRoutes)

// /api/users/*
router.use('/users', userRoutes)

export default router
