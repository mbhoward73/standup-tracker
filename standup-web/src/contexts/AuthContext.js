import React, { createContext, useContext, useState, useEffect } from 'react'
import { LOGIN_MUTATION } from '../mutations'
import { useMutation } from '@apollo/client/react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext(null)

export const useAuth = () => {
	return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
	console.log('inside auth provider')
	const [user, setUser] = useState(null)
	const [token, setToken] = useState(null)
	const [loading, setLoading] = useState(true)
	const [loginMutation] = useMutation(LOGIN_MUTATION)
	console.log('after all hooks')

	const login = async (email, password) => {
		try {
			console.log('about to call login mutation')
			const { data } = await loginMutation({ variables: { email, password } })
			console.log(`received data ${JSON.stringify(data)}`)
			const token = data.login
			console.log('Logged in successfully, token:', token)
			const decodedPayload = jwtDecode(token)
			console.log(`decodedPayload:${JSON.stringify(decodedPayload)}`)
			setUser(decodedPayload)
			setToken(token)
			localStorage.setItem('authToken', token)
			return true

			// const { token, user } = data.login
			// localStorage.setItem('token', token)
			// setToken(token)
			// setUser(user)
		} catch (error) {
			console.error('Login failed', error)
		}
	}

	// const loginAction = async data => {
	// 	try {
	// 		const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
	// 			onCompleted: data => {
	// 				try {
	// 					const token = data.login.token
	// 					localStorage.setItem('AUTH_TOKEN', token)
	// 					console.log('Logged in successfully, token:', token)
	// 					const decodedPayload = jwtDecode(token)
	// 					console.log(`decodedPayload:${JSON.stringify(decodedPayload)}`)
	// 					setUser(decodedPayload.userData)
	// 					setToken(token)
	// 					localStorage.setItem('authToken', token)
	// 					return true
	// 				} catch (e) {
	// 					throw new Error('error decoding jwt token')
	// 				}
	// 			},
	// 			onError: error => {
	// 				console.error('Login error:', error.message)
	// 			}
	// 		})
	// 	} catch (err) {
	// 		console.error(err)
	// 		return false
	// 	}
	// }

	const logout = () => {
		setUser(null)
		setToken(null)
		localStorage.removeItem('authToken')
	}

	useEffect(() => {
		const storedToken = localStorage.getItem('authToken')
		console.log(`inside useEffect found token ${storedToken}`)
		if (storedToken) {
			const decodedPayload = jwtDecode(storedToken)
			setUser(decodedPayload)
			setToken(storedToken)
		}
		setLoading(false)
	}, [])

	const value = {
		user,
		token,
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
