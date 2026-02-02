import { prisma } from '../prisma/database.js'
import { getUserTaskLists, getTeamTaskLists } from './taskList.js'
import { GraphQLError } from 'graphql'

export async function getUser(userId) {
	const user = await fetchUser(userId)
	if (!user) {
		throw new GraphQLError('User not found', {
			extensions: {
				code: 'NOT_FOUND',
				http: { status: 404 }
			}
		})
	}
	const taskLists =
		user.role === 'MANAGER'
			? await getTeamTaskLists(user.teamId)
			: await getUserTaskLists(userId)
	user.taskLists = taskLists
	console.log(`returning user ${JSON.stringify(user)}`)
	return user
}

export async function getUserByEmail(email) {
	return prisma.user.findUnique({
		where: {
			email
		},
		include: {
			company: true,
			team: true
		}
	})
}

async function fetchUser(userId) {
	return prisma.user.findUnique({
		where: {
			userId
		},
		include: {
			company: true,
			team: true
		}
	})
}
