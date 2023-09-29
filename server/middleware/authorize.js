import axios from 'axios'
import { users_url, service_name } from '../config'

// // Ask authorization from the users service.
// const requireAuthorization = async (req, res, next) => {
//     try {
//       const token = req.get('authorization')

//       if(!token) return res.status(401).send('token missing')
      
//       const response = await axios.get(
//         `${users_url}/api/authorize`,
  
//         {},
//         { headers: { 'Authorization': token }}
//       )

//       if (response.status !== 200) {
//         return res.status(401).send('Authorization failed in the users service.')
//       }

//       // Save user data included in the token to res.locals.
//       res.locals.user = {
//         email: response.data.email,
//         admin: response.data.admin,
//         access: response.data.access
//       }
  
//       next()
  
//     } catch (exception) { next(exception) }
//   }

// Ask authorization from the users service.
// A function that returns an authorization middleware function.
// level: access level required to access the route.
const requireAuthorization = level => {
  return async (req, res, next) => {
    try {
      const token = req.get('authorization')

      if(!token) return res.status(401).send('token missing')
    
      const response = await axios.get(
        `${users_url}/api/authorize/service/${service_name}/${level}`,

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
}

export { requireAuthorization }