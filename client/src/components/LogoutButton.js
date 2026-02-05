import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.js'
import Button from '@mui/material/Button'

const LogoutButton = () => {
	const navigate = useNavigate()
	const { logout } = useAuth()

	const handleLogout = () => {
		logout()
		navigate('/login')
		window.location.reload()
	}

	return (
		<Button
			sx={{ my: 2 }}
			variant="contained"
			color="primary"
			onClick={e => {
				e.preventDefault()
				handleLogout()
			}}>
			Logout
		</Button>
	)
}

export default LogoutButton
