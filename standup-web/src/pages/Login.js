import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.js'
import {
	Container,
	Box,
	Button,
	TextField,
	Typography,
	Paper
} from '@mui/material'

const Login = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const from = location.state?.from || '/dashboard'
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { loading, error, login } = useAuth()

	const handleSubmit = async event => {
		event.preventDefault()
		if (email && password) {
			const success = await login(email, password)
			if (success) {
				navigate(from, { replace: true })
			} else {
				alert('Login failed')
			}
		} else {
			alert('Please provide valid input')
		}
	}

	return (
		<Container maxWidth="md">
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="100vh">
				<Paper elevation={3} sx={{ p: 4, width: 360 }}>
					<Typography variant="h5" mb={2} align="center">
						Stand-up Tracker Login
					</Typography>

					<Box component="form" onSubmit={handleSubmit}>
						<TextField
							label="Email"
							type="email"
							fullWidth
							required
							margin="normal"
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>

						<TextField
							label="Password"
							type="password"
							fullWidth
							required
							margin="normal"
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>

						<Button
							type="submit"
							variant="contained"
							fullWidth
							sx={{ mt: 2 }}
							disabled={loading}>
							{loading ? 'Logging in...' : 'Login'}
						</Button>
						{error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
					</Box>
				</Paper>
			</Box>
		</Container>
	)
}

export default Login
