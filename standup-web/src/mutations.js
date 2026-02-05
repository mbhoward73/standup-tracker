import { gql } from '@apollo/client'

export const LOGIN_MUTATION = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password)
	}
`
export const UPDATE_TASK_MUTATION = gql`
	mutation UpdateTask($taskId: ID!, $task: TaskInput!) {
		updateTask(taskId: $taskId, task: $task) {
			title
			notes
			status
			private
			hoursEstimate
			userId
			companyId
			taskId
			taskListId
			teamId
		}
	}
`

export const CREATE_TASK_MUTATION = gql`
	mutation CreateTask($task: TaskInput!) {
		createTask(task: $task) {
			title
			notes
			status
			private
			hoursEstimate
			userId
			companyId
			taskId
			taskListId
			teamId
		}
	}
`

export const DELETE_TASK_MUTATION = gql`
	mutation DeleteTask($taskId: ID!) {
		deleteTask(taskId: $taskId)
	}
`
