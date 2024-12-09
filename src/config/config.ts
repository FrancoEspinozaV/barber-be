import * as dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT
export const MONGO_URI = process.env.MONGO_URI
export const RESEND_API_KEY = process.env.RESEND_API_KEY
