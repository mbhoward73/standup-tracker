import { expect } from 'chai'
import { describe, it } from 'mocha'
import request from 'supertest'
import { login } from './login.js'
import { GRAPHQL_URL } from './testUtils.js'
import { getAuditLogQuery } from './testUtils.js'

describe('Audit Log tests', () => {
	it('Manager should not be able to see audit logs', async () => {
		const userData = await login('mhartley@breachrx.com')
		const { userId, token } = userData
		const query = getAuditLogQuery()
		const res = await request(GRAPHQL_URL)
			.post('/standup')
			.set('Authorization', `Bearer ${token}`)
			.set('Accept', 'application/json')
			.send({ query, operationName: 'AuditLog' })
			.expect(403)

		expect(res.body.data).to.not.exist
		expect(res.body.errors.length).to.be.greaterThan(0)
		expect(res.body.errors[0].message).to.equal('Forbidden')
	})
	it('Company Admin should be able to see audit logs', async () => {
		const userData = await login('alunsford@breachrx.com')
		const { userId, token } = userData
		const query = getAuditLogQuery()
		const res = await request(GRAPHQL_URL)
			.post('/standup')
			.set('Authorization', `Bearer ${token}`)
			.set('Accept', 'application/json')
			.send({ query, operationName: 'AuditLog' })
			.expect(200)

		expect(res.body.data.auditLog).to.exist
	})
})
