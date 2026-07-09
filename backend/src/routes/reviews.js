import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { getReviews, createReview, deleteReview } from '../controllers/reviewController.js'

const router = Router()

// GET /api/reviews/product/:productId — 公开
router.get('/product/:productId', getReviews)

// POST /api/reviews/product/:productId — 需登录
router.post('/product/:productId', authenticate, createReview)

// DELETE /api/reviews/:id — 需登录（仅本人）
router.delete('/:id', authenticate, deleteReview)

export default router
