import { prisma } from '../prisma/database.js'
import { forbidden } from '../error.js'
import { accessibleBy } from '@casl/prisma'
import { subject } from '@casl/ability'

export async function getAuditLog(companyId, ability) {
	if (!ability.can('read', subject('AuditLog', { companyId }))) {
		forbidden()
	}

	return prisma.auditLog.findMany({
		where: {
			AND: [
				accessibleBy(ability).AuditLog,
				{
					companyId
				}
			]
		},
		take: 100,
		orderBy: [
			{
				timestamp: 'desc'
			}
		],
		include: {
			company: true,
			user: true
		}
	})
}

//used by middleware so not enforcing auth check
export async function writeAuditLogEntry(entry) {
	const { companyId, userId, action, target, sourceIp } = entry
	return prisma.auditLog.create({
		data: {
			action,
			target,
			sourceIp,
			company: {
				connect: {
					companyId
				}
			},
			user: {
				connect: {
					userId
				}
			}
		},
		include: {
			company: true,
			user: true
		}
	})
}
