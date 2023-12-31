import axios from 'axios'

import { apiUrl } from '../config'
import { requestConfig } from './authorize'

const url = `${apiUrl}/booking`

const create = async object => {
    const response = await axios.post(
        url, object, requestConfig()
    )

    return response
}

const getAll = async () => {
    const response = await axios.get(
        `${url}/getbookings`, requestConfig()
    )

    return response
}

const remove = async id => {
    const response = await axios.delete(
        `${url}/${id}`, requestConfig()
    )

    return response
}

export default { create, getAll, remove }