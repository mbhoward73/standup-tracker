import { prisma } from '../../prisma/database.js'
import { dateScalar } from './customScalars.js'
import { getUserTaskLists, getTeamTaskLists } from '../taskList.js'
import { getUser } from '../user.js'
import { createTask, updateTask, deleteTask } from '../task.js'

//TODO: add authorization
//TODO: add validation - what happens when invalid arguments are passed in (eg. arg ids not found)
const Query = {
	user: async (parent, args) => {
		return getUser(parseInt(args.userId))
	},
	userTaskLists: async (parent, args) => {
		return getUserTaskLists(parseInt(args.userId))
	},
	teamTaskLists: async (parent, args) => {
		return getTeamTaskLists(parseInt(args.teamId))
	}
}

const Mutation = {
	createTask: (parent, args) => {
		return createTask(args.task)
	},
	updateTask: (parent, args) => {
		return updateTask(parseInt(args.taskId), args.task)
	},
	deleteTask: (parent, args) => {
		return deleteTask(parseInt(args.taskId))
	}
}

export const resolvers = { Date: dateScalar, Query, Mutation }
