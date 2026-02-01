import { prisma } from '../../prisma/database.js'
import { dateScalar } from './customScalars.js'
import { getUserTaskLists } from '../taskList.js'
import { getTeam } from '../team.js'
import pmap from 'p-map'
import flatten from 'lodash.flatten'

//TODO: add authorization
//TODO: keep this file simple and move as much as I can into individual server files
//TODO: add user queries - this should fetch everything
//TODO: break out into separate files for each resource
//TODO: add validation - what happens when invalid arguments are passed in (eg. userId not found)
const Query = {
	userTaskLists: async (parent, args) => {
		return getUserTaskLists(args.userId)
	},
	teamTaskLists: async (parent, args) => {
		const team = await getTeam(args.teamId)
		const taskLists = await pmap(team.members, user =>
			getUserTaskLists(user.userId)
		)
		console.log(`found team taskLists ${JSON.stringify(taskLists)}`)
		return flatten(taskLists)
	}
}

//TODO: pick up here - finish these queries
const Mutation = {
	createTask: (parent, args) => {
		const postArgs = args.post
		return prisma.post.create({
			data: {
				title: postArgs.title,
				category: {
					connectOrCreate: {
						where: {
							name: postArgs.category.name
						},
						create: {
							name: postArgs.category.name,
							isActive: postArgs.category.isActive
						}
					}
				},
				detail: {
					create: {
						text: postArgs.detail.text
					}
				}
			},
			include: {
				category: true,
				detail: true
			}
		})
	},
	updateTask: (parent, args) => {
		const postArgs = args.post
		return prisma.post.update({
			where: { id: Number(args.id) },
			data: {
				title: postArgs.title,
				category: {
					connectOrCreate: {
						where: {
							name: postArgs.category.name
						},
						create: {
							name: postArgs.category.name,
							isActive: postArgs.category.isActive
						}
					}
				},
				detail: {
					update: {
						text: postArgs.detail.text
					}
				}
			},
			include: {
				category: true,
				detail: true
			}
		})
	},
	deleteTask: (parent, args) => {
		const postArgs = args.post
		return prisma.post.update({
			where: { id: Number(args.id) },
			data: {
				title: postArgs.title,
				category: {
					connectOrCreate: {
						where: {
							name: postArgs.category.name
						},
						create: {
							name: postArgs.category.name,
							isActive: postArgs.category.isActive
						}
					}
				},
				detail: {
					update: {
						text: postArgs.detail.text
					}
				}
			},
			include: {
				category: true,
				detail: true
			}
		})
	}
}

export const resolvers = { Date: dateScalar, Query, Mutation }
