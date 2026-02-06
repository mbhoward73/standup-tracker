import { expect } from 'chai'
import { describe, it } from 'mocha'
import request from 'supertest'
import { login } from './login.js'
import { GRAPHQL_URL } from './testUtils.js'
import { getUserQueryWithTaskLists } from './testUtils.js'

describe('Task tests', () => {
	it('manager should not see hoursEstimate for tasks they do not own', async () => {
		const userData = await login('mhartley@breachrx.com')
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

		expect(res.body.data.user.taskLists.length).to.be.greaterThan(0)
		expect(res.body.data.user.taskLists[0].tasks.length).to.be.greaterThan(0)
		res.body.data.user.taskLists.forEach(taskList => {
			taskList.tasks.forEach(task => {
				if (parseInt(task.userId) !== userId) {
					expect(task.hoursEstimate).to.not.exist
				}
			})
		})
	})
	it('manager should not see any private tasks which they do not own', async () => {
		const userData = await login('mhartley@breachrx.com')
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

		expect(res.body.data.user.taskLists.length).to.be.greaterThan(0)
		expect(res.body.data.user.taskLists[0].tasks.length).to.be.greaterThan(0)
		res.body.data.user.taskLists.forEach(taskList => {
			taskList.tasks.forEach(task => {
				if (parseInt(task.userId) !== userId) {
					expect(task.private).to.not.exist
				}
			})
		})
	})
})
