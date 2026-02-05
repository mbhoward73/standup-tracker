import React from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_USER } from '../queries'
import { useAuth } from '../contexts/AuthContext'
import LogoutButton from '../components/LogoutButton'
import TaskList from '../components/TaskList'
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
	const { loading, error, data, refetch } = useQuery(GET_USER, {
		variables: { userId: user.userId }
	})

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error fetching data.</div>

	if (data.user.taskLists.length === 0) {
		return (
			<Container maxWidth="xl">
				<Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
					<Box sx={{ flex: 1 }} />

					<Typography
						variant="h3"
						component="h1"
						align="center"
						gutterBottom
						sx={{ my: 4, mx: 'auto' }}>
						Stand-up Tracker
					</Typography>

					<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
						<LogoutButton />
					</Box>
				</Box>

				<Typography
					variant="h4"
					component="h4"
					align="center"
					gutterBottom
					sx={{ mb: 4 }}>
					Team: {data.user.team.name}
				</Typography>
				<Typography
					variant="h4"
					component="h4"
					align="center"
					gutterBottom
					sx={{ mb: 4 }}>
					No task lists found
				</Typography>
			</Container>
		)
	}

	return (
		<Container maxWidth="xl">
			<Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
				<Box sx={{ flex: 1 }} />

				<Typography
					variant="h3"
					component="h1"
					align="center"
					gutterBottom
					sx={{ my: 4, mx: 'auto' }}>
					Stand-up Tracker
				</Typography>

				<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
					<LogoutButton />
				</Box>
			</Box>

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
							<Grid size={4}>
								<TaskList
									currentData={data.user.taskLists[userNameIdx * 3 + 0]}
									header="Yesterday"
									onDataRefresh={refetch}
								/>
							</Grid>
							<Grid size={4}>
								<TaskList
									currentData={data.user.taskLists[userNameIdx * 3 + 1]}
									header="Today"
									onDataRefresh={refetch}
								/>
							</Grid>
							<Grid size={4}>
								<TaskList
									currentData={data.user.taskLists[userNameIdx * 3 + 2]}
									header="Tomorrow"
									onDataRefresh={refetch}
								/>
							</Grid>
						</Grid>
					</div>
				)
			})}
		</Container>
	)
}

export default Dashboard
