const axios = require('axios')
const { users_url } = require('../config')

// Ask authorization from the users service.
const requireAuthorization = async (req, res, next) => {
    try {
      const token = req.get('authorization')

      if(!token) return res.status(401).send('token missing')
      
      const response = await axios.get(
        `${users_url}/api/authorize`,
  
        {},
        { headers: { 'Authorization': token }}
      )

      if (response.status !== 200) {
        return res.status(401).send('Authorization failed in the users service.')
      }

      // Save user data included in the token to res.locals.
      res.locals.user = {
        email: response.data.email,
        admin: response.data.admin,
        access: response.data.access
      }
  
      next()
  
    } catch (exception) { next(exception) }
  }

module.exports = {
  requireAuthorization
}