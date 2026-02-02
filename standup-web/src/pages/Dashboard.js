import React, { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_USER } from '../queries'
import { useAuth } from '../contexts/AuthContext'
import LogoutLink from '../components/LogoutLink'
import TaskList from '../components/TaskList'

const Dashboard = () => {
	const { user } = useAuth()

	console.log(
		`inside dashboard about to send get user query with user ${JSON.stringify(user)}`
	)
	const { loading, error, data } = useQuery(GET_USER, {
		variables: { userId: user.userId }
	})
	console.log(`get user response data:${JSON.stringify(data)}`)

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error.message}</p>

	return (
		<div>
			<h1>Task Lists</h1>
			{data.user.taskLists.map(taskList => (
				<div>
					<TaskList currentData={taskList} />
					<br></br>
				</div>
			))}
			<LogoutLink />
		</div>
	)
}

export default Dashboard
