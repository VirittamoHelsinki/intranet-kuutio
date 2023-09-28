import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT
const mongoUri = process.env.MONGODB_URI

const users_url = process.env.USERS_URL

const service_name = process.env.SERVICE_NAME
const service_key = process.env.SERVICE_KEY

export { PORT, mongoUri, users_url, service_name, service_key }