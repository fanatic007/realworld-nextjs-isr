import { Prisma } from ".prisma/client";
import { User } from "../types";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
// READ
export const getUser = async (query:Partial<User>)=> {
  return await prisma.user.findUnique({
    where: query
  }) as User;
}

export const addUser = async (userData:Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data: userData
  }) as User;
}

export const updateUser = async (query:Partial<User>,data:Partial<User>) => {
  const updatedUser = await prisma.user.update({
    where:query,
    data: data,
  }) as User;
  return updatedUser;
}

