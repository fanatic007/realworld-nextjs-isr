import { prisma } from './db'
import { Prisma } from ".prisma/client";
import { User, UserPayload } from "../types";
import { userResponseFields } from "../constants";

export const getUser = async (query:Partial<User>,fields?:Prisma.UserSelect)=> {
  return await prisma.user.findUnique({
    where: query,
    select: fields
  }) as User;
}

export const addUser = async (userData:Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data: userData,
    select: userResponseFields
  });
}

export const updateUser = async (query:Partial<User>,data:Partial<User>) => {
  const updatedUser: UserPayload = await prisma.user.update({
    where:query,
    data: data,
    select: userResponseFields
  });
  return updatedUser;
}

