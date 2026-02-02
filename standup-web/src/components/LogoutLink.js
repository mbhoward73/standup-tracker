import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.js'

const LogoutLink = () => {
	const navigate = useNavigate()
	const { logout } = useAuth()

	const handleLogout = () => {
		logout()
		navigate('/login')
		window.location.reload()
	}

	return (
		<a
			href="#"
			onClick={e => {
				e.preventDefault()
				handleLogout()
			}}>
			Logout
		</a>
	)
}

export default LogoutLink
