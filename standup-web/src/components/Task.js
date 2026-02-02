import React, { useState } from 'react'

const Task = ({ currentData }) => {
	return (
		<div>
			<b>Title: {currentData.title}</b>
			<br />
			Notes: {currentData.notes}
			<br />
			Status: {currentData.status}
			<br />
			Private: {currentData.private ? 'true' : 'false'}
			<br />
			Hours Estimate: {currentData.hoursEstimate}
			<br />
		</div>
	)
}

export default Task
