import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'

function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route path="/login" element={<Login />} />

					<Route element={<PrivateRoute />}>
						<Route path="/" element={<Dashboard />} />
						<Route path="/dashboard" element={<Dashboard />} />
					</Route>
				</Routes>
			</AuthProvider>
		</Router>
	)
}

export default App
