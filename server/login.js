import { prisma } from '../prisma/database.js'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from './user.js'
import jwt from 'jsonwebtoken'

//look up user, compare password and return JWT if success
//TODO: validate user
//TODO: error handling
export async function login(email, password) {
	const user = await getUserByEmail(email)
	const valid = await bcrypt.compare(password, user.password)
	if (!valid) {
		throw new Error('invalid user/password')
	}
	console.log('password is valid so generating token')
	//generate jwt and return
	const JWT_SECRET = process.env.JWT_SECRET
	const { userId, companyId, role } = user
	const token = jwt.sign({ email, userId, companyId, role }, JWT_SECRET, {
		expiresIn: '24h'
	})
	return token
}
