export function getCurrentTaskListDates() {
	const currentDate = new Date()
	const today = new Date(currentDate)
	currentDate.setDate(currentDate.getDate() - 1)
	const yesterday = new Date(currentDate)
	currentDate.setDate(currentDate.getDate() + 2)
	const tomorrow = new Date(currentDate)
	return [yesterday, today, tomorrow]
}

export function getCurrentTaskListDatesFormatted() {
	return getCurrentTaskListDates().map(d => formatDate(d))
}

export function formatDate(date) {
	return date.toISOString().slice(0, 10)
}
