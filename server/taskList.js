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
import { accessibleBy } from '@casl/prisma'
import { forbidden } from './error.js'
import { permittedFieldsOf } from '@casl/ability/extra'
import pick from 'lodash.pick'
import isEmpty from 'lodash.isempty'
import { subject } from '@casl/ability'

//find user task lists for yesterday/today/tomorrow and create new task lists if any are missing
export async function getUserTaskLists(companyId, userId, teamId, ability) {
	console.log(
		`getting user tasks lists for company ${companyId} and user ${userId}`
	)
	const taskLists = await fetchUserTaskLists(userId, ability)
	if (taskLists.length === 3) {
		console.log('returning 3 task lists')
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
			await createTaskList(
				companyId,
				userId,
				teamId,
				new Date(expectedDate),
				ability
			)
		}
	})

	return await fetchUserTaskLists(userId, ability)
}

export async function getTeamTaskLists(companyId, teamId, ability) {
	console.log('inside get team task lists')
	const team = await getTeam(teamId, ability)
	const taskLists = await pmap(team.members, user =>
		getUserTaskLists(companyId, user.userId, teamId, ability)
	)
	return flatten(taskLists)
}

async function fetchUserTaskLists(userId, ability) {
	const currentTaskListDates = getCurrentTaskListDates()
	console.log(`currentTaskListDates: ${JSON.stringify(currentTaskListDates)}`)
	console.log(`ability: ${JSON.stringify(ability)}`)
	const fetchedTaskLists = await prisma.taskList.findMany({
		where: {
			AND: [
				accessibleBy(ability).TaskList,
				{
					userId,
					taskListDate: {
						in: currentTaskListDates
					}
				}
			]
		},
		take: 3,
		orderBy: [
			{
				taskListDate: 'asc'
			}
		],
		include: {
			company: true,
			user: true,
			team: true,
			tasks: true
		}
	})
	console.log('about to check fields')

	const TASK_FIELDS = ['title', 'notes', 'status', 'private', 'hoursEstimate']
	const options = { fieldsFrom: rule => rule.fields || TASK_FIELDS }

	return fetchedTaskLists.map(taskList => {
		const sanitizedTasks = taskList.tasks.map(task => {
			const permittedTaskFields = permittedFieldsOf(
				ability,
				'read',
				subject('Task', task),
				options
			)
			console.log(`permittedFields: ${JSON.stringify(permittedTaskFields)}`)
			return pick(task, permittedTaskFields)
		})
		taskList.tasks = sanitizedTasks.filter(task => !isEmpty(task))
		return taskList
	})
}

export async function createTaskList(
	companyId,
	userId,
	teamId,
	taskListDate,
	ability
) {
	if (!ability.can('create', 'TaskList', { companyId, userId, teamId })) {
		forbidden()
	}

	return prisma.taskList.create({
		data: {
			companyId,
			userId,
			teamId,
			taskListDate
		},
		include: {
			company: true,
			user: true,
			team: true,
			tasks: true
		}
	})
}
