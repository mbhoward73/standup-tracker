export const GRAPHQL_URL = 'http://localhost:4000'

export function getLoginMutation() {
	return `mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password)
	}`
}

export function getSimpleUserQuery() {
	return `query User($userId: ID!) {
                user(userId: $userId) {
                    firstName
                    lastName
					email
					userId
					role
                }
            }
    `
}

export function getUserQueryWithTaskLists() {
	return `query User($userId: ID!) {
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
}

export function getAuditLogQuery() {
	return `
        query AuditLog {
            auditLog {
                auditLogId
                action
                sourceIp
                timestamp
                company {
                    companyId
                    name
                }
                user {
                    userId
                    firstName
                    lastName
                }
            }
        }
    `
}
