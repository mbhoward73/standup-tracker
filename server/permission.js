import { AbilityBuilder, PureAbility } from '@casl/ability'
import { createPrismaAbility } from '@casl/prisma'

export function defineAbilitiesFor(user) {
	const { can, cannot, build } = new AbilityBuilder(createPrismaAbility)

	switch (user.role) {
		case 'ADMIN': {
			can('manage', 'all')
			break
		}
		case 'COMPANY_ADMIN': {
			can('manage', 'all')
			can('read', 'Post', { published: true }) // General users can read all published posts
			break
		}
		case 'MANAGER': {
			can('read', 'Post', { published: true }) // General users can read all published posts
			break
		}
		case 'DEVELOPER': {
			can('read', 'Post', { published: true }) // General users can read all published posts
			break
		}
		default:
			throw new Error(`unrecognized role ${user.role}`)
	}

	// if (user.role === 'ADMIN') {
	// 	can('manage', 'all')
	// } else {
	// 	can('read', 'Post', { published: true }) // General users can read all published posts
	// 	can('create', 'Post') // Can create posts
	// 	can('update', 'Post', { authorId: user.id }) // Can update only their own posts
	// 	can('delete', 'Post', { authorId: user.id }) // Can delete only their own posts
	// }

	return build()
}
