import React from 'react'
import TaskForm from './TaskForm'
import Typography from '@mui/material/Typography'
import { Box, Button } from '@mui/material'
import { useAuth } from '../contexts/AuthContext.js'
import { subject } from '@casl/ability'
import { getCurrentDataClone } from '../utils.js'
import { CREATE_TASK_MUTATION } from '../mutations.js'
import { useMutation } from '@apollo/client/react'

const TaskList = ({ currentData, header, onDataRefresh }) => {
	const { ability } = useAuth()
	const [createTask, { loading, error }] = useMutation(CREATE_TASK_MUTATION)

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error fetching data.</div>

	const handleCreateTask = async e => {
		try {
			const taskInput = {
				taskListId: parseInt(currentData.taskListId),
				title: 'New Task',
				status: 'PENDING',
				private: false
			}

			const result = await createTask({
				variables: { task: taskInput }
			})
			console.log(
				`successfully created task ${JSON.stringify(result.data.createTask)}`
			)
			await onDataRefresh()
		} catch (e) {
			console.log(e)
		}
	}

	function getCreateTaskRender() {
		if (
			ability.can('create', subject('Task', getCurrentDataClone(currentData)))
		) {
			return (
				<Box my={2} display="flex" justifyContent="center">
					<Button
						variant="contained"
						color="primary"
						onClick={e => {
							e.preventDefault()
							handleCreateTask()
						}}>
						Add Task
					</Button>
				</Box>
			)
		} else {
			return ''
		}
	}

	return (
		<div>
			<Typography variant="h5" component="h5" align="center" gutterBottom>
				{header}
			</Typography>
			<Typography variant="h6" component="h6" align="center" gutterBottom>
				{currentData.taskListDate}
			</Typography>
			{getCreateTaskRender()}
			{currentData.tasks.map(task => (
				<Box
					my="12"
					sx={{
						p: '4',
						width: '100%'
					}}>
					<TaskForm currentData={task} onDataRefresh={onDataRefresh} />
				</Box>
			))}
		</div>
	)
}

export default TaskList
