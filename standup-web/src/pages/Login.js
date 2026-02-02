import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.js'

const Login = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const from = location.state?.from || '/dashboard'
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { loading, error, login } = useAuth()

	const handleSubmit = async event => {
		event.preventDefault()
		const formData = {
			email: event.target.email.value,
			password: event.target.password.value
		}
		console.log(`email: ${email} - password: ${password}`)
		if (formData.email && formData.password) {
			const success = await login(formData.email, formData.password)
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
		<form onSubmit={handleSubmit}>
			<h2>Login</h2>
			<div>
				<label htmlFor="email">Email:</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					required
				/>
			</div>
			<div>
				<label htmlFor="password">Password:</label>
				<input
					id="password"
					type="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					required
				/>
			</div>
			<button type="submit" disabled={loading}>
				{loading ? 'Logging in...' : 'Login'}
			</button>
			{error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
		</form>
	)
}

export default Login
