import { prisma } from '../prisma/database.js'
import { dateScalar } from './customScalars.js'
import { getUserTaskLists, getTeamTaskLists } from '../model/taskList.js'
import { getUser } from '../model/user.js'
import { createTask, updateTask, deleteTask } from '../model/task.js'
import { getAuditLog } from '../model/auditLog.js'
import { updateTeam } from '../model/team.js'
import { login } from '../model/login.js'
import { forbidden } from '../error.js'
import { DateTimeResolver } from 'graphql-scalars'
import { subject } from '@casl/ability'

//TODO: add validation - what happens when invalid arguments are passed in (eg. arg ids not found)
const Query = {
	user: async (parent, args, context) => {
		const { companyId } = context.userData
		const userId = parseInt(args.userId)
		return getUser(companyId, userId, context.ability)
	},
	userTaskLists: async (parent, args, context) => {
		const { companyId, teamId } = context.userData
		const userId = parseInt(args.userId)
		return getUserTaskLists(companyId, userId, teamId, context.ability)
	},
	teamTaskLists: async (parent, args, context) => {
		const { companyId, userId, role } = context.userData
		const teamId = parseInt(args.teamId)
		if (!ability.can('update', 'Team')) {
			forbidden()
		}
		return getTeamTaskLists(companyId, teamId, userId, context.ability)
	},
	auditLog: async (parent, args, context) => {
		const { companyId, userId } = context.userData

		const ability = context.ability
		if (!ability.can('read', subject('AuditLog', { companyId }))) {
			forbidden()
		}
		return getAuditLog(companyId, ability)
	}
}

const Mutation = {
	login: async (parent, args, context) => {
		const { email, password } = args
		return login(email, password)
	},
	createTask: (parent, args, context) => {
		const { companyId, userId, teamId } = context.userData
		const task = args.task
		return createTask(companyId, userId, teamId, task, context.ability)
	},
	updateTask: (parent, args, context) => {
		const taskId = parseInt(args.taskId)
		const task = args.task
		return updateTask(taskId, task, context.ability)
	},
	deleteTask: (parent, args, context) => {
		const taskId = parseInt(args.taskId)
		return deleteTask(taskId, context.ability)
	},
	updateTeam: (parent, args, context) => {
		const ability = context.ability
		if (!ability.can('update', 'Team')) {
			forbidden()
		}

		const teamId = parseInt(args.teamId)
		const team = args.team
		return updateTeam(teamId, team, context.ability)
	}
}

export const resolvers = {
	Date: dateScalar,
	DateTime: DateTimeResolver,
	Query,
	Mutation
}
