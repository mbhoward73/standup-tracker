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

const app = express()
const httpServer = http.createServer(app)

const server = new ApolloServer({
	typeDefs,
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
			console.log(`expressMiddleware operation name: ${req.body.operationName}`)
			if (req.body.operationName === 'Login') {
				console.log(`received Login so skipping auth check`)
				return
			}

			console.log('fetching token')
			const token = req.headers.authorization || ''
			console.log(`token is ${token}`)

			if (!token) {
				console.log('did not find token')
				return res.status(403).json({ message: 'No token provided' })
			}

			const tokenWithoutBearer = token.split(' ')[1]
			console.log(`token without bearer: ${tokenWithoutBearer}`)
			console.log(`JWT_SECRET is ${process.env.JWT_SECRET}`)

			return jwt.verify(
				tokenWithoutBearer,
				process.env.JWT_SECRET,
				(err, decoded) => {
					console.log(`inside jwt.verify`)
					if (err) {
						return res.status(401).json({ message: 'Invalid or expired token' })
					}

					console.log(`decoded token: ${JSON.stringify(decoded)}`)
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

					console.log(`userData: ${JSON.stringify(userData)}`)
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
