import { prisma } from '../prisma/database.js'
import bcrypt from 'bcryptjs'

async function seedDatabase() {
	const company1 = await prisma.company.create({
		data: {
			name: 'BreachRx'
		}
	})

	const team1 = await prisma.team.create({
		data: {
			name: 'Angular Devs',
			company: {
				connect: { companyId: company1.companyId }
			}
		}
	})

	const team2 = await prisma.team.create({
		data: {
			name: 'Company Admins',
			company: {
				connect: { companyId: company1.companyId }
			}
		}
	})

	const password1 = await hashPassword('josh')

	const developer1 = await prisma.user.create({
		data: {
			company: {
				connect: { companyId: company1.companyId }
			},
			firstName: 'Josh',
			lastName: 'Wilson',
			email: 'jwilson@breachrx.com',
			password: password1,
			role: 'DEVELOPER',
			team: {
				connect: { teamId: team1.teamId }
			},
			taskLists: {
				create: getTaskListSeedData(company1)
			}
		}
	})

    // await prisma.taskList

	const password2 = await hashPassword('steve')

	const developer2 = await prisma.user.create({
		data: {
			company: {
				connect: { companyId: company1.companyId }
			},
			firstName: 'Steve',
			lastName: 'Ridzik',
			email: 'sridzik@breachrx.com',
			password: password2,
			role: 'DEVELOPER',
			team: {
				connect: { teamId: team1.teamId }
			},
			taskLists: {
				create: getTaskListSeedData(company1)
			}
		}
	})

	const password3 = await hashPassword('matt')

	const manager = await prisma.user.create({
		data: {
			company: {
				connect: { companyId: company1.companyId }
			},
			firstName: 'Matt',
			lastName: 'Hartley',
			email: 'mhartley@breachrx.com',
			password: password3,
			role: 'MANAGER',
			team: {
				connect: { teamId: team1.teamId }
			},
			taskLists: {
				create: getTaskListSeedData(company1)
			}
		}
	})

	const password4 = await hashPassword('andy')

	const companyAdmin = await prisma.user.create({
		data: {
			company: {
				connect: { companyId: company1.companyId }
			},
			firstName: 'Andy',
			lastName: 'Lunsford',
			email: 'alunsford@breachrx.com',
			password: password4,
			role: 'COMPANY_ADMIN',
			team: {
				connect: { teamId: team2.teamId }
			}
		}
	})
}

//TODO: pick up here
//TODO: change this to async peach and crate task lists with call to prisma.taskList.create
//TODO: need to connect company, user
//TODO: after successful seed sanity test data with prisma studio
//TODO: re-test all queries with postman
//TODO: re-test front-end
//TODO: continue with back-end casl implementation
//TODO: move to front-end casl implementation
//TODO: implement error handling and query validation

function getTaskListSeedData(company, user) {
	const currentDate = new Date('2026-01-25')
	const numDays = 10
	const taskLists = []
	for (let i = 0; i < numDays; i++) {
		const taskList = {
			taskListDate: new Date(currentDate),
			company: {
				connect: { companyId: company.companyId }
			},
			user: {
				connect: { userId: user.userId }
			},
			tasks: {
				create: getTasksSeedData(company, user, 3)
			}
		}
		taskLists.push(taskList)
		currentDate.setDate(currentDate.getDate() + 1)
	}
	return taskLists
}

function getTasksSeedData(company, user, numTasks) {
	const tasks = []
	for (let i = 0; i < numTasks; i++) {
		tasks.push(getTaskSeedData(company, user))
	}
	return tasks
}

function getTaskSeedData(company, user) {
	return {
		company: {
			connect: { companyId: company.companyId }
		},
		user: {
			connect: { userId: user.userId }
		},
		title: `Task #${getRandomInt(1000)}`,
		status: getRandomTaskStatus(),
		private: false
	}
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max)
}

function getRandomTaskStatus() {
	const random = getRandomInt(5)
	switch (random) {
		case 0:
			return 'PENDING'
		case 1:
			return 'IN_PROGRESS'
		case 2:
			return 'COMPLETED'
		case 3:
			return 'BLOCKED'
		case 4:
			return 'NEED_HELP'
		default:
			throw new Error(`unrecognized task status ${random}`)
	}
}

async function clearDatabase() {
	await prisma.task.deleteMany({})
	await prisma.taskList.deleteMany({})
	await prisma.user.deleteMany({})
	await prisma.team.deleteMany({})
	await prisma.company.deleteMany({})
}

async function hashPassword(password) {
	const salt = await bcrypt.genSalt(10)
	return bcrypt.hash(password, salt)
}

try {
	console.log('clearing db')
	await clearDatabase()
	console.log('seeding db')
	await seedDatabase()
	console.log(`finished seeding db`)
	await prisma.$disconnect()
} catch (e) {
	console.error(e)
	await prisma.$disconnect()
	process.exit(1)
}
