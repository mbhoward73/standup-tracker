import React, { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_USER } from '../queries'
import { useAuth } from '../contexts/AuthContext'
import LogoutButton from '../components/LogoutButton'
import TaskList from '../components/TaskList'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { Box } from '@mui/material'

function getUserNames(taskLists) {
	return taskLists.reduce((acc, cur) => {
		const name = `${cur.user.firstName} ${cur.user.lastName}`
		if (!acc.includes(name)) {
			acc.push(name)
		}
		return acc
	}, [])
}

const Dashboard = () => {
	const { user } = useAuth()

	const { loading, error, data } = useQuery(GET_USER, {
		variables: { userId: user.userId }
	})
	console.log(`get user response data:${JSON.stringify(data)}`)

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error.message}</p>

	return (
		<Container maxWidth="xl">
			<Typography
				variant="h3"
				component="h1"
				align="center"
				gutterBottom
				sx={{ my: 4 }}>
				Stand-up Tracker
			</Typography>
			<Typography
				variant="h4"
				component="h4"
				align="center"
				gutterBottom
				sx={{ mb: 4 }}>
				Team: {data.user.team.name}
			</Typography>
			{getUserNames(data.user.taskLists).map((userName, userNameIdx) => {
				return (
					<div>
						<Typography
							variant="h4"
							component="h3"
							align="center"
							gutterBottom
							sx={{ my: 2 }}>
							{userName}
						</Typography>
						<Grid
							container
							spacing={2}
                            mb={8}
							justifyContent="center"
							alignContent="center">
							<Grid item size={4}>
								<TaskList
									currentData={data.user.taskLists[userNameIdx * 3 + 0]}
									header="Yesterday"
								/>
							</Grid>
							<Grid item size={4}>
								<TaskList
									currentData={data.user.taskLists[userNameIdx * 3 + 1]}
									header="Today"
								/>
							</Grid>
							<Grid item size={4}>
								<TaskList
									currentData={data.user.taskLists[userNameIdx * 3 + 2]}
									header="Tomorrow"
								/>
							</Grid>
						</Grid>
					</div>
				)
			})}

			<Box textAlign="center">
				<LogoutButton />
			</Box>
		</Container>
	)
}

export default Dashboard
