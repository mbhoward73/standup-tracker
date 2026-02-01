import { prisma } from '../prisma/database.js'

export async function createTask(task) {
	const { title, notes, status, hoursEstimate } = task
	return prisma.task.create({
		data: {
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
			taskList: true
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
