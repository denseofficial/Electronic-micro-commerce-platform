import 'dotenv/config'

export default {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'ec_mall_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
}
