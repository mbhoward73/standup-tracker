import { gql } from '@apollo/client'

export const GET_USER = gql`
	query User($userId: ID!) {
		user(userId: $userId) {
			firstName
			lastName
			email
			role
			company {
				name
			}
			team {
				teamId
				name
			}
			taskLists {
				taskListId
				taskListDate
				companyId
				userId
				teamId
				user {
					userId
					firstName
					lastName
				}
				tasks {
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
                    createdAt
				}
			}
		}
	}
`
