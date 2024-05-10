import axios from 'axios'

import { apiUrl } from '../config'
import { requestConfig } from './authorize'

const url = `${apiUrl}/booking`

const create = async object => {
	try {
		const response = await axios.post(
			url, object, requestConfig()
		)
		return response
	}
	catch (error) {
		if (error.response) {
			throw new Error('Error creating booking');
		}
		throw error;
	}
}

const getAll = async () => {
    const response = await axios.get(
        `${url}/getbookings`, requestConfig()
    )

    return response
}

const getByDate = async date => {
    const response = await axios.get(
        `${url}/getbookings/${date}`, requestConfig()
    )

    return response
}

const remove = async id => {
    const response = await axios.delete(
        `${url}/${id}`, requestConfig()
    )

    return response
}

export default { create, getAll, remove, getByDate }