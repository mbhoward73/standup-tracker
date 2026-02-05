import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.js'

const PrivateRoute = () => {
	const { token, loading } = useAuth()
	const location = useLocation()

	if (loading) {
		return <div>Loading...</div>
	}

	return token ? (
		<Outlet />
	) : (
		<Navigate to="/login" state={{ from: location }} replace />
	)
}

export default PrivateRoute
