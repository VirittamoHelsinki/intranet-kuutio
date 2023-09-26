const crypto = require('crypto')
const axios = require('axios')
const authorizeRouter = require('express').Router()
const { service_key } = require('../config')
const { requireAuthorization } = require('../middleware/authorize')

// a storage where temporary keys are mapped to tokens. Which
// are removed once the key is used or once it expires.
let tokenStorage = new Map()

// Remove expired tokens from the tokenStorage.
const pruneTokenStorage = () => {
    tokenStorage.forEach((value, key) => {
        if (value.expires < Date.now()) {
            tokenStorage.delete(key)
        }
    })
}

// Users service will send a post request to this endpoint to inform
// this service that the user has been authenticated. This service
// will then generate a key and token. The key will be sent back
// to the users service. The users service will then redirect the user
// back to this services frontend with the key as a parameter. The client
// will then send a post request to the /authorization/:key endpoint to
// get the token.
authorizeRouter.post('/', async (req, res, next) => {
    try {
        const body = req.body
        
        if (!body.email)      return res.status(400).send('email, was not provided')
        if (!body.token)      return res.status(401).send('token missing')
        if (!body.service_key) return res.status(401).send('invalid key')

        if (body.service_key !== service_key) {
            // If the key parameter was named correctly but the key itself was incorrect.
            return res.status(401).send('invalid key')
        }

        // Generate a key that is guaranteed to be unique.
        const user_key = crypto.randomUUID()

        // Store the service_token in the tokenStorage with the user_key as the key.
        tokenStorage.set(user_key, {
            token: body.token,
            expires: Date.now() + 600000 // expires in 10 minutes
        })

        // Remove expired tokens from the tokenStorage.
        pruneTokenStorage()

        // Return user_key to the users service so that it can give it to the
        // client. The client will then use the user_key to get the token from
        // the tokenStorage.
        res.json({ user_key })


    } catch (error) { next(error) }
})

// The client can get the token once they posses the user_key.
authorizeRouter.get('/:key', async (req, res, next) => {
    try {
        const key = req.params.key

        if (!tokenStorage.has(key)) return res.status(401).send('invalid key')

        if (tokenStorage.get(key).expires < Date.now()) {
            // If the key has expired.
            tokenStorage.delete(key)
            return res.status(401).send('expired key')
        }

        const token = tokenStorage.get(key).token

        // Remove the token from the tokenStorage.
        tokenStorage.delete(key)

        res.json({ token })

    } catch (error) { next(error) }
})


// All routes below this middleware require authorization.
authorizeRouter.all('*', requireAuthorization)


// A client that has a token can get their user data.
authorizeRouter.get('/', async (req, res, next) => {
    try {
        // Get user info from token.
        const user = res.locals.user

        // Get the user data from the database rather than just the token
        // if they have an entry in this apps own database, so that updates
        // to it will become visible.

        res.status(200).json(user)

    } catch (error) { next(error) }
})


module.exports = authorizeRouter