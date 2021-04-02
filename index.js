'use strict'

// Docs at: https://firebase.google.com/docs/reference/rest/auth

const axios = require('axios')
const debug = require('debug')('firebase-auth')

const signUpEndpoint = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp'
const signInEndpoint = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword'
const refreshTokenEndpoint = 'https://securetoken.googleapis.com/v1/token'
const authEndpointApiKeyQueryParam = 'key'

function mapAuthResponse(response) {
	return {
		idToken      : response.idToken,
		refreshToken : response.refreshToken,
		expiresIn    : response.expiresIn,
		uid: response.localId
	}
}

module.exports = ({ apiKey }) => {

	async function signInWithEmailAndPassword({ email = '', password = '' }) {
		let result

		try {
			result = await axios.post(`${signInEndpoint}?${authEndpointApiKeyQueryParam}=${apiKey}`, {
				email,
				password,
				returnSecureToken: true
			}, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			if (error.response.data.error && error.response.data.error.message === 'EMAIL_NOT_FOUND') {
				throw new Error(`User with email ${email} does not exist`)
			}
		
			if (error.response.data.error && error.response.data.error.message === 'INVALID_PASSWORD') {
				throw new Error(`Password for user with email ${email} is not valid`)
			}

			throw new Error(error.message)
		}
		
	
		return mapAuthResponse(result.data)
	}
	

	async function signUpWithEmailAndPassword({ email = '', password = '' }) {
		debug(`signUpWithEmailAndPassword with email ${email}`)

		let result

		try {
			result = await axios.post(`${signUpEndpoint}?${authEndpointApiKeyQueryParam}=${apiKey}`, {
				email,
				password,
				returnSecureToken: true
			}, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
		} catch (error) {
			if (error.response.data.error && error.response.data.error.message === 'EMAIL_EXISTS') {
				throw new Error(`User with email ${email} already exist`)
			}

			throw new Error(error.message)
		}
	
		debug('Result signUpWithEmailAndPassword: ', result.data)
	
		return mapAuthResponse(result.data)
	}
	

	async function refreshIdToken(refreshToken = '') {
		const params = new URLSearchParams() 
		params.append('grant_type', 'refresh_token')
		params.append('refresh_token', refreshToken)

		let response

		try {
			response = await axios.post(`${refreshTokenEndpoint}?${authEndpointApiKeyQueryParam}=${apiKey}`, params, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			})
		} catch (error) {
			throw new Error(error.message)
		}

		const json = response.data

		return {
			idToken      : json.access_token,
			refreshToken : json.refresh_token
		}
	}
	
	return {
		signInWithEmailAndPassword,
		signUpWithEmailAndPassword,
		refreshIdToken
	}
}