import { prisma } from '../prisma/database.js'
import {
	getCurrentTaskListDates,
	getCurrentTaskListDatesFormatted,
	formatDate
} from '../utils/date.js'
import { getTeam } from './team.js'
import peach from 'p-each-series'
import pmap from 'p-map'
import flatten from 'lodash.flatten'

//find user task lists for yesterday/today/tomorrow and create new task lists if any are missing
export async function getUserTaskLists(userId) {
	const taskLists = await fetchUserTaskLists(userId)
	if (taskLists.length === 3) {
		return taskLists
	}

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

export async function getTeamTaskLists(teamId) {
	const team = await getTeam(teamId)
	const taskLists = await pmap(team.members, user =>
		getUserTaskLists(user.userId)
	)
	return flatten(taskLists)
}

async function fetchUserTaskLists(userId) {
	return prisma.taskList.findMany({
		where: {
			userId: userId,
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
			userId,
			taskListDate
		},
		include: {
			user: true,
			tasks: true
		}
	})
}
