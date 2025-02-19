import {PrismaClient} from "@prisma/client"

export const prismaClient=new PrismaClient()

export const JWT_SECRET = process.env.JWT_SECRET || `MYNAMEISHIMANSHU`;