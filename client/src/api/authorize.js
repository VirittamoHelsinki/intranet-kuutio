import axios from 'axios'

import { apiUrl, usersUrl } from '../config'

const url = `${apiUrl}/authorize`
let token = ''

// Two use cases:
// 1. Set token when we get it from the backend with a key.
// 2. Set the token from a cookie when the user loads the page.
const setToken = (newToken) => {
    token = `bearer ${newToken}`
}

const requestConfig = (object) => {
    const headers = { 'Authorization': token }
    
      if (!object) return { headers }
    
      return {
        headers,
        data: object
      }
}

// Get token from the backend using the key.
const getToken = async (key) => {
    const response = await axios.get(`${url}/${key}`)

    setToken(response.data.token)

    return response.data.token
}

// get the user saved into the token.
const getUser = async () => {
    const response = await axios.get(
        `${usersUrl}/api/authorize`, requestConfig()
    )

    return response.data
}

const logout = async () => {
    const response = await axios.get(
        `${usersUrl}/api/authorize/logout`, requestConfig()
    )

    setToken('')

    return response
}

export default { setToken, requestConfig, getToken, getUser, logout }