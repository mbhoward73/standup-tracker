import { GraphQLScalarType, Kind } from 'graphql'

export const dateScalar = new GraphQLScalarType({
	name: 'Date',
	description: 'Date custom scalar type',
	serialize(value) {
		//value sent TO the client
		if (value instanceof Date) {
			return value.toISOString().slice(0, 10)
		}
		throw Error('GraphQL Date Scalar serializer expected a `Date` object')
	},
	parseValue(value) {
		//value sent FROM the client
		const datePattern = /^\d{4}\d{2}-\d{2}$/
		if (typeof value === 'string' && datePattern.test(value)) {
			return new Date(value)
		}
		throw Error(
			'GraphQL Date Scalar parseValue expected a string with format yyyy-mm-dd'
		)
	},
	parseLiteral(ast) {
		if (ast.kind === Kind.INT) {
			// Convert hard-coded AST string to integer and then to Date
			return new Date(parseInt(ast.value, 10))
		}
		return null
	}
})
