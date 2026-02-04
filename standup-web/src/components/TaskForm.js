import React, { useEffect, useRef, useState } from 'react'
import {
	Box,
	TextField,
	Typography,
	Paper,
	CircularProgress,
	FormControl,
	Select,
	MenuItem,
	FormControlLabel,
	Checkbox,
	Button
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext.js'
import { subject } from '@casl/ability'
import { getCurrentDataClone } from '../utils.js'

const AUTO_SAVE_DELAY = 800

//TODO: check manager view and make sure task lists are separated
//TODO: hook up create and delete buttons (make sure new task is added to top of list)
//TODO: hook up graphql mutations (create, update, delete)
//TODO: test login as company admin  make sure it doesn't blow up with empty task lists
//TODO: in manager view modify server so managers tasks are at top of list - or do it on client side?

const TASK_STATUS_KEYS = [
	'PENDING',
	'IN_PROGRESS',
	'COMPLETED',
	'BLOCKED',
	'NEED_HELP'
]

const TaskForm = ({ currentData }) => {
	const [formData, setFormData] = useState({
		title: currentData.title,
		status: currentData.status,
		notes: currentData.notes,
		private: currentData.private,
		hoursEstimate: currentData.hoursEstimate
	})
	const { ability } = useAuth()

	const [status, setStatus] = useState('idle') // idle | saving | saved | error
	const saveTimeout = useRef(null)
	const isFirstRender = useRef(true)

	const saveChanges = async data => {
		setStatus('saving')

		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 600))
			// console.log('Saved:', data)

			setStatus('saved')
		} catch (err) {
			setStatus('error')
		}
	}

	useEffect(() => {
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
	}, [formData])

	const handleChange = field => e => {
		const value =
			typeof e.target.checked === 'boolean' ? e.target.checked : e.target.value
		setFormData(prev => ({
			...prev,
			[field]: value
		}))
	}

	const handleDeleteTask = e => {
		//delete task here
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
						margin="none"
						value={formData.hoursEstimate}
						onChange={handleChange('hoursEstimate')}
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
						/>
					}
					label="Private"
				/>
			)
		} else {
			return ''
		}
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
						onChange={handleChange('status')}>
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
				/>
			</Box>

			{getDeleteButtonRender(currentData, ability)}

			{/* <Box mt={2} display="flex" alignItems="center" gap={1}>
				{status === 'saving' && (
					<>
						<CircularProgress size={16} />
						<Typography variant="body2">Saving…</Typography>
					</>
				)}

				{status === 'saved' && (
					<Typography variant="body2" color="success.main">
						All changes saved
					</Typography>
				)}

				{status === 'error' && (
					<Typography variant="body2" color="error.main">
						Error saving changes
					</Typography>
				)}
			</Box> */}
		</Paper>
	)
}

export default TaskForm
