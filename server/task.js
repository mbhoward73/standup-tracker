import { prisma } from './prisma/database.js'
import { accessibleBy } from '@casl/prisma'
import { forbidden } from './error.js'
import { subject } from '@casl/ability'

export async function createTask(companyId, userId, teamId, task, ability) {
	if (!ability.can('create', subject('Task', { companyId, userId, teamId }))) {
		forbidden()
	}

	const { title, notes, status, hoursEstimate } = task
	return prisma.task.create({
		data: {
			title,
			notes,
			status,
			private: task.private,
			hoursEstimate,
			company: {
				connect: {
					companyId: parseInt(companyId)
				}
			},
			user: {
				connect: {
					userId: parseInt(userId)
				}
			},
			team: {
				connect: {
					teamId: parseInt(teamId)
				}
			},
			taskList: {
				connect: {
					taskListId: parseInt(task.taskListId)
				}
			}
		},
		include: {
			taskList: true,
			company: true,
			user: true,
			team: true
		}
	})
}

export async function updateTask(taskId, task, ability) {
	const { title, notes, status, hoursEstimate } = task

	const existingTask = await prisma.task.findUnique({ where: { taskId } })
	if (!ability.can('update', subject('Task', existingTask))) {
		forbidden()
	}

	return prisma.task.update({
		where: {
			taskId
		},
		data: {
			title,
			notes,
			status,
			private: task.private,
			hoursEstimate
		},
		include: {
			company: true,
			user: true,
			team: true,
			taskList: true
		}
	})
}

export async function deleteTask(taskId, ability) {
	const existingTask = await prisma.task.findUnique({ where: { taskId } })
	if (!ability.can('delete', subject('Task', existingTask))) {
		forbidden()
	}

	await prisma.task.delete({
		where: { taskId }
	})
	return taskId
}
