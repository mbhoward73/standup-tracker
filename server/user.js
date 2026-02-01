import { prisma } from '../prisma/database.js'
import { getUserTaskLists, getTeamTaskLists } from './taskList.js'

export async function getUser(userId) {
	const user = await fetchUser(userId)
	const taskLists =
		user.role === 'MANAGER'
			? await getTeamTaskLists(user.teamId)
			: await getUserTaskLists(userId)
	user.taskLists = taskLists
	return user
}

async function fetchUser(userId) {
	return prisma.user.findUnique({
		where: {
			userId: userId
		},
		include: {
			company: true,
			team: true
		}
	})
}
