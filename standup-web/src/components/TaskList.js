import React, { useState } from 'react'
import TaskForm from './TaskForm'
import Typography from '@mui/material/Typography'
import { Box, Button } from '@mui/material'
import { useAuth } from '../contexts/AuthContext.js'
import { subject } from '@casl/ability'
import { getCurrentDataClone } from '../utils.js'

const TaskList = ({ currentData, header }) => {
	const { ability } = useAuth()

	const handleCreateTask = e => {
		//create task here
	}

	function getCreateTaskRender() {
		console.log(`ability: ${JSON.stringify(ability)}`)
		console.log(`currentData: ${JSON.stringify(currentData)}`)
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
					<TaskForm currentData={task} />
				</Box>
			))}
		</div>
	)
}

export default TaskList
