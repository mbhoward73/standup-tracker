import { prisma } from '../prisma/database.js'
import { forbidden } from './error.js'
import { accessibleBy } from '@casl/prisma'

//TODO: error handling
export async function getTeam(teamId, ability) {
	return prisma.team.findFirstOrThrow({
		where: {
			AND: [accessibleBy(ability).Team, { teamId }]
		},
		include: {
			company: true,
			members: true
		}
	})
}

export async function updateTeam(teamId, team, ability) {
	const { name } = team
	const existingTeam = await prisma.team.findUnique({ where: { teamId } })
	if (!ability.can('update', 'Team', existingTeam)) {
		forbidden()
	}

	return prisma.team.update({
		where: {
			teamId
		},
		data: {
			name
		},
		include: {
			company: true,
			members: true
		}
	})
}
