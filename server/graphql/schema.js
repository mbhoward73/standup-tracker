import gql from 'graphql-tag'

export const typeDefs = gql`
	enum TaskStatus {
		PENDING
		IN_PROGRESS
		COMPLETED
		BLOCKED
		NEED_HELP
	}

	enum UserRole {
		DEVELOPER
		MANAGER
		COMPANY_ADMIN
		ADMIN
	}

	enum AuditLogAction {
		READ
		UPDATE
		CREATE
		DELETE
		LOGIN
		LOGOUT
	}

	enum AuditLogTarget {
		COMPANY
		USER
		TEAM
		TASK_LIST
		TASK
	}

	scalar Date
	scalar DateTime

	type Company {
		companyId: ID!
		name: String!
		users: [User!]!
	}

	type User {
		userId: ID!
		company: Company!
		firstName: String!
		lastName: String!
		email: String!
		role: UserRole!
		taskLists: [TaskList!]!
		team: Team!
	}

	type Team {
		teamId: ID!
		company: Company!
		name: String!
		members: [User!]!
	}

	type TaskList {
		taskListId: ID!
		companyId: ID!
		userId: ID!
		teamId: ID!
		company: Company!
		user: User!
		team: Team!
		taskListDate: Date!
		tasks: [Task!]!
	}

	type Task {
		taskId: ID!
		userId: ID!
		companyId: ID!
		taskListId: ID!
		teamId: ID!
		company: Company!
		user: User!
		team: Team!
		taskList: TaskList!
		title: String!
		notes: String
		status: TaskStatus!
		private: Boolean
		hoursEstimate: Int
		createdAt: DateTime!
	}
	
	type AuditLog {
		auditLogId: ID!
		userId: ID!
		user: User!
		companyId: ID!
		company: Company!
		action: AuditLogAction!
		target: AuditLogTarget!
		sourceIp: String!
		timestamp: DateTime!
	}

	type Query {
		user(userId: ID!): User!
		userTaskLists(userId: ID!): [TaskList]!
		teamTaskLists(teamId: ID!): [TaskList]!
		auditLog(): AuditLog!
	}

	type Mutation {
		login(email: String!, password: String!): String!
		createTask(task: TaskInput!): Task!
		updateTask(taskId: ID!, task: TaskInput!): Task!
		deleteTask(taskId: ID!): ID!
		updateTeam(teamId: ID!, team: TeamInput!): Team!
	}

	input TaskInput {
		taskListId: ID!
		title: String!
		notes: String
		status: TaskStatus!
		private: Boolean!
		hoursEstimate: Int
	}

	input TeamInput {
		name: String!
	}
`
