import { ApolloServer } from 'apollo-server'
import { typeDefs } from './graphql/schema.js'
import { resolvers } from './graphql/resolvers.js'

const port = 9090

const server = new ApolloServer({ resolvers, typeDefs })

server.listen({ port }, () =>
	console.log(`Server runs at: http://localhost:${port}`)
)
