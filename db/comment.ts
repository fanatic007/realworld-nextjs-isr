import { prisma } from './db'
import { Prisma } from ".prisma/client";
import { User, UserPayload } from "../types";
import { userResponseFields } from "../constants";

export const createComment = async (body:string, username:string,slug:string)=> {
  return await prisma.comment.create({
    data: {
      body, 
      article: {
        connect: { slug }
      },
      authorUser:{
        connect:{ username }
      }, 
    }
  });
}

export const getComments = async (userData:Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data: userData,
    select: userResponseFields
  });
}

export const deleteComment = async (query:Partial<User>,data:Partial<User>) => {
  const updatedUser: UserPayload = await prisma.user.update({
    where:query,
    data: data,
    select: userResponseFields
  });
  return updatedUser;
}

