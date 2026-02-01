import { gql } from 'apollo-server'

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

  scalar Date

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
    name: String!
    members: [User!]!
  }

  type TaskList {
    taskListId: ID!
    user: User!
    taskListDate: Date!
    tasks: [Task!]! 
  }

  type Task {
    taskId: ID!
    taskList: TaskList!
    title: String!
    notes: String
    status: TaskStatus!
    private: Boolean!
    hoursEstimate: Int
  }

  type Query {
    userTaskLists(userId: String!): [TaskList]!
    teamTaskLists(teamId: String!): [TaskList]!
  }

  type Mutation {
    createTask(task: taskInput!): Task!
    updateTask(taskId: String!, task: taskInput!): Task!
    deleteTask(taskId: String!): String!
  }

  input taskInput {
    title: String!
    notes: String
    status: TaskStatus!
    private: Boolean!
    hoursEstimate: String
  }

`