import { prisma } from '../prisma/database.js'
import { getUserTaskLists, getTeamTaskLists } from './taskList.js'
import { notFound } from './error.js'
import { accessibleBy } from '@casl/prisma'
import { subject } from '@casl/ability'

export async function getUser(companyId, userId, ability) {
	const user = await fetchUser(userId, ability)
	if (!user) {
		notFound('User not found')
	}
	const taskLists =
		user.role === 'MANAGER'
			? await getTeamTaskLists(companyId, user.teamId, ability)
			: await getUserTaskLists(companyId, userId, user.teamId, ability)
	user.taskLists = taskLists
	console.log(`returning user ${JSON.stringify(user)}`)
	return user
}

//no authorization check here since it is used during login when we don't know user context
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

async function fetchUser(userId, ability) {
	return prisma.user.findFirst({
		where: {
			AND: [accessibleBy(ability).User, { userId: userId }]
		},
		include: {
			company: true,
			team: true
		}
	})
}
