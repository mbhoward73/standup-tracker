import request from 'supertest'
import { GRAPHQL_URL } from './testUtils.js'
import { jwtDecode } from 'jwt-decode'
import { expect } from 'chai'
import { getLoginMutation } from './testUtils.js'

//TODO: just for demo purposes
const PASSWORDS = {
	'jwilson@breachrx.com': 'josh',
	'sridzik@breachrx.com': 'steve',
	'mhartley@breachrx.com': 'matt',
	'alunsford@breachrx.com': 'andy'
}

describe('Login tests', () => {
	it('should login successfully', async () => {
		const mutation = getLoginMutation()
		const variables = {
			email: 'jwilson@breachrx.com',
			password: 'josh'
		}
		const res = await request(GRAPHQL_URL)
			.post('/standup')
			.set('Accept', 'application/json')
			.send({ query: mutation, variables, operationName: 'Login' })
			.expect(200)

		expect(res.body.data.login).to.exist
	})
	it('should return 403 if password is incorrect', async () => {
		const mutation = getLoginMutation()
		const variables = {
			email: 'jwilson@breachrx.com',
			password: 'angular'
		}
		const res = await request(GRAPHQL_URL)
			.post('/standup')
			.set('Accept', 'application/json')
			.send({ query: mutation, variables, operationName: 'Login' })
			.expect(401)

		expect(res.body.data).to.not.exist
		expect(res.body.errors.length).to.be.greaterThan(0)
		expect(res.body.errors[0].message).to.equal('Unauthorized')
	})
})

export async function login(email, password) {
	const mutation = getLoginMutation()
	const variables = {
		email,
		password: PASSWORDS[email]
	}
	const res = await request(GRAPHQL_URL)
		.post('/standup')
		.set('Accept', 'application/json')
		.send({ query: mutation, variables, operationName: 'Login' })
		.expect(200)

	const token = res.body.data.login
	const decodedToken = jwtDecode(token)
	return { token, ...decodedToken }
}

