import { prisma } from '../prisma/database.js'

export async function getTeam(teamId) {
	return prisma.team.findUniqueOrThrow({
		where: {
			teamId
		},
		include: {
			company: true,
			members: true
		}
	})
}
