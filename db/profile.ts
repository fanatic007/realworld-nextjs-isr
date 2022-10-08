import { Prisma } from ".prisma/client";
import { ProfilePayload, User, UserPayload } from "../types";
import { PrismaClient } from '@prisma/client'
import { userResponseFields } from "../constants";

const prisma = new PrismaClient()
// READ
export const getProfile = async (query:Partial<User>,fields?:Prisma.UserSelect)=> {
  return await prisma.user.findUnique({
    where: query,
    select: fields
  }) as ProfilePayload;
}
