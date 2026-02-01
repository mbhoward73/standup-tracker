import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { typeDefs } from './graphql/schema.js'
import { resolvers } from './graphql/resolvers.js'

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
		context: async ({ req }) => ({ token: req.headers.token })
	})
)

httpServer.listen({ port: 4000 }, () => {
	console.log(`🚀 Server ready at http://localhost:4000/standup`)
})
