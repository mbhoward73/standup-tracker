import { GraphQLError } from 'graphql'

export function notFound(message = 'Not Found') {
	return error(message, 'NOT_FOUND', 404)
}

export function forbidden(message = 'Not Authorized') {
	return error(message, 'FORBIDDEN', 403)
}

export function error(message, code, status) {
	throw new GraphQLError(message, {
		extensions: {
			code,
			http: { status: status }
		}
	})
}
