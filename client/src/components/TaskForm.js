import React, { useEffect, useRef, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import {
	Box,
	TextField,
	Typography,
	Paper,
	Select,
	MenuItem,
	FormControlLabel,
	Checkbox,
	Button
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext.js'
import { subject } from '@casl/ability'
import { getCurrentDataClone } from '../utils.js'
import { UPDATE_TASK_MUTATION, DELETE_TASK_MUTATION } from '../mutations.js'
import pick from 'lodash.pick'

const AUTO_SAVE_DELAY = 2000

const TASK_STATUS_KEYS = [
	'PENDING',
	'IN_PROGRESS',
	'COMPLETED',
	'BLOCKED',
	'NEED_HELP'
]

const TaskForm = ({ currentData, onDataRefresh }) => {
	const [formData, setFormData] = useState({
		taskId: currentData.taskId,
		taskListId: currentData.taskListId,
		title: currentData.title,
		status: currentData.status,
		notes: currentData.notes || '',
		private: currentData.private,
		hoursEstimate: currentData.hoursEstimate || undefined
	})

	const { ability } = useAuth()

	const saveTimeout = useRef(null)
	const isFirstRender = useRef(true)

	const [updateTask] = useMutation(UPDATE_TASK_MUTATION)
	const [deleteTask] = useMutation(DELETE_TASK_MUTATION)

	useEffect(() => {
		const saveChanges = async data => {
			if (!data.title) {
				return
			}
			try {
				const taskInput = pick(data, [
					'taskListId',
					'title',
					'notes',
					'status',
					'private',
					'hoursEstimate'
				])
				taskInput.hoursEstimate = taskInput.hoursEstimate
					? parseInt(taskInput.hoursEstimate)
					: undefined

				const result = await updateTask({
					variables: { taskId: data.taskId, task: taskInput }
				})
				console.log(
					`successfully updated task to ${JSON.stringify(result.data.updateTask)}`
				)
			} catch (e) {
				console.log(e)
			}
		}

		// Prevent auto-save on initial render
		if (isFirstRender.current) {
			isFirstRender.current = false
			return
		}

		// Clear previous debounce
		if (saveTimeout.current) {
			clearTimeout(saveTimeout.current)
		}

		// Debounced save
		saveTimeout.current = setTimeout(() => {
			saveChanges(formData)
		}, AUTO_SAVE_DELAY)

		return () => clearTimeout(saveTimeout.current)
	}, [formData, updateTask])

	const handleChange = field => e => {
		const value =
			field === 'private' && typeof e.target.checked === 'boolean'
				? e.target.checked
				: e.target.value
		setFormData(prev => ({
			...prev,
			[field]: value
		}))
	}

	const handleDeleteTask = async e => {
		try {
			const result = await deleteTask({
				variables: { taskId: formData.taskId }
			})
			console.log(
				`successfully deleted task ${JSON.stringify(result.data.deleteTask)}`
			)
			await onDataRefresh()
		} catch (e) {
			console.log(e)
		}
	}

	const FieldLabel = ({ children }) => (
		<Typography variant="body2" fontWeight={500} mb={0.5}>
			{children}
		</Typography>
	)

	function getHoursEstimateRender() {
		if (
			ability.can(
				'read',
				subject('Task', getCurrentDataClone(currentData)),
				'hoursEstimate'
			)
		) {
			return (
				<Box mb={2} mx={4}>
					<FieldLabel>Hours Estimate</FieldLabel>
					<TextField
						sx={{ width: 100 }}
						type="number"
						margin="none"
						value={formData.hoursEstimate}
						onChange={handleChange('hoursEstimate')}
						disabled={isTaskReadOnly()}
						inputProps={{
							readOnly: isTaskReadOnly()
						}}
					/>
				</Box>
			)
		} else {
			return ''
		}
	}

	function getPrivateCheckboxRender() {
		if (
			ability.can(
				'read',
				subject('Task', getCurrentDataClone(currentData)),
				'private'
			)
		) {
			return (
				<FormControlLabel
					sx={{ whiteSpace: 'nowrap', m: 0 }}
					control={
						<Checkbox
							checked={formData.private}
							onChange={handleChange('private')}
							disabled={isTaskReadOnly()}
							inputProps={{
								readOnly: isTaskReadOnly()
							}}
						/>
					}
					label="Private"
				/>
			)
		} else {
			return ''
		}
	}

	function isTaskReadOnly() {
		return !ability.can(
			'update',
			subject('Task', getCurrentDataClone(currentData))
		)
	}

	function getDeleteButtonRender() {
		if (
			ability.can('delete', subject('Task', getCurrentDataClone(currentData)))
		) {
			return (
				<Box mx={4} display="flex" justifyContent="flex-end">
					<Button
						variant="contained"
						color="primary"
						onClick={e => {
							e.preventDefault()
							handleDeleteTask()
						}}>
						Delete Task
					</Button>
				</Box>
			)
		} else {
			return ''
		}
	}

	return (
		<Paper sx={{ p: 3, width: '100%', border: '2px solid' }}>
			<Box mb={2} mx={4}>
				<FieldLabel>Title</FieldLabel>
				<TextField
					fullWidth
					margin="none"
					value={formData.title}
					onChange={handleChange('title')}
					disabled={isTaskReadOnly()}
					inputProps={{
						readOnly: isTaskReadOnly()
					}}
				/>
			</Box>

			<Box mb={2} mx={4}>
				<FieldLabel>Status</FieldLabel>

				<Box display="flex" alignItems="center" gap={2}>
					<Select
						labelId="status-label"
						id="status"
						value={formData.status}
						label="Status"
						onChange={handleChange('status')}
						disabled={isTaskReadOnly()}
						inputProps={{
							readOnly: isTaskReadOnly()
						}}>
						{TASK_STATUS_KEYS.map(taskStatusKey => {
							const taskStatusLabel = taskStatusKey
								.replaceAll('_', ' ')
								.toLowerCase()
								.replace(/(^|\s)\S/g, char => char.toUpperCase())
							return (
								<MenuItem value={taskStatusKey}>{taskStatusLabel}</MenuItem>
							)
						})}
					</Select>
					{getPrivateCheckboxRender(currentData, ability)}
				</Box>
			</Box>

			{getHoursEstimateRender(currentData, ability)}

			<Box mb={2} mx={4}>
				<FieldLabel>Notes</FieldLabel>
				<TextField
					fullWidth
					multiline
					rows={3}
					margin="none"
					value={formData.notes}
					onChange={handleChange('notes')}
					disabled={isTaskReadOnly()}
					inputProps={{
						readOnly: isTaskReadOnly()
					}}
				/>
			</Box>

			{getDeleteButtonRender(currentData, ability)}
		</Paper>
	)
}

export default TaskForm
