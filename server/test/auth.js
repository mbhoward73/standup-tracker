import { expect } from 'chai'
import { describe, it } from 'mocha'
import request from 'supertest'
import { GRAPHQL_URL } from './testUtils.js'
import { getSimpleUserQuery } from './testUtils.js'

describe('Auth tests', () => {
	it('should return 403 if no token is passed', async () => {
		const query = getSimpleUserQuery()
		const variables = {
			userId: '42'
		}
		const res = await request(GRAPHQL_URL)
			.post('/standup')
			.set('Accept', 'application/json')
			.send({ query, variables, operationName: 'User' })
			.expect(403)

		expect(res.body).to.have.property('message')
		expect(res.body.message).to.deep.equal('No token provided')
	})
	it('should return 401 if invalid token is passed', async () => {
		const query = getSimpleUserQuery()
		const variables = {
			userId: '42'
		}
		const res = await request(GRAPHQL_URL)
			.post('/standup')
			.set('Accept', 'application/json')
			.set('Authorization', 'Bearer test-token')
			.send({ query, variables, operationName: 'User' })
			.expect(401)

		expect(res.body).to.have.property('message')
		expect(res.body.message).to.deep.equal('Invalid or expired token')
	})
})
