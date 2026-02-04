export function getCurrentDataClone(currentData) {
	const currentDataClone = { ...currentData }
	currentDataClone.companyId = parseInt(currentDataClone.companyId)
	currentDataClone.userId = parseInt(currentDataClone.userId)
	currentDataClone.teamId = parseInt(currentDataClone.teamId)
	return currentDataClone
}
