import { prisma } from '../prisma/database.js'

async function seedDatabase() {
	const company1 = await prisma.company.create({
		data: {
			name: 'BreachRx'
		}
	})

	const team1 = await prisma.team.create({
		data: {
			name: 'Angular Devs'
		}
	})

	const team2 = await prisma.team.create({
		data: {
			name: 'Company Admins'
		}
	})

	const developer1 = await prisma.user.create({
		data: {
			company: {
				connect: { companyId: company1.companyId }
			},
			firstName: 'Josh',
			lastName: 'Wilson',
			email: 'jwilson@breachrx.com',
			role: 'DEVELOPER',
			team: {
				connect: { teamId: team1.teamId }
			},
			taskLists: {
				create: getTaskListSeedData()
			}
		}
	})

	const developer2 = await prisma.user.create({
		data: {
			company: {
				connect: { companyId: company1.companyId }
			},
			firstName: 'Steve',
			lastName: 'Ridzik',
			email: 'sridzik@breachrx.com',
			role: 'DEVELOPER',
			team: {
				connect: { teamId: team1.teamId }
			},
			taskLists: {
				create: getTaskListSeedData()
			}
		}
	})

	const manager = await prisma.user.create({
		data: {
			company: {
				connect: { companyId: company1.companyId }
			},
			firstName: 'Matt',
			lastName: 'Hartley',
			email: 'mhartley@breachrx.com',
			role: 'MANAGER',
			team: {
				connect: { teamId: team1.teamId }
			},
			taskLists: {
				create: getTaskListSeedData()
			}
		}
	})

	const companyAdmin = await prisma.user.create({
		data: {
			company: {
				connect: { companyId: company1.companyId }
			},
			firstName: 'Andy',
			lastName: 'Lunsford',
			email: 'alunsford@breachrx.com',
			role: 'COMPANY_ADMIN',
			team: {
				connect: { teamId: team2.teamId }
			}
		}
	})
}

function getTaskListSeedData() {
	const currentDate = new Date('2026-01-25')
	const numDays = 10
	const taskLists = []
	for (let i = 0; i < numDays; i++) {
		const taskList = {
			taskListDate: new Date(currentDate),
			tasks: {
				create: getTasksSeedData(3)
			}
		}
		taskLists.push(taskList)
		currentDate.setDate(currentDate.getDate() + 1)
	}
	return taskLists
}

function getTasksSeedData(numTasks) {
	const tasks = []
	for (let i = 0; i < numTasks; i++) {
		tasks.push(getTaskSeedData())
	}
	return tasks
}

function getTaskSeedData() {
	return {
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
