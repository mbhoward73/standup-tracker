import { PrismaClient } from '@prisma/client'

//ensure that we only create one instance of prisma client in dev environment
//since too many connections can cause issues
let prismaGlobal = undefined

export const prisma = prismaGlobal || new PrismaClient()
