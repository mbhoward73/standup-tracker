import { GraphQLError } from 'graphql'

export function unauthorized(message = 'Unauthorized') {
	return error(message, 'UNAUTHORIZED', 401)
}

export function forbidden(message = 'Forbidden') {
	return error(message, 'FORBIDDEN', 403)
}

export function notFound(message = 'Not Found') {
	return error(message, 'NOT_FOUND', 404)
}

export function error(message, code, status) {
	throw new GraphQLError(message, {
		extensions: {
			code,
			http: { status: status }
		}
	})
}
