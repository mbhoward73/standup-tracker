import React, { useState } from 'react'
import Task from './Task'

const TaskList = ({ currentData }) => {
	return (
		<div>
			<h2>
				{currentData.taskListDate} - {currentData.user.firstName}{' '}
				{currentData.user.lastName}
			</h2>

			{currentData.tasks.map(task => (
				<div>
					<Task currentData={task} />
					<br></br>
				</div>
			))}
		</div>
	)
}

export default TaskList
