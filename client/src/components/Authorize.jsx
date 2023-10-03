// node module imports
import { useEffect } from 'react'
import { Link } from "react-router-dom";
import Cookies from 'universal-cookie'

// file imports
import authorizeApi from '../api/authorize'
import useStore from '../store'
import { usersUrl, domain } from '../config'

import "../styles/Header.scss";

const Authorize = props => {
    const { setUser, user } = useStore()
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const user_key  = urlParams.get("user_key")

    const cookies = new Cookies()
    const kuutioToken = cookies.get('kuutioToken')

    useEffect(() => {
        loadTokenFromCookies()
        
        // If the user_key is present, exchange it for a token.
        if (user_key) getAuthorization()
        else {
            // If the user_key is not present, and the kuutioToken is not
            // present in the cookies, redirect the user to the login service.
            if (!kuutioToken) {
              window.location.href = `${usersUrl}/?domain=${domain}`
            }
        }
    }, [])

    const getAuthorization = async () => {
        try {
        
        // Exchange the user_key for a token.
        const token = await authorizeApi.getToken(user_key)
        
        // Save the token as a cookie.
        cookies.set('kuutioToken', token, {
            // Cookie expires in 3 days.
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
            path: '/',
        })

        setUser(await authorizeApi.getUser())

        window.location.href = '/'

        } catch (error) { console.log(error) }
    }

    const loadTokenFromCookies = async () => {
        if (kuutioToken) {
    
          // Initialize the user state with the token from the cookie.
          authorizeApi.setToken(kuutioToken)
    
          try {
            // Load user information from the server.
            setUser(await authorizeApi.getUser())
          
          } catch (error) {
            // If the token is invalid, remove it from the cookie.
            cookies.remove('kuutioToken')
          }
        }
    }

    const logout = async () => {
        await authorizeApi.logout()
        cookies.remove('kuutioToken')
        setUser(null)
    }

    // if (user) return (
    //   <a
    //     href="/"
    //     onClick={logout}
    //     style={props.linkStyle}
    //   >Kirjaudu ulos</a>
    // )
    
    // return (
    //   <a
    //     href={`${usersUrl}/?domain=${domain}`}
    //     style={props.linkStyle}
    //   >Kirjaudu</a>
    // )
    
    if (user) return (
      <Link
        to="/"
        onClick={logout}
        className="header-label"
      >
        Kirjaudu ulos
      </Link>
    )
    
    return (
      <Link
        to={`${usersUrl}/?domain=${domain}`}
        className="header-label"
      >Kirjaudu</Link>
    )
}

export default Authorize