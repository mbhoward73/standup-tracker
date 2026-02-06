import { prisma } from '../prisma/database.js'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from './user.js'
import jwt from 'jsonwebtoken'

//look up user, compare password and return JWT if success
//no authorization check here since we don't have user context yet
//TODO: validate user
//TODO: error handling
export async function login(email, password) {
	const user = await getUserByEmail(email)
	const valid = await bcrypt.compare(password, user.password)
	if (!valid) {
		throw new Error('invalid user/password')
	}
	//generate jwt and return
	const JWT_SECRET = process.env.JWT_SECRET
	const { userId, companyId, role, teamId } = user
	const token = jwt.sign(
		{ email, userId, companyId, role, teamId },
		JWT_SECRET,
		{
			expiresIn: '24h'
		}
	)
	return token
}
