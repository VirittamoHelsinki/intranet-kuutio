import dotenv from 'dotenv'
dotenv.config()

const environment = process.env.NODE_ENV
const PORT = process.env.PORT

let mongoUri = process.env.MONGODB_URI_DEV
let users_url = process.env.USERS_URL_DEV
let service_name = process.env.SERVICE_NAME_DEV
let service_key = process.env.SERVICE_KEY_DEV

if (environment === 'production'){
    mongoUri = process.env.MONGODB_URI_PROD
    users_url = process.env.USERS_URL_PROD
    service_name = process.env.SERVICE_NAME_PROD
    service_key = process.env.SERVICE_KEY_PROD
}

export { environment, PORT, mongoUri, users_url, service_name, service_key }