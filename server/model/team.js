import { prisma } from '../prisma/database.js'
import { forbidden, notFound } from '../error.js'
import { accessibleBy } from '@casl/prisma'
import { subject } from '@casl/ability'

export async function getTeam(teamId, companyId, ability) {
	if (!ability.can('read', subject('Team', { companyId, teamId }))) {
		forbidden()
	}

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
	if (!existingTeam) {
		notFound()
	}

	if (!ability.can('update', subject('Team', existingTeam))) {
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
