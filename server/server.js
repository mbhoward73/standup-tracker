import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { typeDefs } from './graphql/schema.js'
import { resolvers } from './graphql/resolvers.js'
import jwt from 'jsonwebtoken'
import { defineAbilitiesFor } from './abilities.js'
import { DateTimeTypeDefinition } from 'graphql-scalars'
import { writeAuditLogEntry } from './model/auditLog.js'

const app = express()
const httpServer = http.createServer(app)

const server = new ApolloServer({
	typeDefs: [DateTimeTypeDefinition, typeDefs],
	resolvers,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

await server.start()

app.use(
	'/standup',
	cors(),
	express.json(),
	expressMiddleware(server, {
		context: async ({ req, res, next }) => {
			if (req.body.operationName === 'Login') {
				return
			}

			const token = req.headers.authorization || ''

			if (!token) {
				return res.status(403).json({ message: 'No token provided' })
			}

			const tokenWithoutBearer = token.split(' ')[1]

			return jwt.verify(
				tokenWithoutBearer,
				process.env.JWT_SECRET,
				(err, decoded) => {
					if (err) {
						return res.status(401).json({ message: 'Invalid or expired token' })
					}

					const { userId, companyId, teamId, role } = decoded

					if (!userId || !companyId || !role) {
						throw new AuthenticationError('Unauthorized')
					}

					const userData = {
						userId,
						companyId,
						teamId,
						role
					}

					//TODO: also log graphql variables so we know what resource is being acted on
					const entry = {
						companyId: userData.companyId,
						userId: userData.userId,
						action: req.body.operationName,
						sourceIp: req.ip
					}

					//don't wait for this to return so we don't hold up request
					writeAuditLogEntry(entry)

					const ability = defineAbilitiesFor(userData)
					return { userData, ability }
				}
			)
		}
	})
)

httpServer.listen({ port: 4000 }, () => {
	console.log(`🚀 Server ready at http://localhost:4000/standup`)
})
