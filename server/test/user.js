import { expect } from 'chai'
import { describe, it } from 'mocha'
import request from 'supertest'

const GRAPHQL_URL = 'http://localhost:4000/standup'

describe('GraphQL API', () => {
	it('returns hello message', async () => {
		const query = `
        query {
            hello
        }
        `

		const res = await request(GRAPHQL_URL)
			.post('/graphql')
			.send({ query })
			.expect(200)

		expect(res.body).to.have.property('data')
		expect(res.body.data).to.deep.equal({
			hello: 'Hello world'
		})
	})
})
