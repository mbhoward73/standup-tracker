import { prisma } from '../prisma/database.js'
import {
	getCurrentTaskListDates,
	getCurrentTaskListDatesFormatted,
	formatDate
} from '../utils/date.js'
import peach from 'p-each-series'

//find all current user task lists and create new task lists if necessary
export async function getUserTaskLists(userId) {
	const taskLists = await fetchUserTaskLists(userId)
	if (taskLists.length === 3) {
		console.log('found 3 task lists so returning')
		return taskLists
	}

	console.log(`some task lists are missing ${JSON.stringify(taskLists)}`)

	//create any missing taskLists - it's a little strange this happens as part of query operation
	//but just trying to simplify the implementation for now
	//TODO: this is not atomic and could cause race condition - change to upsert if this code isn't removed
	const foundDates = taskLists.map(taskList =>
		formatDate(taskList.taskListDate)
	)

	await peach(getCurrentTaskListDatesFormatted(), async expectedDate => {
		if (!foundDates.includes(expectedDate)) {
			await createTaskList(userId, new Date(expectedDate))
		}
	})

	return await fetchUserTaskLists(userId)
}

async function fetchUserTaskLists(userId) {
	return prisma.taskList.findMany({
		where: {
			userId: parseInt(userId),
			taskListDate: {
				in: getCurrentTaskListDates()
			}
		},
		take: 3,
		orderBy: [
			{
				taskListDate: 'asc'
			}
		],
		include: {
			user: true,
			tasks: true
		}
	})
}

export async function createTaskList(userId, taskListDate) {
	return prisma.taskList.create({
		data: {
			userId: parseInt(userId),
			taskListDate
		},
		include: {
			user: true,
			tasks: true
		}
	})
}
