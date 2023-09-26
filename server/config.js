import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT
const mongoUri = process.env.MONGODB_URI

const service_key = process.env.SERVICE_KEY
const users_url = process.env.USERS_URL

export { PORT, mongoUri, service_key, users_url }