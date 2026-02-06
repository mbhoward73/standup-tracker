import { expect } from 'chai'
import { describe, it } from 'mocha'
import request from 'supertest'
import { login } from './login.js'
import { GRAPHQL_URL } from './testUtils.js'
import { getSimpleUserQuery, getUserQueryWithTaskLists } from './testUtils.js'

describe('User queries', () => {
	it('should get simple user information', async () => {
		const userData = await login('jwilson@breachrx.com')
		const { userId, token } = userData
		const query = getSimpleUserQuery()
		const variables = {
			userId
		}
		const res = await request(GRAPHQL_URL)
			.post('/standup')
			.set('Authorization', `Bearer ${token}`)
			.set('Accept', 'application/json')
			.send({ query, variables, operationName: 'User' })
			.expect(200)

		expect(res.body.data.user.firstName).to.equal('Josh')
		expect(res.body.data.user.lastName).to.equal('Wilson')
		expect(res.body.data.user.email).to.equal('jwilson@breachrx.com')
		expect(res.body.data.user.role).to.equal('DEVELOPER')
	})

	it('should get user with task lists', async () => {
		const userData = await login('jwilson@breachrx.com')
		const { userId, token } = userData
		const query = getUserQueryWithTaskLists()
		const variables = {
			userId
		}
		const res = await request(GRAPHQL_URL)
			.post('/standup')
			.set('Authorization', `Bearer ${token}`)
			.set('Accept', 'application/json')
			.send({ query, variables, operationName: 'User' })
			.expect(200)

		expect(res.body.data.user.firstName).to.equal('Josh')
		expect(res.body.data.user.lastName).to.equal('Wilson')
		expect(res.body.data.user.email).to.equal('jwilson@breachrx.com')
		expect(res.body.data.user.role).to.equal('DEVELOPER')
		expect(res.body.data.user.team.name).to.equal('Angular Devs')
		expect(res.body.data.user.taskLists.length).to.be.greaterThan(0)
		expect(res.body.data.user.taskLists[0].tasks.length).to.be.greaterThan(0)
		expect(res.body.data.user.taskLists[0].tasks[0].title).to.exist
		expect(res.body.data.user.taskLists[0].tasks[0].status).to.exist
		expect(res.body.data.user.taskLists[0].tasks[0].private).to.exist
		expect(res.body.data.user.taskLists[0].tasks[0].createdAt).to.exist
	})
})
