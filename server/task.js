import { prisma } from '../prisma/database.js'

export async function createTask(companyId, userId, task) {
	const { title, notes, status, hoursEstimate } = task
	return prisma.task.create({
		data: {
			companyId,
			userId,
			title,
			notes,
			status,
			private: task.private,
			hoursEstimate,
			taskList: {
				connect: {
					taskListId: parseInt(task.taskListId)
				}
			}
		},
		include: {
			taskList: true,
			company: true,
			user: true
		}
	})
}

export async function updateTask(taskId, task) {
	const { title, notes, status, hoursEstimate } = task
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
			taskList: true
		}
	})
}

export async function deleteTask(taskId) {
	await prisma.task.delete({
		where: { taskId }
	})
	return taskId
}
