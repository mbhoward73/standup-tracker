import * as React from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper
} from '@mui/material'
import { GET_AUDIT_LOG } from '../queries'
import { useQuery } from '@apollo/client/react'

const rows = [
	{ id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
	{ id: 2, name: 'Bob Smith', email: 'bob@example.com' },
	{ id: 3, name: 'Carol Davis', email: 'carol@example.com' }
]

const AuditLog = () => {
	const { loading, error, data } = useQuery(GET_AUDIT_LOG)

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error fetching data.</div>

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>User</TableCell>
						<TableCell>Action</TableCell>
						<TableCell>Source IP</TableCell>
						<TableCell>Timestamp</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{data.auditLog.map(row => (
						<TableRow key={row.auditLogId}>
							<TableCell>{`${row.user.firstName} ${row.user.lastName}`}</TableCell>
							<TableCell>{row.action}</TableCell>
							<TableCell>{row.sourceIp}</TableCell>
							<TableCell>{row.timestamp}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default AuditLog
