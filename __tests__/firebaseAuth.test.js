'use strict'

const firebaseAuth = require('../index')({})
const axios = require('axios')
jest.mock('axios')

afterAll(() => {
	axios.mockReset()
})

test('[signInWithEmailAndPassword] - signIt should throw an error if the account does not exist', async () => {
	axios.post.mockRejectedValueOnce({
		response: {
			data: {
				error: {
					code    : 400,
					message : 'INVALID_PASSWORD',
					errors  : [
						{
							message : 'INVALID_PASSWORD',
							domain  : 'global',
							reason  : 'invalid',
						},
					],
				},
			},
		}
	})

	await expect(
		firebaseAuth.signInWithEmailAndPassword({
			email    : 'test@test.com',
			password : '123',
		})
	).rejects.toMatchInlineSnapshot(
		'[Error: Password for user with email test@test.com is not valid]'
	)
})

test('[signInWithEmailAndPassword] - It should throw an error if the account password is wrong', async () => {
	axios.post.mockRejectedValueOnce({
		response: {
			data: {
				error: {
					code    : 400,
					message : 'EMAIL_NOT_FOUND',
					errors  : [
						{
							message : 'EMAIL_NOT_FOUND',
							domain  : 'global',
							reason  : 'invalid',
						},
					],
				},
			},
		}
	})

	await expect(
		firebaseAuth.signInWithEmailAndPassword({
			email    : 'test@test.com',
			password : '123',
		})
	).rejects.toMatchInlineSnapshot(
		'[Error: User with email test@test.com does not exist]'
	)
})

test('[signUpWithEmailAndPassword] - It should throw an error if an account with the same email already exists', async () => {
	axios.post.mockRejectedValueOnce({
		response: {
			data: {
				error: {
					code    : 400,
					message : 'EMAIL_EXISTS',
					errors  : [
						{
							message : 'EMAIL_EXISTS',
							domain  : 'global',
							reason  : 'invalid',
						},
					],
				},
			},
		}
	})

	await expect(
		firebaseAuth.signUpWithEmailAndPassword({
			email    : 'test@test.com',
			password : '123',
		})
	).rejects.toMatchInlineSnapshot('[Error: User with email test@test.com already exist]')
})