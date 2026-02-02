import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const ADD_USER = gql`
	mutation AddUser($name: String!, $email: String!) {
		addUser(name: $name, email: $email) {
			id
			name
			email
		}
	}
`

function AddUser() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [addUser, { data, loading, error }] = useMutation(ADD_USER)

	const handleSubmit = async e => {
		e.preventDefault()
		await addUser({ variables: { name, email } })
		setName('')
		setEmail('')
	}

	return (
		<div>
			<h2>Add User</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={name}
					onChange={e => setName(e.target.value)}
					placeholder="Name"
					required
				/>
				<input
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					placeholder="Email"
					required
				/>
				<button type="submit">Add User</button>
			</form>
			{loading && <p>Loading...</p>}
			{error && <p>Error: {error.message}</p>}
			{data && <p>User added successfully!</p>}
		</div>
	)
}

export default AddUser
