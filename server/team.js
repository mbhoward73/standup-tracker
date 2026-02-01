import { prisma } from '../prisma/database.js'

export async function getTeam(teamId) {
	return prisma.team.findUniqueOrThrow({
		where: {
			teamId: parseInt(teamId)
		},
		include: {
			members: true
		}
	})
}
