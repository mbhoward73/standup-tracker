import React, { createContext, useContext, useState, useEffect } from 'react'
import { LOGIN_MUTATION } from '../mutations'
import { useMutation } from '@apollo/client/react'
import { jwtDecode } from 'jwt-decode'
import { defineAbilitiesFor } from '../abilities'

const AuthContext = createContext(null)

export const useAuth = () => {
	return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [token, setToken] = useState(null)
	const [ability, setAbility] = useState(null)
	const [loading, setLoading] = useState(true)
	const [loginMutation] = useMutation(LOGIN_MUTATION)

	const login = async (email, password) => {
		try {
			const { data } = await loginMutation({ variables: { email, password } })
			const token = data.login
			const decodedToken = jwtDecode(token)
			setUser(decodedToken)
			setToken(token)
			setAbility(defineAbilitiesFor(decodedToken))
			localStorage.setItem('authToken', token)
			return true
		} catch (error) {
			console.error('Login failed', error)
		}
	}

	const logout = () => {
		setUser(null)
		setToken(null)
		setAbility(null)
		localStorage.removeItem('authToken')
	}

	useEffect(() => {
		const storedToken = localStorage.getItem('authToken')
		if (storedToken) {
			const decodedToken = jwtDecode(storedToken)
			setUser(decodedToken)
			setToken(storedToken)
			setAbility(defineAbilitiesFor(decodedToken))
		}
		setLoading(false)
	}, [])

	const value = {
		user,
		token,
		ability,
		loading,
		login,
		logout
	}

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	)
}
