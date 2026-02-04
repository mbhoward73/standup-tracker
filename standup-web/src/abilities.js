//TODO: this file is duplicated from server as a temporary shortcut
//TODO: need to replace with a call to server to fetch these abilities upon login
import { AbilityBuilder } from '@casl/ability'
import { createPrismaAbility } from '@casl/prisma'

export function defineAbilitiesFor(user) {
	console.log(`defining abilities for user ${JSON.stringify(user)}`)
	const { can, cannot, build } = new AbilityBuilder(createPrismaAbility)

	switch (user.role) {
		case 'ADMIN': {
			can('manage', 'all')
			break
		}
		case 'COMPANY_ADMIN': {
			can('manage', 'all', { companyId: user.companyId })
			break
		}
		case 'MANAGER': {
			can('read', 'Company', { companyId: user.companyId })
			can('read', 'User', { companyId: user.companyId })
			can('update', 'User', { companyId: user.companyId, userId: user.userId })
			can('read', 'Team', { companyId: user.companyId })
			can('update', 'Team', {
				companyId: user.companyId,
				members: { $in: [user.userId] }
			})
			can(['create', 'update'], 'TaskList', {
				companyId: user.companyId,
				userId: user.userId
			})
			can('read', 'TaskList', {
				companyId: user.companyId,
				teamId: user.teamId
			})
			can(['create', 'update', 'read', 'delete'], 'Task', {
				companyId: user.companyId,
				userId: user.userId
			})
			can(
				'read',
				'Task',
				[
					'title',
					'notes',
					'status',
					'taskId',
					'companyId',
					'taskListId',
					'userId',
					'teamId'
				],
				{
					companyId: user.companyId,
					userId: {
						not: user.userId
					},
					teamId: user.teamId,
					private: false
				}
			)
			break
		}
		case 'DEVELOPER': {
			can('read', 'Company', { companyId: user.companyId })
			can('read', 'User', { companyId: user.companyId })
			can('update', 'User', { companyId: user.companyId, userId: user.userId })
			can('read', 'Team', { companyId: user.companyId })
			can('manage', 'TaskList', {
				companyId: user.companyId,
				userId: user.userId
			})
			can('manage', 'Task', {
				companyId: user.companyId,
				userId: user.userId
			})
			break
		}
		default:
			throw new Error(`unrecognized role ${user.role}`)
	}
	return build()
}
