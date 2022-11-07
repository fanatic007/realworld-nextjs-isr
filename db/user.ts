import { Prisma } from ".prisma/client";
import { USER_RESPONSE_FIELDS } from "../constants";
import { User } from "../types";
import { prisma } from './db';

export const getUser = async (query:Partial<User>,fields?:Prisma.UserSelect)=> {
  return await prisma.user.findUnique({
    where: query,
    select: fields
  }) as User;
}

export const addUser = async (userData:Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data: userData,
    select: USER_RESPONSE_FIELDS
  });
}

export const updateUser = async (query:Partial<User>,data:Partial<User>) => {
  const updatedUser = await prisma.user.update({
    where:query,
    data: data,
    select: USER_RESPONSE_FIELDS
  });
  return updatedUser;
}

