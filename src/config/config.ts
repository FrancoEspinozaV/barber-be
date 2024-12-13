import * as dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT || 3000
export const MONGO_URI = process.env.MONGO_URI || ''
export const RESEND_API_KEY = process.env.API_KEY_RESEND || ''
export const JWT_SECRET = process.env.JWT_SECRET || 'SecretToken'
