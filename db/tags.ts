import { PrismaClient } from '@prisma/client'
import { prisma } from './db'

// READ
export const getTags = async () => {
  let tags = await prisma.tag.findMany({
    where: {},
    distinct: ['title'] ,
    select:{title:true}
  });
  return tags;
}