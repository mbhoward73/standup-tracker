import { prisma } from '../../prisma/database.js'
import { dateScalar } from './customScalars.js'
import { getUserTaskLists, getTeamTaskLists } from '../taskList.js'
import { getUser } from '../user.js'
import { createTask, updateTask, deleteTask } from '../task.js'
import { login } from '../login.js'

//TODO: add authorization
//TODO: add validation - what happens when invalid arguments are passed in (eg. arg ids not found)
const Query = {
	user: async (parent, args, context) => {
		return getUser(parseInt(args.userId))
	},
	userTaskLists: async (parent, args, context) => {
		return getUserTaskLists(
			parseInt(context.userData.companyId),
			parseInt(args.userId)
		)
	},
	teamTaskLists: async (parent, args, context) => {
		return getTeamTaskLists(
			parseInt(context.userData.companyId),
			parseInt(args.teamId)
		)
	}
}

const Mutation = {
	login: async (parent, args, context) => {
		return login(args.email, args.password)
	},
	createTask: (parent, args, context) => {
		return createTask(
			parseInt(context.userData.companyId),
			parseInt(context.userData.userId),
			args.task
		)
	},
	updateTask: (parent, args, context) => {
		return updateTask(parseInt(args.taskId), args.task)
	},
	deleteTask: (parent, args, context) => {
		return deleteTask(parseInt(args.taskId))
	}
}

export const resolvers = { Date: dateScalar, Query, Mutation }
